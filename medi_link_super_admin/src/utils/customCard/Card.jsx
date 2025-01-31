import React from "react";
import "./Card.css";

const Card = ({ icon, title, number, onClick }) => {
  return (
    <section className="card-container col-md-4" id="card" onClick={onClick}>
      <div className="custom-card card">
        <div className="card-body">
          <div className="icon-container">{icon}</div>
          <h5 className="card-title">{title}</h5>
          <p className="card-number">{number}</p>
        </div>
      </div>
    </section>
  );
};

export default Card;
