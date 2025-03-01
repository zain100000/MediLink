import React from "react";
import { useLocation } from "react-router-dom";
import "./DoctorDetails.css";

const DoctorDetails = () => {
  const location = useLocation();
  const doctor = location.state?.doctor;

  if (!doctor) {
    return <div className="not-found">Doctor not found</div>;
  }

  return (
    <section id="doctor-detail">
      <div className="banner">
        <h1>Doctor Profile</h1>
      </div>
      <div className="container">
        <div className="profile">
          <img
            src={doctor.profilePicture || "placeholder_image.jpg"}
            alt="Doctor Profile"
          />
        </div>
        <div className="details">
          <div className="table-responsive">
            <table className="table">
              <tbody>
                <tr>
                  <td className="label color1">Name</td>
                  <td className="value color1">{doctor.fullName}</td>
                  <td className="label color2">Email</td>
                  <td className="value color2">{doctor.email}</td>
                </tr>
                <tr>
                  <td className="label color3">Phone</td>
                  <td className="value color3">{doctor.phone}</td>
                  <td className="label color4">Speciality</td>
                  <td className="value color4">{doctor.specialization}</td>
                </tr>
                <tr>
                  <td className="label color1">Experience</td>
                  <td className="value color1">{doctor.experience} years</td>
                  <td className="label color2">Consultation Fee</td>
                  <td className="value color2">${doctor.consultationFee}</td>
                </tr>
                <tr>
                  <td className="label color1">Departments</td>
                  <td className="value color1">
                    {doctor.departments.join(", ")}
                  </td>
                  <td className="label color2">Qualifications</td>
                  <td className="value color2">
                    {doctor.qualifications.join(", ")}
                  </td>
                </tr>
                <tr>
                  <td className="label color3">Address</td>
                  <td className="value color3">{doctor.address}</td>

                  <td className="label color3">Status</td>
                  <td className="value color3">{doctor.isActive}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorDetails;
