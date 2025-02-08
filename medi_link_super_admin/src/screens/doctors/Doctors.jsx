import React, { useState, useEffect } from "react";
import "./Doctors.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getDoctors,
  approveDoctor,
  rejectDoctor,
  setDoctors,
  deleteDoctorProfile,
} from "../../redux/slices/doctorSlice";
import Modal from "../../utils/customModal/Modal";
import { toast } from "react-hot-toast";
import InputField from "../../utils/customInputField/InputField";
import { useNavigate } from "react-router-dom";

const Doctors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const doctors = useSelector((state) => state.doctors.doctors);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user?.id) {
      dispatch(getDoctors());
    }
  }, [dispatch, user?.id]);

  const handleStatusChange = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleViewDetailChange = (doctor) => {
    navigate(`/admin/doctors/doctor-details/${doctor._id}`, {
      state: { doctor },
    });
  };

  const changeDoctorStatus = async (status) => {
    setLoadingAction(status);
    try {
      if (selectedDoctor?._id) {
        if (status === "APPROVED") {
          await dispatch(approveDoctor(selectedDoctor._id));
        } else if (status === "REJECTED") {
          await dispatch(rejectDoctor(selectedDoctor._id));
        }
        toast.success("Status changed successfully!");
        const updatedDoctors = doctors.map((doctor) =>
          doctor._id === selectedDoctor._id
            ? { ...doctor, isActive: status }
            : doctor
        );
        dispatch(setDoctors(updatedDoctors));
      } else {
        console.error("Doctor ID is missing.");
      }
    } catch (error) {
      toast.error("Error while changing status.");
    } finally {
      setLoadingAction(null);
      setIsModalOpen(false);
      setSelectedDoctor(null);
    }
  };

  const handleDeleteDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const deleteDoctor = async () => {
    setLoadingAction("DELETE");
    try {
      if (selectedDoctor?._id) {
        await dispatch(deleteDoctorProfile(selectedDoctor._id));
        toast.success("Doctor deleted successfully!");
        dispatch(
          setDoctors(doctors.filter((doc) => doc._id !== selectedDoctor._id))
        );
      }
    } catch {
      toast.error("Error while deleting doctor.");
    } finally {
      setLoadingAction(null);
      setIsModalOpen(false);
      setSelectedDoctor(null);
    }
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="doctor">
      <div className="doctors-container">
        <h2 className="doctors-title">Doctors List</h2>
        <div className="search-container" style={{ marginBottom: 15 }}>
          <InputField
            type="text"
            placeholder="Search Doctors"
            value={search}
            onChange={setSearch}
            editable={true}
            width={250}
          />
        </div>
        <div className="table-responsive">
          {filteredDoctors.length > 0 ? (
            <table className="table custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredDoctors.map((doctor, index) => (
                  <tr key={index}>
                    <td className="doctor-profile">
                      <img
                        src={doctor.profilePicture}
                        alt={doctor.fullName}
                        className="doctor-img"
                      />
                      <span className="doctor-name">{doctor.fullName}</span>
                    </td>
                    <td>{doctor.phone}</td>
                    <td>{doctor.address}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          doctor.isActive === "APPROVED"
                            ? "approved"
                            : doctor.isActive === "PENDING"
                            ? "pending"
                            : "rejected"
                        }`}
                      >
                        {doctor.isActive}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="action-button status-change"
                        onClick={() => handleStatusChange(doctor)}
                      >
                        <i className="fas fa-sync"></i>
                      </button>
                      <button
                        className="action-button view-detail"
                        onClick={() => handleViewDetailChange(doctor)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="action-button delete-doctor"
                        onClick={() => handleDeleteDoctor(doctor)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              className="no-doctors-found"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              No Doctors Found
            </div>
          )}
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Change Status for ${selectedDoctor?.fullName}`}
          loading={loadingAction !== null}
          buttons={[
            {
              label: "Approve",
              className: "modal-btn-primary",
              onClick: () => changeDoctorStatus("APPROVED"),
              loading: loadingAction === "APPROVED",
            },
            {
              label: "Reject",
              className: "modal-btn-reject",
              onClick: () => changeDoctorStatus("REJECTED"),
              loading: loadingAction === "REJECTED",
            },
          ]}
        >
          Are you sure you want to change the status?
        </Modal>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Delete ${selectedDoctor?.fullName} Profile`}
          loading={loadingAction === "DELETE"}
          buttons={[
            {
              label: "Delete",
              className: "modal-btn-danger",
              onClick: deleteDoctor,
              loading: loadingAction === "DELETE",
            },
          ]}
        >
          Are you sure you want to delete this doctor?
        </Modal>
      </div>
    </section>
  );
};

export default Doctors;
