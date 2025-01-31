import React from "react";
import Card from "../../utils/customCard/Card";

const Dashboard = () => {
  return (
    <div className="container">
      <div className="row">
        <Card
          icon={<i class="fas fa-chart-line"></i>}
          title="Stock Total"
          number="$150000"
          onClick={() => handleCardClick("Stock Total")}
        />
      </div>
    </div>
  );
};

export default Dashboard;
