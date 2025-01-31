const jwt = require("jsonwebtoken");
const SuperAdmin = require("../../models/super-admin.model");
const Doctor = require("../../models/doctor.model");
const Patient = require("../../models/patient.model");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Access, Token is missing",
    });
  }

  const jwtToken = authHeader.replace("Bearer ", "").trim();

  try {
    const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET);

    if (!decodedToken || !decodedToken.user || !decodedToken.role) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token Structure or Unauthorized Role",
      });
    }

    let user;
    if (decodedToken.role === "SUPERADMIN") {
      user = await SuperAdmin.findById(decodedToken.user.id).select(
        "-password"
      );
      req.isSuperAdmin = true;
    } else if (decodedToken.role === "DOCTOR") {
      user = await Doctor.findById(decodedToken.user.id).select("-password");
      req.isDoctor = true;
    } else if (decodedToken.role === "PATIENT") {
      user = await Patient.findById(decodedToken.user.id).select("-password");
      req.isPatient = true;
    } else {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    req.token = jwtToken;
    req.user = user;
    req.userId = user._id;

    next();
  } catch (error) {
    console.error("Error Verifying Token:", error.message || error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized Token",
    });
  }
};

module.exports = authMiddleware;
