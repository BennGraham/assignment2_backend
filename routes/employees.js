const express = require("express");
const EmployeeModel = require("../models/employees");
const { body, validationResult } = require("express-validator");
const routes = express.Router();

// Get all employees
routes.get("/emp/employees", async (_, res) => {
  try {
    const employees = await EmployeeModel.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new employee
routes.post(
  "/emp/employees",
  [
    body("first_name")
      .notEmpty()
      .withMessage("First name is required")
      .isString({ min: 1 })
      .withMessage("First name must be at least 1 character long"),
    body("last_name").optional().isString(),
    body("email")
      .notEmpty()
      .withMessage("Email address is required")
      .isEmail()
      .withMessage("Email address is invalid"),
    body("position").optional().isString(),
    body("salary")
      .optional()
      .isNumeric()
      .withMessage("Salary must be a number"),
    body("date_of_joining").optional(),
    body("department").optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const newEmployee = new EmployeeModel(req.body);
      const savedEmployee = await newEmployee.save();
      res.status(201).json({
        message: "Employee created successfully.",
        employee_id: savedEmployee._id,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

// Get employee by id
routes.get("/emp/employees/:eid", async (req, res) => {
  try {
    const employee = await EmployeeModel.findById(req.params.eid);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update employee information
routes.put(
  "/emp/employees/:eid",
  [
    body("first_name")
      .optional()
      .isString({ min: 1 })
      .withMessage("First name must be at least 1 character long"),
    body("last_name").optional().isString(),
    body("email").optional().isEmail().withMessage("Email address is invalid"),
    body("position").optional().isString(),
    body("salary")
      .optional()
      .isNumeric()
      .withMessage("Salary must be a number"),
    body("date_of_joining").optional(),
    body("department").optional().isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const employeeId = req.params.eid;
      const { eid, ...updateData } = req.body;

      const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
        employeeId,
        {
          ...updateData,
          updated_at: new Date(),
        },
        { new: true, runValidators: true },
      );

      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json({
        message: "Employee details updated successfully.",
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      if (error.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Validation Error", details: error.errors });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
);

// Delete employee by id
routes.delete("/emp/employees", async (req, res) => {
  try {
    const deletedEmployee = await EmployeeModel.findByIdAndDelete(
      req.query.eid,
    );
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(204).json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = routes;