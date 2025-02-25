const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },

  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },

  appointmentDate: {
    type: Date,
    required: true,
  },

  appointmentTime: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "CANCELED", "COMPLETED"],
    default: "PENDING",
  },

  reasonForVisit: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
