const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../../api/users/user.model");
const { isValidEmail, isValidPassword } = require("../helpers/validators");

const loginStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    try {
      console.log('Intentando login con email:', email);

      if (!isValidEmail(email) || !isValidPassword(password)) {
        console.log('Email o contraseña con formato inválido');
        const error = new Error("El email o la contraseña no tienen un formato válido");
        return done(error, null);
      }

      const existingUser = await User.findOne({ email }).populate("posts");

      if (!existingUser) {
        console.log('Usuario no encontrado:', email);
        const error = new Error("El usuario no existe");
        return done(error, null);
      }

      const isValidUserPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isValidUserPassword) {
        console.log('Contraseña incorrecta para usuario:', email);
        const error = new Error("La contraseña no coincide");
        error.status = 401;
        return done(error, null);
      }

      // Crear una copia limpia del usuario sin la contraseña
      const userForSession = existingUser.toObject();
      delete userForSession.password;

      console.log('Login exitoso para usuario:', email);
      console.log('Datos de usuario para sesión:', userForSession);

      return done(null, userForSession);
    } catch (error) {
      console.error('Error en estrategia de login:', error);
      return done(error, null);
    }
  }
);

module.exports = loginStrategy;
