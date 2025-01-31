import React from "react";
import { Routes, Route } from "react-router-dom";
import Signin from "../screens/auth/Signin";
import Signup from "../screens/auth/Signup";
import NotFound from "../screens/notFound/NotFound";
import DashboardLayout from "../navigation/outlet/Outlet";
import ProtectedRoute from "./protectedRoutes/ProtectedRoutes";
import Dashboard from "../screens/dashboard/Dashboard";

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
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppNavigator;
