const passport = require("passport");
const registerStrategy = require("./register");
const loginStrategy = require("./login");
const User = require("../../api/users/user.model");

passport.serializeUser((user, done) => {
  return done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const existingUser = await User.findById(userId);
    return done(null, existingUser);
  } catch (error) {
    return done(error);
  }
});

passport.use("logincito", loginStrategy);
passport.use("registrito", registerStrategy);
