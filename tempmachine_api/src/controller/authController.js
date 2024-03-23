const express = require("express");
const router = express.Router();
const authService = require("../service/authService.js");

// Authentication
router.post("/login", authService.login);
router.post("/logout", authService.logout);

module.exports = router;
