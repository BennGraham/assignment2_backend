const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  position: {
    type: String,
  },
  salary: {
    type: Number,
  },
  date_of_joining: Date,
  department: {
    type: String,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Employee = mongoose.model("Employee", employeeSchema, "employees");

module.exports = Employee;
