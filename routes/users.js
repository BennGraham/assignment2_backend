const express = require("express");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/users");
const { body, validationResult } = require("express-validator");
const routes = express.Router();

// Sign up new user
routes.post(
  "/user/signup",
  [
    body("username").notEmpty().withMessage("Username is required").isString(),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email address is invalid"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isString({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { username, email, password } = req.body;
      const existingUser = await UserModel.findOne({
        email,
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const savedUser = await newUser.save();

      res.status(201).json({
        message: "User created successfully.",
        user_id: savedUser._id,
      });
    } catch (error) {
      console.error("Signup error:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },
);

// Login user
routes.post(
  "/user/login",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email address is invalid"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isString()
      .withMessage("password must be at least 8 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;

      // Find user by username
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ status: false, message: "Invalid email address" });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ status: false, message: "Incorrect password" });
      }

      res.status(200).json({
        message: "Login successful.",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

module.exports = routes;
