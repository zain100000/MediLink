const bcrypt = require("bcrypt");
const Doctor = require("../models/doctor.model");
const profilePictureUpload = require("../utilities/cloudinary/cloudinary.utility");
const {
  uploadToCloudinary,
} = require("../utilities/cloudinary/cloudinary.utility");
const jwt = require("jsonwebtoken");
const { v2: cloudinary } = require("cloudinary");

exports.registerDoctor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      gender,
      address,
      specialist,
      departments,
      qualifications,
      experience,
      consultationFee,     
      isActive,
    } = req.body;

    const existingDoctor = await Doctor.findOne({
      email,
      role: "DOCTOR",
    });
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "Doctor with this email already exists",
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

    const doctor = new Doctor({
      profilePicture: userProfileImageUrl,
      fullName,
      email,
      password: hashedPassword,
      phone,
      gender,
      address,
      specialist,
      departments,
      qualifications,
      experience,
      consultationFee,      
      isActive,
      role: "DOCTOR",
    });

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor created successfully, Wait for approval",
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    let doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor Not Found!",
      });
    }

    if (doctor.isActive === "PENDING") {
      return res.status(403).json({
        success: false,
        message: "Cannot login. Please wait for approval.",
      });
    } else if (doctor.isActive === "REJECTED") {
      return res.status(403).json({
        success: false,
        message: "Cannot login. Your profile got rejected.",
      });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password!",
      });
    }

    const payload = {
      role: "DOCTOR",
      user: {
        id: doctor.id,
        email: doctor.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error Generating Token!",
          });
        }

        res.json({
          success: true,
          message: "Doctor Login Successfully",
          data: {
            id: doctor.id,
            fullName: doctor.fullName,
            email: doctor.email,
          },
          token,
        });
      }
    );
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Logging In!",
    });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id).select("-password");
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor Not Found For Provided ID!",
      });
    }

    res.json({
      success: true,
      message: "Doctor Fetched Successfully",
      doctor: doctor,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Getting Doctor For Provided ID!",
    });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password");

    if (!doctors.length) {
      return res.status(404).json({
        success: false,
        message: "No Doctors Found!",
      });
    }

    res.json({
      success: true,
      message: "Doctors Fetched Successfully",
      doctors,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Fetching Doctors!",
    });
  }
};

exports.updateDoctor = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Doctor Id" });
  }

  try {
    let doctor = await Doctor.findById(id);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found." });
    }

    if (doctor.isActive === "REJECTED") {
      return res.status(400).json({
        success: false,
        message: "Doctor profile is rejected. Cannot update.",
      });
    }

    if (
      req.headers["content-type"] &&
      req.headers["content-type"].includes("application/json")
    ) {
      if (req.body.fullName) doctor.fullName = req.body.fullName;
      if (req.body.phone) doctor.phone = req.body.phone;
      if (req.body.address) doctor.address = req.body.address;
      if (req.body.qualifications)
        doctor.qualifications = req.body.qualifications;
      if (req.body.experience) doctor.experience = req.body.experience;
      if (req.body.consultationFee)
        doctor.consultationFee = req.body.consultationFee;    

      if (req.body.visitedPatients) doctor.visitedPatients = req.body.visitedPatients;

      if (req.file) {
        if (doctor.profilePicture) {
          const publicId = doctor.profilePicture
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        }

        const result = await uploadToCloudinary(req.file);

        doctor.profilePicture = result.url;
      }
    }

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor Updated Successfully.",
      doctor,
    });
  } catch (err) {
    console.log("Error updating Doctor:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.doctorProfileDeletion = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Doctor Id" });
  }

  try {
    let doctor = await Doctor.findById(id);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found." });
    }

    if (doctor.isActive === "REJECTED") {
      return res.status(400).json({
        success: false,
        message: "Doctor profile is rejected. Cannot request deletion.",
      });
    }

    doctor.isActive = "PENDING";
    await doctor.save();

    res.status(200).json({
      success: true,
      message:
        "Doctor profile marked for deletion. Waiting for deletion from Super Admin.",
    });
  } catch (err) {
    console.log("Error requesting doctor profile deletion:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.resetDoctorPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    let doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor Not Found!",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    doctor.password = hashedPassword;
    await doctor.save();

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

exports.logoutDoctor = async (req, res) => {
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
