import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAppointments } from "../../redux/slices/appointmentSlice";
import Card from "../../utils/customCards/Card";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const doctorId = user?.id;

  const appointments =
    useSelector((state) => state.appointments.appointments) || [];

  useEffect(() => {
    if (doctorId) {
      dispatch(getAppointments());
    }
  }, [dispatch, doctorId]);

  const filteredAppointments = appointments.filter(
    (appointment) => appointment?.doctor?._id === doctorId
  );

  const uniquePatientMap = {};
  filteredAppointments.forEach((appt) => {
    const patient = appt.patient;
    if (patient && patient._id) {
      uniquePatientMap[patient._id] = patient;
    }
  });

  const uniquePatients = Object.values(uniquePatientMap);
  const totalPatients = uniquePatients.length;

  const appointmentStats = filteredAppointments.reduce(
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

  const handleNavigatePatient = () => navigate("/admin/patients");
  const handleNavigateAppointment = () => navigate("/admin/appointments");

  return (
    <section id="dashboard">
      <div className="container">
        <div className="row">
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
                { label: "Total", value: appointmentStats.total },
                { label: "Pending", value: appointmentStats.pending },
                { label: "Confirmed", value: appointmentStats.confirmed },
                { label: "Canceled", value: appointmentStats.canceled },
                { label: "Completed", value: appointmentStats.completed },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
