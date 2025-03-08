const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../../api/users/user.model");
const { isValidEmail, isValidPassword } = require("../helpers/validators");

/**
 * Esta es la estrategia de registro.
 *
 * Intentaremos poner "filtros" o condiciones para evitar
 * registros no deseados.
 *
 * 1. Comprobar que el usuario no existe.
 * 2. Email válido
 * 3. Contraseña válida (8 caracteres, 1 mayus)
 *
 * 4. Si el usuario cumple con los requisitos, lo registraremos y
 * si no cumple, no lo registremos.
 */

const saltRounds = 10;

const registerStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    try {
      const existingUser = await User.findOne({ email: email.toLowerCase() });

      if (existingUser) {
        const error = new Error("El usuario ya existe");
        return done(error, null);
      }

      if (!isValidEmail(email)) {
        const error = new Error("El email no es válido");
        return done(error, null);
      }

      if (!isValidPassword(password)) {
        const error = new Error(
          "La contraseña no cumple las reglas. 8 carácteres, 1 mayúscula y 1 número"
        );
        return done(error, null);
      }

      const encryptedPassword = await bcrypt.hash(password, saltRounds);

      const user = new User({
        ...req.body,
        email,
        password: encryptedPassword,
      });

      const userDB = await user.save();

      userDB.password = "Jaque Mate maligno, no transferimos contraseñass";

      return done(null, userDB);
    } catch (error) {
      return done(error.message);
    }
  }
);

module.exports = registerStrategy;
