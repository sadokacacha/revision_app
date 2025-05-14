import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import logo from "../assets/logo.png";
import "./NavBar.css"; 

export default function NavBar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("USER_ROLE");

  const handleLogout = async () => {
    try {
      await axiosClient.post("/logout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
        },
      });
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("USER_ROLE");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <img src= {logo} alt="College de Paris" />
      </div>

      <nav className="nav-links">
        <Link to={`/${role}/dashboard`}> dashboard</Link>

        {role === 'admin' && (
          <>
            <Link to="/admin/users"> User Management</Link>
            <Link to="/admin/summary"> Summary Management</Link>
            <Link to="/admin/payment"> Payment Management</Link>
          </>
        )}

        {role === 'student' && (
          <>
            <Link to="/student/summary"> My Summaries</Link>
            <Link to="/student/payment"> My Payments</Link>
          </>
        )}

        <button onClick={handleLogout} className="logout-btn">
           Log Out
        </button>
      </nav>
    </aside>
  );
}
