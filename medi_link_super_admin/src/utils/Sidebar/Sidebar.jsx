import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("/admin/dashboard");

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  return (
    <section id="sidebar">
      <ul className="sidebar-nav">
        <li className="sidebar-container">
          <NavLink
            to="/admin/dashboard"
            className={`sidebar-link ${
              activeLink === "/admin/dashboard" ? "active" : ""
            }`}
            onClick={() => handleLinkClick("/admin/dashboard")}
          >
            <div className="sidebar-icon">
              <i className="fas fa-home"></i>
            </div>
            <span>Dashboard</span>
          </NavLink>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;
