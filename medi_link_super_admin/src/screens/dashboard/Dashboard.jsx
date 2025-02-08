import React, { useEffect } from "react";
import { getDoctors } from "../../redux/slices/doctorSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../../utils/customCards/Card";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const doctors = useSelector((state) => state.doctors.doctors);

  useEffect(() => {
    if (user?.id) {
      dispatch(getDoctors());
    }
  }, [dispatch, user?.id]);

  const {
    pending: pendingDoctors,
    approved: approvedDoctors,
    rejected: rejectedDoctors,
    total: totalDoctors,
  } = doctors.reduce(
    (acc, doctor) => {
      if (doctor.isActive === "PENDING") {
        acc.pending++;
      } else if (doctor.isActive === "APPROVED") {
        acc.approved++;
      } else if (doctor.isActive === "REJECTED") {
        acc.rejected++;
      }
      acc.total++;
      return acc;
    },
    { pending: 0, approved: 0, rejected: 0, total: 0 }
  );

  const handleNavigateDoctor = () => {
    navigate("/admin/doctors");
  };

  return (
    <section id="dashboard">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-4 col-lg-4">
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
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
