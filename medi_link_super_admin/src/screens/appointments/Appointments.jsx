import React, { useState, useEffect } from "react";
import "./Appointments.css";
import { useDispatch, useSelector } from "react-redux";
import { getAppointments } from "../../redux/slices/appointmentSlice";
import InputField from "../../utils/customInputField/InputField";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const appointments = useSelector((state) => state.appointments.appointments);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user?.id) {
      dispatch(getAppointments());
    }
  }, [dispatch, user?.id]);

  const handleViewDetailChange = (appointment) => {
    navigate(`/admin/appointments/appointments-details/${appointment._id}`, {
      state: { appointmentId: appointment._id },
    });
  };

  const filteredAppointments = Array.isArray(appointments)
    ? appointments.filter((appointment) =>
        appointment.reasonForVisit?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <section id="appointment">
      <div className="appointments-container">
        <h2 className="appointments-title">Appointment List</h2>
        <div className="search-container" style={{ marginBottom: 15 }}>
          <InputField
            type="text"
            placeholder="Search Appointments"
            value={search}
            onChange={setSearch}
            editable={true}
            width={250}
          />
        </div>
        <div className="table-responsive">
          {filteredAppointments.length > 0 ? (
            <table className="table custom-table">
              <thead>
                <tr>
                  <th>Appointment</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredAppointments.map((appointment, index) => (
                  <tr key={index}>
                    <td className="appointment-profile">
                      <span className="appointment-name">
                        {appointment.reasonForVisit}
                      </span>
                    </td>
                    <td>
                      {new Date(appointment.appointmentDate).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td>{appointment.appointmentTime}</td>

                    <td>{appointment.status}</td>
                    <td className="actions">
                      <button
                        className="action-button view-detail"
                        onClick={() => handleViewDetailChange(appointment)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              className="no-appointment-found"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              No Appointments Found
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Appointments;
