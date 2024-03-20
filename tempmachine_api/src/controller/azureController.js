const express = require("express");
const router = express.Router();
const azureService = require("../service/azureService.js");

router.get("/test", azureService.test);

// // Authentication
// router.post("/login", azureService.login);
// router.post("/register", azureService.register);

module.exports = router;
