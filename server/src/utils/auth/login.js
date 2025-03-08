const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../../api/users/user.model");
const Post = require("../../api/posts/post.model"); // Asegúrate de importar el modelo
const { isValidEmail, isValidPassword } = require("../helpers/validators");

const loginStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    if (!isValidEmail(email) || !isValidPassword(password)) {
      const error = new Error(
        "El email o la contraseña no tienen un formato válido"
      );
      return done(error, null);
    }

    try {
      const existingUser = await User.findOne({ email }).populate("posts");

      if (!existingUser) {
        const error = new Error("El usuario no existe");
        return done(error, null);
      }

      const isValidUserPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isValidUserPassword) {
        const error = new Error("La contraseña no coincide");
        error.status = 401;
        return done(error, null);
      }

      existingUser.password = null;

      return done(null, existingUser);
    } catch (error) {
      return done(error, null);
    }
  }
);

module.exports = loginStrategy;
