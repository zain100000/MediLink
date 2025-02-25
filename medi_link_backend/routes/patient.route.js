const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const profilePictureUpload = require("../utilities/cloudinary/cloudinary.utility");
const patientController = require("../controllers/patient.controller");

router.post(
  "/signup-patient",
  profilePictureUpload.upload,
  patientController.registerPatient
);

router.post("/signin-patient", patientController.loginPatient);

router.get("/get-all-patients", protect, patientController.getAllPatients);

router.get("/get-patient-by-id/:id", protect, patientController.getPatientById);

router.patch(
  "/update-patient/:id",
  protect,
  profilePictureUpload.upload,
  patientController.updatePatient
);

router.patch(
  "/reset-patient-password",
  protect,
  patientController.resetPatientPassword
);

router.post("/logout-patient", protect, patientController.logoutPatient);

module.exports = router;
