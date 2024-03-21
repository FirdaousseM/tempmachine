const express = require("express");
const router = express.Router();
const azureService = require("../service/azureService.js");

// Azure
router.get("/configure", azureService.configureResources);
router.post("/create", azureService.createVM);
router.post("/delete", azureService.deleteVM);

router.post("/start", azureService.deleteVM);
router.post("/stop", azureService.stopVM);

// // Authentication
// router.post("/login", azureService.login);
// router.post("/register", azureService.register);

module.exports = router;
