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

  specialization: {
    type: String,
    required: true,
  },

  departments: {
    type: [String], // ["Orthopedic", "Neurology"]
    required: true,
  },

  qualifications: {
    type: [String], //["MBBS", "MD"]
    required: true,
  },

  experience: {
    type: String,
    required: true,
  },

  consultationFee: {
    type: Number,
    required: true,
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
