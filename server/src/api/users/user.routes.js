const express = require("express");
const controller = require("./user.controller");

const router = express.Router();

router
  .post("/register", controller.registerPost)
  .get("/user/:id", controller.getUserPosts)
  .post("/login", controller.loginPost)
  .post("/logout", controller.logoutPost)
  .get("/check-session", controller.checkSessionGet)
  .post("/test", controller.test)
  .put("/:id", controller.putUser);

module.exports = router;
