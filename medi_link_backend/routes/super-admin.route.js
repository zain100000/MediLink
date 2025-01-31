const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware/auth.middleware");
const profilePictureUpload = require("../utilities/cloudinary/cloudinary.utility");
const superAdminController = require("../controllers/super-admin.controller");

router.post(
  "/signup-super-admin",
  profilePictureUpload.upload,
  superAdminController.registerSuperAdmin
);

router.post("/signin-super-admin", superAdminController.loginSuperAdmin);

router.get(
  "/get-super-admin/:userId",
  protect,
  superAdminController.getSuperAdmin
);

router.patch(
  "/reset-super-admin-password",
  protect,
  superAdminController.resetSuperAdminPassword
);

router.post(
  "/logout-super-admin",
  protect,
  superAdminController.logoutSuperAdmin
);

router.get(
  "/get-doctors-by-status",
  protect,
  superAdminController.getDoctorsByStatus
);

router.patch(
  "/approve-doctor/:id",
  protect,
  superAdminController.approveDoctor
);

router.patch("/reject-doctor/:id", protect, superAdminController.rejectDoctor);

router.delete(
  "/delete-doctor-profile/:id",
  protect,
  superAdminController.deleteDoctorProfile
);

module.exports = router;
