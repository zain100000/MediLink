const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  profilePicture: {
    type: String,
  },

  fullName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  dob: {
    type: String,
    required: true,
  },

  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],

  visitedDoctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
  ],

  medicalHistory: {
    type: [String],
  },
});

module.exports = mongoose.model("Patient", patientSchema);
