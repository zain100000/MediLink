const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
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
  },

  gender: {
    type: String,
  },

  address: {
    type: String,
  },

  specialization: {
    type: String,
  },

  departments: {
    type: [String], // ["Orthopedic", "Neurology"]
  },

  qualifications: {
    type: [String], //["MBBS", "MD"]
  },

  experience: {
    type: String,
  },

  consultationFee: {
    type: Number,
  },

  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],

  visitedPatients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
  ],

  isActive: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
