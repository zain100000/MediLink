const bcrypt = require("bcrypt");
const Patient = require("../models/patient.model");
const profilePictureUpload = require("../utilities/cloudinary/cloudinary.utility");
const {
  uploadToCloudinary,
} = require("../utilities/cloudinary/cloudinary.utility");
const jwt = require("jsonwebtoken");
const { v2: cloudinary } = require("cloudinary");

exports.registerPatient = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      gender,
      address,
      dob,
      medicalHistory,
    } = req.body;

    const existingPatient = await Patient.findOne({
      email,
      role: "PATIENT",
    });
    if (existingPatient) {
      return res.status(409).json({
        success: false,
        message: "Patient with this email already exists",
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

    const patient = new Patient({
      profilePicture: userProfileImageUrl,
      fullName,
      email,
      password: hashedPassword,
      phone,
      gender,
      address,
      dob,
      medicalHistory,
      role: "PATIENT",
    });

    await patient.save();

    res.status(200).json({
      success: true,
      message: "Patient created successfully",
    });
  } catch (error) {
    console.error("Error creating patients:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    let patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient Not Found!",
      });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password!",
      });
    }

    const payload = {
      role: "PATIENT",
      user: {
        id: patient.id,
        email: patient.email,
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
          message: "Patient Login Successfully",
          data: {
            id: patient.id,
            fullName: patient.fullName,
            email: patient.email,
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

exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findById(id).select("-password");
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient Not Found For Provided ID!",
      });
    }

    res.json({
      success: true,
      message: "Patient Fetched Successfully",
      patient: patient,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Getting Patient For Provided ID!",
    });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select("-password");

    if (!patients.length) {
      return res.status(404).json({
        success: false,
        message: "No Patients Found!",
      });
    }

    res.json({
      success: true,
      message: "Patients Fetched Successfully",
      patients,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error Fetching Patients!",
    });
  }
};

exports.updatePatient = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Patient ID" });
  }

  try {
    let patient = await Patient.findById(id);

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found." });
    }

    // Update basic fields
    if (req.body.fullName) patient.fullName = req.body.fullName;
    if (req.body.phone) patient.phone = req.body.phone;
    if (req.body.address) patient.address = req.body.address;

    // Handle Profile Picture Upload
    if (req.file) {
      // <-- use req.file instead of req.files.profilePicture
      const newProfilePicture = req.file;

      // Delete old profile picture if exists
      if (patient.profilePicture) {
        try {
          const publicId = patient.profilePicture
            .split("/")
            .pop()
            .split(".")[0];

          await cloudinary.uploader.destroy(
            `MediLink/profilePictures/${publicId}`
          );
        } catch (error) {
          console.error("❌ Error deleting old profile picture:", error);
        }
      }

      // Upload new profile picture
      const result = await uploadToCloudinary(newProfilePicture);
      patient.profilePicture = result.url;
    }

    await patient.save();

    return res.status(200).json({
      success: true,
      message: "Patient updated successfully.",
      patient,
    });
  } catch (err) {
    console.error("Error updating patient:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.resetPatientPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    let patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient Not Found!",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    patient.password = hashedPassword;
    await patient.save();

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

exports.logoutPatient = async (req, res) => {
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
