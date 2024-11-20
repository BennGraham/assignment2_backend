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
app.use(express.static(path.join(__dirname, "../public")));

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://vercel.live; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'",
  );
  next();
});

// Routes
app.use("/api/v1", employeesRoutes);
app.use("/api/v1", usersRoutes);

// API health check
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Root
app.route("/").get((req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.listen(SERVER_PORT, () => {
  console.log(`Server running at http://localhost:${SERVER_PORT}/`);
});
