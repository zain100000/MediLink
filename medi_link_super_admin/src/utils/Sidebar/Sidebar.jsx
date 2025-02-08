import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  return (
    <section id="sidebar">
      <ul className="sidebar-nav">
        <li className="sidebar-container">
          <NavLink
            to="/admin/dashboard"
            className={`sidebar-link ${
              activeLink === "/admin/dashboard" ? "active" : ""
            }`}
            onClick={() => setActiveLink("/admin/dashboard")}
          >
            <div className="sidebar-icon">
              <i className="fas fa-home"></i>
            </div>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/doctors"
            className={`sidebar-link ${
              activeLink === "/admin/doctors" ? "active" : ""
            }`}
            onClick={() => setActiveLink("/admin/doctors")}
          >
            <div className="sidebar-icon">
              <i className="fas fa-user-md"></i>
            </div>
            <span>Doctors</span>
          </NavLink>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;
