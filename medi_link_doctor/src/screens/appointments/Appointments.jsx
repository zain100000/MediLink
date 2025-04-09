import React, { useState, useEffect } from "react";
import "./Appointments.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAppointments,
  updateAppointment,
  setAppointments,
} from "../../redux/slices/appointmentSlice";
import InputField from "../../utils/customInputField/InputField";
import { useNavigate } from "react-router-dom";
import Modal from "../../utils/customModal/Modal";
import toast from "react-hot-toast";

const Appointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const appointments = useSelector((state) => state.appointments.appointments);
  const [search, setSearch] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);

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

  const handleStatusChange = (appointment) => {
    setSelectedAppointment(appointment);
    setIsStatusModalOpen(true);
  };

  const changeAppointmentStatus = async (status) => {
    setLoadingAction(status);
    try {
      if (selectedAppointment?._id) {
        if (status === "CONFIRMED") {
          await dispatch(
            updateAppointment({
              appointmentId: selectedAppointment._id,
              updatedData: { status: "CONFIRMED" },
            })
          ).unwrap();
        } else if (status === "CANCELED") {
          await dispatch(
            updateAppointment({
              appointmentId: selectedAppointment._id,
              updatedData: { status: "CANCELED" },
            })
          ).unwrap();
        } else if (status === "COMPLETED") {
          await dispatch(
            updateAppointment({
              appointmentId: selectedAppointment._id,
              updatedData: { status: "COMPLETED" },
            })
          ).unwrap();
        }

        toast.success("Status changed successfully!");
        const updatedAppointments = appointments.map((appointment) =>
          appointment._id === selectedAppointment._id
            ? { ...appointment, status }
            : appointment
        );
        dispatch(setAppointments(updatedAppointments));
      } else {
        console.error("Appointment ID is missing.");
      }
    } catch (error) {
      toast.error("Error while changing status.");
    } finally {
      setLoadingAction(null);
      setIsStatusModalOpen(false);
      setSelectedAppointment(null);
    }
  };

  const filteredAppointments = Array.isArray(appointments)
    ? appointments.filter(
        (appointment) =>
          appointment.doctor?._id === user?.id &&
          appointment.reasonForVisit
            ?.toLowerCase()
            .includes(search.toLowerCase())
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

                      <button
                        className="action-button status-change"
                        onClick={() => handleStatusChange(appointment)}
                      >
                        <i className="fas fa-sync"></i>
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

      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={`Change Status for this appointment`}
        loading={loadingAction !== null}
        buttons={[
          {
            label: "Confirm",
            className: "modal-btn-primary",
            onClick: () => changeAppointmentStatus("CONFIRMED"),
            loading: loadingAction === "CONFIRMED",
          },
          {
            label: "Cancel",
            className: "modal-btn-reject",
            onClick: () => changeAppointmentStatus("CANCELED"),
            loading: loadingAction === "CANCELED",
          },
          {
            label: "Complete",
            className: "modal-btn-secondary",
            onClick: () => changeAppointmentStatus("COMPLETED"),
            loading: loadingAction === "COMPLETED",
          },
        ]}
      />
    </section>
  );
};

export default Appointments;
