const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const profilePictureUpload = require("../utilities/cloudinary/cloudinary.utility");
const doctorController = require("../controllers/doctor.controller");

router.post(
  "/signup-doctor",
  profilePictureUpload.upload,
  doctorController.registerDoctor
);

router.post("/signin-doctor", doctorController.loginDoctor);

router.get("/get-doctor-by-id/:id", protect, doctorController.getDoctorById);

router.patch(
  "/update-doctor/:id",
  protect,
  profilePictureUpload.upload,
  doctorController.updateDoctor
);

router.post(
  "/request-doctor-profile-deletion/:id",
  protect,
  doctorController.doctorProfileDeletion
);

router.patch(
  "/reset-doctor-password",
  protect,
  doctorController.resetDoctorPassword
);

router.post(
  "/logout-doctor",
  protect,
  doctorController.logoutDoctor
);

module.exports = router;
