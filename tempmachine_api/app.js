const express = require("express");
const app = express();
const azureController = require("./src/controller/azureController.js");

// Middleware for parsing data into JSON
app.use(express.json());

// User routes
app.use("/vm", azureController);

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
const port = 8282;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
