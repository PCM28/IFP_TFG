const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  return res.send("Servidor funcionando OK");
});

router.get("/test", (req, res) => {
  return res.send("Prueba realizada correctamente. Servidor funcionando.");
});

module.exports = router;
