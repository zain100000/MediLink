import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getDoctorById } from "../../redux/slices/doctorSlice";
import { getAppointmentById } from "../../redux/slices/appointmentSlice";
import "./PatientDetails.css";

const PatientDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const patient = location.state?.patient;
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (patient?.visitedDoctors?.length) {
      Promise.all(
        patient.visitedDoctors.map((doctorId) =>
          dispatch(getDoctorById(doctorId))
            .unwrap()
            .then((res) => {
              return res;
            })
            .catch((err) => {
              console.error(`Error fetching doctor ID ${doctorId}:`, err);
              return null;
            })
        )
      )
        .then((doctorDetails) => {
          const validDoctors = doctorDetails.filter(
            (doctor) => doctor !== null
          );
          setDoctors(validDoctors);
        })
        .catch((err) => console.error("Error in fetching doctors:", err));
    }
  }, [patient, dispatch]);

  useEffect(() => {
    if (patient?.appointments?.length) {
      Promise.all(
        patient.appointments.map((appointmentId) =>
          dispatch(getAppointmentById(appointmentId))
            .unwrap()
            .then((res) => {
              return res;
            })
            .catch((err) => {
              console.error(
                `Error fetching appointment ID ${appointmentId}:`,
                err
              );
              return null;
            })
        )
      )
        .then((appointmentDetails) => {
          const validAppointments = appointmentDetails.filter(
            (appointment) => appointment !== null
          );
          setAppointments(validAppointments);
        })
        .catch((err) => console.error("Error in fetching appointments:", err));
    }
  }, [patient, dispatch]);

  if (!patient) {
    return <div className="not-found">Patient not found</div>;
  }

  return (
    <section id="patient-detail">
      <div className="banner">
        <h1>Patient Profile</h1>
      </div>
      <div className="container">
        <div className="profile">
          <img
            src={patient.profilePicture || "placeholder_image.jpg"}
            alt="Patient Profile"
          />
        </div>
        <div className="details">
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
                <tr>
                  <td className="label color3">Address</td>
                  <td className="value color3">{patient.address}</td>
                  <td className="label color3">Date Of Birth</td>
                  <td className="value color3">{patient.dob}</td>
                </tr>
                <tr>
                  <td className="label color2">Doctors Visited</td>
                  <td className="value color2">
                    {doctors.length > 0
                      ? doctors.map((doc) => doc.fullName).join(", ")
                      : "No doctors found"}
                  </td>

                  <td className="label color1">Medical History</td>
                  <td className="value color1">
                    {patient.medicalHistory.join(", ")}
                  </td>
                </tr>
                <tr>
                  <td className="label color2">Appointments</td>
                  <td className="value color2">
                    {appointments.length > 0
                      ? appointments
                          .map((appoint) => appoint.reasonForVisit)
                          .join(", ")
                      : "No appointment found"}
                  </td>

                  <td className="label color2">Appointment Status</td>
                  <td className="value color2">
                    {appointments.length > 0
                      ? appointments.map((appoint) => appoint.status).join(", ")
                      : "No appointment found"}
                  </td>
                </tr>

                <tr>
                  <td className="label color2">Appointment Date</td>
                  <td className="value color2">
                    {appointments.length > 0
                      ? appointments
                          .map((appoint) =>
                            new Date(appoint.appointmentDate).toLocaleString(
                              "en-GB"
                            )
                          )
                          .join(", ")
                      : "No appointment found"}
                  </td>

                  <td className="label color2">Appointment Time</td>
                  <td className="value color2">
                    {appointments.length > 0
                      ? appointments
                          .map((appoint) => appoint.appointmentTime)
                          .join(", ")
                      : "No appointment found"}
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

export default PatientDetails;
