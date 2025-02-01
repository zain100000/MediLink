import React, { useEffect } from "react";
import { getDoctors } from "../../redux/slices/doctorSlice";
import { useDispatch, useSelector } from "react-redux";
import Card from "../../utils/customCards/Card";

const Dashboard = () => {
  const dispatch = useDispatch();

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

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-4">
          <Card
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
        <div className="col-lg-4">
          <Card
            title="Patients"
            icon={<i className="fas fa-user-injured" />}
            stats={[
              { label: "Total", value: totalDoctors },
              { label: "Pending", value: pendingDoctors },
              { label: "Approved", value: approvedDoctors },
              { label: "Rejected", value: rejectedDoctors },
            ]}
          />
        </div>
        <div className="col-lg-4">
          <Card
            title="Appointments"
            icon={<i className="fas fa-calendar-check" />}
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
  );
};

export default Dashboard;
