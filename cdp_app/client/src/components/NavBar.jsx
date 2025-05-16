import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextsProvider";
import logo from "../assets/logo.png";

export default function NavBar() {
  const navigate = useNavigate();
  const { logout } = useStateContext();
  const role = localStorage.getItem("USER_ROLE");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <button
        className="btn"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#staticBackdrop"
        aria-controls="staticBackdrop"
      >
        <i className="bi bi-list"></i>
      </button>

      <div
        className="offcanvas offcanvas-start n-css"
        data-bs-backdrop="static"
        tabIndex="-1"
        id="staticBackdrop"
        aria-labelledby="staticBackdropLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="staticBackdropLabel"></h5>
          <div className="logo">
            <img src={logo} alt="College de Paris" className="logo" />
          </div>
          <div data-bs-theme="dark">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>

        <div className="offcanvas-body">
          <div className="gap-4 mt-5 mb-5 col-10 mx-auto p-4 d-flex flex-column justify-content-start align-items-start">
            <Link to={`/${role}/dashboard`} className="btn btn-blue rounded-3 w-100">
              <i className="bi bi-columns-gap me-2"></i> Dashboard
            </Link>

            {role === 'admin' && (
              <>
                <Link to="/admin/users" className="btn btn-blue rounded-3 w-100">
                  <i className="bi bi-person-plus me-2"></i> User Management
                </Link>
                <Link to="/admin/classrooms" className="btn btn-blue rounded-3 w-100">
                  <i className="bi bi-building me-2"></i> Classrooms
                </Link>
                <Link to="/admin/schedule" className="btn btn-blue rounded-3 w-100">
                  <i className="bi bi-calendar-day me-2"></i> Schedule
                </Link>
                <Link to="/admin/attendance" className="btn btn-blue rounded-3 w-100">
                  <i className="bi bi-clipboard2-check me-2"></i> Attendance
                </Link>
              </>
            )}

            {role === 'teacher' && (
              <>
                <Link to="/teacher/profile" className="btn btn-blue rounded-3 w-100">
                  <i className="bi bi-person-circle me-2"></i> Profile
                </Link>
                <Link to="/teacher/schedule" className="btn btn-blue rounded-3 w-100">
                  <i className="bi bi-calendar-day me-2"></i> Schedule
                </Link>
                <Link to="/teacher/attendance" className="btn btn-blue rounded-3 w-100">
                  <i className="bi bi-clipboard2-check me-2"></i> Attendance
                </Link>
                <Link to="/teacher/payments" className="btn btn-blue rounded-3 w-100">
                  <i className="bi bi-wallet2 me-2"></i> Payments
                </Link>
              </>
            )}

            {role === 'student' && (
              <>
                <Link to="/student/profile" className="btn btn-blue rounded-3 w-100">
                  <i className="bi bi-person-circle me-2"></i> Profile
                </Link>
                <Link to="/student/schedule" className="btn btn-blue rounded-3 w-100">
                  <i className="bi bi-calendar-day me-2"></i> Schedule
                </Link>
                <Link to="/student/attendance" className="btn btn-blue rounded-3 w-100">
                  <i className="bi bi-clipboard2-check me-2"></i> Attendance
                </Link>
                <Link to="/student/payments" className="btn btn-blue rounded-3 w-100">
                  <i className="bi bi-wallet2 me-2"></i> Payments
                </Link>
              </>
            )}

            <button onClick={handleLogout} className="btn btn-blue rounded-3 w-100">
              <i className="bi bi-door-open me-2"></i> Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
