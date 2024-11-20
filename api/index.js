const express = require("express");
const employeesRoutes = require("../routes/employees");
const usersRoutes = require("../routes/users");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

app.use(
  cors({
    origin: [
      "101412278-comp-3123-assignment1.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((e) => {
    console.error(e);
  });

const app = express();

const SERVER_PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers - adjust as needed for your React frontend
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' *",
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

// Routes
app.use("/api/v1", employeesRoutes);
app.use("/api/v1", usersRoutes);

// Root
app.route("/").get((req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// API health check
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "error - status: 500" });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${SERVER_PORT}/`);
  });
}

// export app for Vercel deployment
module.exports = app;
