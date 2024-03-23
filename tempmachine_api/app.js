const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const azureController = require("./src/controller/azureController.js");
const authController = require("./src/controller/authController.js");

// Middleware for parsing data into JSON
app.use(express.json());

app.use(cors());

app.use(cookieParser());

// azure routes
app.use("/vm", azureController);

// User routes
app.use("/auth", authController);

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
