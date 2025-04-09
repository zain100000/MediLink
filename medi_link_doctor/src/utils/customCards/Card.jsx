import React from "react";
import "./Card.css";

const Card = ({ title, stats, onClick, icon, customClassName = "" }) => {
  return (
    <section id="card">
      <div className={`card-container ${customClassName}`} onClick={onClick}>
        <div className="card custom-card">
          <div className="card-body">
            <div className="card-header">
              <h5 className="card-title">{title}</h5>
              <div className="card-icon">{icon ? icon : "icon"} </div>
            </div>
            <div className="card-stats">
              {stats.map((stat, index) => (
                <div className="stat-item" key={index}>
                  <span className="stat-label">{stat.label}:</span>
                  <span className="stat-number">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Card;
