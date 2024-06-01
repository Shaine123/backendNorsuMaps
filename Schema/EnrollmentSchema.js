const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Step schema
const stepSchema = new Schema({
  info: { type: String, required: false },
  text: { type: String, required: true },
  isReminder: { type: Boolean, default: false }
}, { _id: false });

// Define the College schema
const collegeSchema = new Schema({
  heading: { type: String, required: true },
  steps: [stepSchema]
}, { _id: false });

// Define the Enrollment schema
const enrollmentSchema = new Schema({
  CAS: { type: collegeSchema, required: true },
  CAF: { type: collegeSchema, required: true },
  CBA: { type: collegeSchema, required: true },
  CCJE: { type: collegeSchema, required: true },
  CTE: { type: collegeSchema, required: true },
  CIT: { type: collegeSchema, required: true }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;
