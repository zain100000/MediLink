import React, { useState, useEffect } from "react";
import "./Patients.css";
import { useDispatch, useSelector } from "react-redux";
import { getPatients } from "../../redux/slices/patientSlice";
import InputField from "../../utils/customInputField/InputField";
import { useNavigate } from "react-router-dom";
import Modal from "../../utils/customModal/Modal";

const Patients = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const patients = useSelector((state) => state.patients.patients);
  const doctorId = user?.id;
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (doctorId) {
      dispatch(getPatients());
    }
  }, [dispatch, doctorId]);

  const handleViewDetailChange = (patient) => {
    navigate(`/admin/patients/patient-details/${patient._id}`, {
      state: { patient },
    });
  };

  const filteredPatients = patients
    .filter((patient) =>
      patient.visitedDoctors.some((doctor) => doctor === doctorId)
    )
    .filter((patient) =>
      patient.fullName.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <section id="patient">
      <div className="patients-container">
        <h2 className="patients-title">Patients List</h2>
        <div className="search-container" style={{ marginBottom: 15 }}>
          <InputField
            type="text"
            placeholder="Search Patients"
            value={search}
            onChange={setSearch}
            editable={true}
            width={250}
          />
        </div>
        <div className="table-responsive">
          {filteredPatients.length > 0 ? (
            <table className="table custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredPatients.map((patient, index) => (
                  <tr key={index}>
                    <td className="patient-profile">
                      <img
                        src={patient.profilePicture}
                        alt={patient.fullName}
                        className="patient-img"
                      />
                      <span className="patient-name">{patient.fullName}</span>
                    </td>
                    <td>{patient.phone}</td>
                    <td>{patient.address}</td>
                    <td className="actions">
                      <button
                        className="action-button view-detail"
                        onClick={() => handleViewDetailChange(patient)}
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
              className="no-patients-found"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              No Patients Found
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Patients;
