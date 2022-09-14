const express = require("express");
const { generatePdf } = require("../controller/homeController");

const router = express.Router();

router.get("/download", generatePdf);

module.exports = {
  routes: router,
};
