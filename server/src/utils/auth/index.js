const passport = require("passport");
const registerStrategy = require("./register");
const loginStrategy = require("./login");
const User = require("../../api/users/user.model");

passport.serializeUser((user, done) => {
  console.log('Serializando usuario:', user._id);
  return done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    console.log('Deserializando usuario:', userId);
    const existingUser = await User.findById(userId).select('-password');
    if (!existingUser) {
      console.log('Usuario no encontrado en deserialización');
      return done(null, false);
    }
    console.log('Usuario deserializado exitosamente:', existingUser._id);
    return done(null, existingUser);
  } catch (error) {
    console.error('Error en deserialización:', error);
    return done(error);
  }
});

passport.use("logincito", loginStrategy);
passport.use("registrito", registerStrategy);

// Middleware de autenticación personalizado
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('Usuario no autenticado en middleware');
  res.status(401).json({ message: 'Usuario no autenticado' });
};

module.exports = {
  isAuthenticated
};
