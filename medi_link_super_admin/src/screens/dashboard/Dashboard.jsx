import React, { useEffect } from "react";
import { getDoctors } from "../../redux/slices/doctorSlice";
import { getPatients } from "../../redux/slices/patientSlice";
import { getAppointments } from "../../redux/slices/appointmentSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../../utils/customCards/Card";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const doctors = useSelector((state) => state.doctors.doctors) || [];
  const patients = useSelector((state) => state.patients.patients) || [];
  const appointments = useSelector((state) => state.appointments.appointments);
  const appointmentList = Array.isArray(appointments) ? appointments : [];

  useEffect(() => {
    if (user?.id) {
      dispatch(getDoctors());
      dispatch(getPatients());
      dispatch(getAppointments());
    }
  }, [dispatch, user?.id]);

  const {
    pending: pendingDoctors,
    approved: approvedDoctors,
    rejected: rejectedDoctors,
    total: totalDoctors,
  } = doctors.reduce(
    (acc, doctor) => {
      if (doctor.isActive === "PENDING") acc.pending++;
      else if (doctor.isActive === "APPROVED") acc.approved++;
      else if (doctor.isActive === "REJECTED") acc.rejected++;
      acc.total++;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0, total: 0 }
  );

  const totalPatients = patients.length;

  const {
    pending: pendingAppointments,
    confirmed: confirmedAppointments,
    canceled: canceledAppointments,
    completed: completedAppointments,
    total: totalAppointments,
  } = appointmentList.reduce(
    (acc, appointment) => {
      if (appointment.status === "PENDING") acc.pending++;
      else if (appointment.status === "CONFIRMED") acc.confirmed++;
      else if (appointment.status === "CANCELED") acc.canceled++;
      else if (appointment.status === "COMPLETED") acc.completed++;
      acc.total++;
      return acc;
    },
    { pending: 0, confirmed: 0, canceled: 0, completed: 0, total: 0 }
  );

  const handleNavigateDoctor = () => navigate("/admin/doctors");
  const handleNavigatePatient = () => navigate("/admin/patients");
  const handleNavigateAppointment = () => navigate("/admin/appointments");

  return (
    <section id="dashboard">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-4">
            <Card
              onClick={handleNavigateDoctor}
              title="Doctors"
              icon={<i className="fas fa-user-md" />}
              stats={[
                { label: "Total", value: totalDoctors },
                { label: "Pending", value: pendingDoctors },
                { label: "Approved", value: approvedDoctors },
                { label: "Rejected", value: rejectedDoctors },
              ]}
            />
          </div>

          <div className="col-sm-12 col-md-12 col-lg-4">
            <Card
              onClick={handleNavigatePatient}
              title="Patients"
              icon={<i className="fas fa-user-injured" />}
              stats={[{ label: "Total", value: totalPatients }]}
            />
          </div>

          <div className="col-sm-12 col-md-12 col-lg-4">
            <Card
              onClick={handleNavigateAppointment}
              title="Appointments"
              icon={<i className="fas fa-clipboard-check" />}
              stats={[
                { label: "Total", value: totalAppointments },
                { label: "Pending", value: pendingAppointments },
                { label: "Confirmed", value: confirmedAppointments },
                { label: "Canceled", value: canceledAppointments },
                { label: "Completed", value: completedAppointments },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
