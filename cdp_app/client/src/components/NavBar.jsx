import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import logo from '../assets/logo.png';

const NavBar = () => {
  const { user, setUser, setToken } = useStateContext();
  const navigate = useNavigate();

  const onLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('USER_ROLE');
    navigate('/login');
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
            <img className="logo" src={logo} alt="Logo" />
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
          <div
            className="gap-4 mt-5 mb-5 col-10 mx-auto p-4
            d-flex flex-column justify-content-start align-items-start"
          >
            <Link to={`/${user.role}/dashboard`}>
              <button className="btn btn-blue rounded-3" type="button">
                <i className="bi bi-columns-gap"></i> Dashboard
              </button>
            </Link>

            <Link to={`/${user.role}/schedule`}>
              <button className="btn btn-blue rounded-3" type="button">
                <i className="bi bi-calendar-day"></i> Schedule
              </button>
            </Link>

            <Link to={`/${user.role}/attendance`}>
              <button className="btn btn-blue rounded-3" type="button">
                <i className="bi bi-clipboard2-check"></i> Attendance
              </button>
            </Link>

            <Link to={`/${user.role}/payments`}>
              <button className="btn btn-blue rounded-3" type="button">
                <i className="bi bi-wallet2"></i> Payments
              </button>
            </Link>
            
            {user.role === 'admin' && (
              <Link to={`/${user.role}/users`}>
                <button className="btn btn-blue rounded-3" type="button">
                  <i className="bi bi-person-plus"></i> User Management
                </button>
              </Link>
            )}
            
            {user.role === 'admin' && (
              <Link to={`/${user.role}/classrooms`}>
                <button className="btn btn-blue rounded-3" type="button">
                  <i className="bi bi-clipboard2-plus"></i> Modules
                </button>
              </Link>
            )}

            <button 
              className="btn btn-blue rounded-3" 
              type="button" 
              onClick={onLogout}
            >
              <i className="bi bi-door-open"></i> Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
