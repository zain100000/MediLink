const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const appointmentController = require("../controllers/appointment.controller");

router.post(
  "/create-appointment",
  protect,
  appointmentController.createAppointment
);

router.get(
  "/get-all-appointments",
  protect,
  appointmentController.getAppointments
);

router.get(
  "/get-appointment-by-id/:id",
  protect,
  appointmentController.getAppointmentById
);

router.patch(
  "/update-appointment/:id",
  protect,
  appointmentController.updateAppointment
);

router.delete(
  "/delete-appointment/:id",
  protect,
  appointmentController.deleteAppointment
);

module.exports = router;
