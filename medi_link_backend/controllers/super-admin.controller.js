const bcrypt = require("bcrypt");
const SuperAdmin = require("../models/super-admin.model");
const Doctor = require("../models/doctor.model");
const profilePictureUpload = require("../utilities/cloudinary/cloudinary.utility");
const { v2: cloudinary } = require("cloudinary");
const jwt = require("jsonwebtoken");

exports.registerSuperAdmin = async (req, res) => {
  try {
    console.log(req.file);
    const { fullName, email, password } = req.body;

    const existingSuperAdmin = await SuperAdmin.findOne({
      email,
      role: "SUPERADMIN",
    });
    if (existingSuperAdmin) {
      return res.status(409).json({
        success: false,
        message: "SuperAdmin with this email already exists",
      });
    }

    let userProfileImageUrl = null;
    if (req.file) {
      const uploadResult = await profilePictureUpload.uploadToCloudinary(
        req.file
      );
      userProfileImageUrl = uploadResult.url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = new SuperAdmin({
      profilePicture: userProfileImageUrl,
      fullName,
      email,
      password: hashedPassword,
      role: "SUPERADMIN",
      isSuperAdmin: true,
    });

    await superAdmin.save();

    res.status(200).json({
      success: true,
      message: "SuperAdmin created successfully",
    });
  } catch (error) {
    console.error("Error creating super admin:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    let superadmin = await SuperAdmin.findOne({ email });
    if (!superadmin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin Not Found!",
      });
    }

    const isMatch = await bcrypt.compare(password, superadmin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password!",
      });
    }

    const payload = {
      role: "SUPERADMIN",
      user: {
        id: superadmin.id,
        email: superadmin.email,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, (err, token) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error Generating Token!",
        });
      }

      res.json({
        success: true,
        message: "Super Admin Login Successfully",
        data: {
          id: superadmin.id,
          fullName: superadmin.fullName,
          email: superadmin.email,
        },
        token,
      });
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Logging In!",
    });
  }
};

exports.getSuperAdmin = async (req, res) => {
  try {
    const { userId } = req.params; // Get the userId from the request parameters

    const superAdmin = await SuperAdmin.findById(userId).select("-password");
    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin Not Found!",
      });
    }

    res.json({
      success: true,
      message: "Super Admin Fetched Successfully",
      superAdmin: superAdmin, // Return the single super admin
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Getting Super Admin!",
    });
  }
};

exports.resetSuperAdminPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    let superAdmin = await SuperAdmin.findOne({ email });
    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "Super Admin Not Found!",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    superAdmin.password = hashedPassword;
    await superAdmin.save();

    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Resetting Password!",
    });
  }
};

exports.logoutSuperAdmin = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout SuccessFully!",
      token: null,
    });
  } catch (err) {
    console.error("Error Logging Out:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getDoctorsByStatus = async (req, res) => {
  try {
    const { isActive } = req.query;

    if (!["PENDING", "APPROVED", "REJECTED"].includes(isActive)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values are PENDING, APPROVED, or REJECTED.",
      });
    }

    const doctors = await Doctor.find({ isActive });

    res.status(200).json({
      success: true,
      message: `${isActive} doctors fetched successfully!`,
      doctors: doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors by status:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.approveDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor Not Found!",
      });
    }

    if (doctor.isActive === "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Doctor is already approved!",
      });
    }

    doctor.isActive = "APPROVED";
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor approved successfully!",
    });
  } catch (error) {
    console.error("Error approving doctor:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.rejectDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor Not Found!",
      });
    }

    if (doctor.isActive === "REJECTED") {
      return res.status(400).json({
        success: false,
        message: "Doctor profile is already rejected!",
      });
    }

    doctor.isActive = "REJECTED";
    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor profile rejected successfully!",
    });
  } catch (error) {
    console.error("Error rejecting doctor:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.deleteDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor Not Found!",
      });
    }

    // Allow deletion only if doctor is PENDING or REJECTED
    if (doctor.isActive !== "PENDING" && doctor.isActive !== "REJECTED") {
      return res.status(400).json({
        success: false,
        message: "Only PENDING and REJECTED doctors can be deleted.",
      });
    }

    // Delete profile picture if exists
    if (doctor.profilePicture) {
      const publicId = doctor.profilePicture
        .split("/")
        .slice(-4)
        .join("/")
        .split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Doctor.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Doctor profile deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting doctor profile:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
