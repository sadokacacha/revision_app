import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../axios-client';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    teachers: 0,
    students: 0,
    admins: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axiosClient.get('/users/counts');
        setCounts(response.data);
      } catch (error) {
        console.error('Error fetching user counts:', error);
      }
    };
    fetchCounts();
  }, []);

  const handleNavigation = (userType) => {
    navigate(`/admin/users?type=${userType}`);
  };

  return (
    <div>
      <div className="navbarposition">
      </div>
      <div className="container py-4">
        <h3 className="fw-bold mb-3">Payment Tracking</h3>
        <div className="bg-aliceblue p-3 rounded shadow-sm mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">Weekly Payment Calendar</h6>
            <small className="text-success">● Student Payments</small>
          </div>
          <div className="d-flex align-items-center mb-3 ">
            <button className="btn btn-sm btn-outline-secondary me-2">
              &lt;
            </button>
            <div>
              Week of <strong>March 18, 2025</strong>
            </div>
            <button className="btn btn-sm btn-outline-secondary ms-2">
              &gt;
            </button>
          </div>
          <div className="d-flex flex-wrap gap-2 ">
            {[
              {
                day: "Monday",
                date: "Mar 18",
                total: "$1",
                teachers: 1,
                students: 1,
              },
              {
                day: "Tuesday",
                date: "Mar 19",
                total: "$24.99",
                teachers: 0,
                students: 1,
              },
              {
                day: "Wednesday",
                date: "Mar 20",
                total: "$34.99",
                teachers: 1,
                students: 0,
              },
              { day: "Thursday", date: "Mar 21", total: null },
              {
                day: "Friday",
                date: "Mar 22",
                total: "$49.99",
                teachers: 0,
                students: 1,
              },
              { day: "Saturday", date: "Mar 23", total: null },
              { day: "Sunday", date: "Mar 24", total: null },
            ].map((item, index) => (
              <div
                key={index}
                className="card p-2 text-center"
                style={{ minWidth: "150px", flex: 1 }}
              >
                <strong>
                  {item.day}
                  <br />
                  {item.date}
                </strong>
                {item.total ? (
                  <>
                    <div className="small">Total</div>
                    <div>{item.total}</div>
                    <div className="text-primary small ">
                      {item.teachers} teachers
                    </div>
                    <div className="text-success small">
                      {item.students} students
                    </div>
                  </>
                ) : (
                  <div className="small">No payments</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <div className="align-items-center mb-2">
                <div className="me-2 d-flex flex-row justify-content-between align-items-center">
                  <div className="d-flex flex-row align-items-center flex-nowrap justify-content-start">
                    <span className="fs-4">
                      <i
                        className="bi bi-person-check"
                        style={{ color: "red" }}
                      ></i>
                    </span>
                    <h6 className="mb-0">Teacher Payments</h6>
                  </div>
                  <div>
                    <button 
                      onClick={() => handleNavigation('teacher')}
                      className="btn btn-link p-0"
                    >
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>

                <div className="small text-muted ">
                  Total Teachers: <strong>{counts.teachers}</strong>
                </div>
                <div className="small text-muted">
                  Pending Payments: <strong>12</strong>
                </div>
                <div className="small text-muted">
                  Next Payout: <strong>Jan 31, 2024</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <div className="align-items-center mb-2">
                <div className="me-2 d-flex flex-row justify-content-between align-items-center">
                  <div className="d-flex flex-row align-items-center flex-nowrap justify-content-start">
                    <span className="fs-4">
                      <i
                        className="bi bi-person-heart me-1"
                        style={{ color: "green" }}
                      >
                        {" "}
                      </i>
                    </span>
                    <h6 className="mb-0">Student Payments</h6>
                  </div>
                  <div>
                    <button 
                      onClick={() => handleNavigation('student')}
                      className="btn btn-link p-0"
                    >
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
                <div className="small text-muted">
                  Total Students: <strong>{counts.students}</strong>
                </div>
                <div className="small text-muted">
                  Pending Tuition: <strong>45</strong>
                </div>
                <div className="small text-muted">
                  Due This Month: <strong>$12,750</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <div className="align-items-center mb-2">
                <div className="me-2 d-flex flex-row justify-content-between align-items-center">
                  <div className="d-flex flex-row align-items-center flex-nowrap justify-content-start">
                    <span className="fs-4">
                      <i
                        className="bi bi-person-check me-1"
                        style={{ color: "blue" }}
                      >
                        {" "}
                      </i>
                    </span>
                    <h6 className="mb-0">Administration Payments</h6>
                  </div>
                  <div>
                    <button 
                      onClick={() => handleNavigation('admin')}
                      className="btn btn-link p-0"
                    >
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
                <div className="small text-muted">
                  Total Admins: <strong>{counts.admins}</strong>
                </div>
                <div className="small text-muted">
                  Pending Tuition: <strong>45</strong>
                </div>
                <div className="small text-muted">
                  Due This Month: <strong>$12,750</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;