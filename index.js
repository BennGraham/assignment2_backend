const express = require("express");
const employeesRoutes = require("../routes/employees");
const usersRoutes = require("../routes/users");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: [
      "101412278-comp-3123-assignment2.vercel.app",
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

const SERVER_PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});
