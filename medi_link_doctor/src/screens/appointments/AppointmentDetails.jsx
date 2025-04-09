import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAppointmentById } from "../../redux/slices/appointmentSlice";
import "./AppointmentDetails.css";

const AppointmentDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const appointmentId = location.state?.appointmentId;

  const [appointment, setAppointment] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appointmentId) {
      dispatch(getAppointmentById(appointmentId))
        .unwrap()
        .then((res) => {
          setAppointment(res);
          setDoctor(res.doctor);
          setPatient(res.patient);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching appointment:", err);
          setLoading(false);
        });
    }
  }, [appointmentId, dispatch]);

  if (!appointment || !doctor || !patient) {
    return <div className="not-found">Details not found</div>;
  }

  return (
    <section id="appointment-detail">
      <div className="banner">
        <h1>Appointment Details</h1>
      </div>
      <div className="container">
        <div className="details">
          <h2>Patient Details</h2>
          <div className="table-responsive">
            <table className="table">
              <tbody>
                <tr>
                  <td className="label color1">Name</td>
                  <td className="value color1">{patient.fullName}</td>
                  <td className="label color2">Email</td>
                  <td className="value color2">{patient.email}</td>
                </tr>
                <tr>
                  <td className="label color3">Phone</td>
                  <td className="value color3">{patient.phone}</td>
                  <td className="label color3">Gender</td>
                  <td className="value color3">{patient.gender}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Doctor Details</h2>
          <div className="table-responsive">
            <table className="table">
              <tbody>
                <tr>
                  <td className="label color1">Name</td>
                  <td className="value color1">{doctor.fullName}</td>
                  <td className="label color2">Specialization</td>
                  <td className="value color2">{doctor.specialization}</td>
                </tr>
                <tr>
                  <td className="label color3">Phone</td>
                  <td className="value color3">{doctor.phone}</td>
                  <td className="label color3">Email</td>
                  <td className="value color3">{doctor.email}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Appointment Details</h2>
          <div className="table-responsive">
            <table className="table">
              <tbody>
                <tr>
                  <td className="label color1">Reason for Visit</td>
                  <td className="value color1">
                    {appointment.reasonForVisit || "N/A"}
                  </td>
                  <td className="label color2">Status</td>
                  <td className="value color2">
                    {appointment.status || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="label color3">Date</td>
                  <td className="value color3">
                    {appointment.appointmentDate
                      ? new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                  <td className="label color3">Time</td>
                  <td className="value color3">
                    {appointment.appointmentTime || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentDetails;
