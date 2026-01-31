const express = require("express"); // import express
const cors = require("cors"); // import cors
const cookieParser = require("cookie-parser")
const errHandler = require("../utils/errorHandler"); // import error handler

const mainRoutes = require("./routes/MainRoutes"); // import main routes
// Create express app
const app = express();

// Middleware
app.use(express.json()); // enable JSON parsing, so raw JSON can be used immediately
app.use(cookieParser())
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Support both Vite ports
  credentials: true
})); // enable CORS, where other domains can access my API
app.use(express.urlencoded({ extended: true })); // enable parsing of URL-encoded data, so form data can be used

// API routes
app.use("/api", mainRoutes);

// Global error handler
app.use(errHandler);

module.exports = app;
