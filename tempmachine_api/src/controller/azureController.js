const express = require("express");
const router = express.Router();
const azureService = require("../service/azureService.js");

azureService.configureResources();
router.post("/create", azureService.createVM);
router.post("/delete", azureService.deleteVM);

router.post("/start", azureService.startVM);
router.post("/stop", azureService.stopVM);
router.get("/types", azureService.getOsList);
router.get("/counter", azureService.getCounter);

module.exports = router;
