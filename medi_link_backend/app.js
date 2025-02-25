const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Route Imports
const superAdminRoute = require("./routes/super-admin.route");
const doctorRoute = require("./routes/doctor.route");
const patientRoute = require("./routes/patient.route");
const appointmentRoute = require("./routes/appointment.route");

require("dotenv").config();

const app = express();
app.use(bodyParser.json({ limit: "20kb" }));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

// Routes
app.use("/api/super-admin", superAdminRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/patient", patientRoute);
app.use("/api/appointment", appointmentRoute);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
