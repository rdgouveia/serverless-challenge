const { Schema } = require("mongoose");

const Employee = new Schema({
  name: String,
  age: Number,
  role: String,
});

module.exports = Employee;
