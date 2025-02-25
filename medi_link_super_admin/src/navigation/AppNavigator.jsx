import React from "react";
import { Routes, Route } from "react-router-dom";
import Signin from "../screens/auth/Signin";
import Signup from "../screens/auth/Signup";
import NotFound from "../screens/notFound/NotFound";
import DashboardLayout from "../navigation/outlet/Outlet";
import ProtectedRoute from "./protectedRoutes/ProtectedRoutes";
import Dashboard from "../screens/dashboard/Dashboard";
import Doctors from "../screens/doctors/Doctors";
import DoctorDetails from "../screens/doctors/DoctorDetails";
import Patients from "../screens/patients/Patients";
import PatientDetails from "../screens/patients/PatientDetails";
import Appointments from "../screens/appointments/Appointments";
import AppointmentDetails from "../screens/appointments/AppointmentDetails";

const AppNavigator = () => {
  return (
    <Routes>
      <Route path="/" element={<Signin />} />
      <Route path="/auth/signup" element={<Signup />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="patients" element={<Patients />} />
        <Route path="doctors/doctor-details/:id" element={<DoctorDetails />} />
        <Route
          path="patients/patient-details/:id"
          element={<PatientDetails />}
        />
        <Route path="appointments" element={<Appointments />} />
        <Route
          path="appointments/appointments-details/:id"
          element={<AppointmentDetails />}
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppNavigator;
