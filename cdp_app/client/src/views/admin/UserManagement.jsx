// src/components/UserManagement.jsx
import { useEffect, useState, Fragment } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../axios-client';
import Attendance from './Attendance';
import './UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredRole, setFilteredRole] = useState('admin');
  const [activePaymentUserId, setActivePaymentUserId] = useState(null);
  const [payments, setPayments] = useState({});
  const [newAmount, setNewAmount] = useState('');
  const [scheduleTab, setScheduleTab] = useState('today');
  const [teachingSchedule, setTeachingSchedule] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get('/users')
      .then(({ data }) => setUsers(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (filteredRole === 'teacher') {
      const endpoint =
        scheduleTab === 'today' ? '/emploi/today' :
        scheduleTab === 'this_week' ? '/emploi/week' :
        '/emploi/next-week';

      axiosClient.get(endpoint)
        .then(({ data }) => setTeachingSchedule(data.schedules || data))
        .catch(console.error);
    }
  }, [filteredRole, scheduleTab]);

  const fetchPayments = id =>
    axiosClient.get(`/students/${id}/payments`)
      .then(({ data }) => setPayments(p => ({ ...p, [id]: data })))
      .catch(console.error);

  const togglePaymentBox = id => {
    if (activePaymentUserId === id) {
      setActivePaymentUserId(null);
    } else {
      setActivePaymentUserId(id);
      fetchPayments(id);
    }
  };

  const addPayment = id => {
    if (!newAmount) return;
    axiosClient.post(`/student-payments`, {
      student_id: id,
      amount: newAmount,
      method: 'cash',
      date: new Date().toISOString().slice(0, 10),
      plan_type: 'full'
    })
    .then(() => {
      fetchPayments(id);
      setNewAmount('');
    })
    .catch(console.error);
  };

  const filteredUsers = users.filter(u => u.role === filteredRole);

  return (
    <div className="user-management-container">
      <header className="user-management-header">
        <h2>User Management</h2>
        <div>
          <Link to="/admin/users/new" className="add-user-btn">+ Add User</Link>
          <Link to="/admin/schedule" className="btn-schedule">📅 Full Schedule</Link>
        </div>
      </header>

      <nav className="role-filter-buttons">
        {['admin', 'teacher', 'student'].map(r => (
          <button
            key={r}
            className={filteredRole === r ? 'active' : ''}
            onClick={() => setFilteredRole(r)}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}s
          </button>
        ))}
      </nav>

      <section className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Role</th>
              {(filteredRole === 'teacher' || filteredRole === 'student') && <th>Actions</th>}
              <th>{/* Go to Profile Arrow */}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <Fragment key={u.id}>
                <tr className="clickable-row" onClick={() => navigate(`/admin/users/${u.id}`)}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td className="role-cell">{u.role}</td>

                  {filteredRole === 'teacher' && (
                    <td>
                      <Link
                        to={`/admin/users/${u.id}/schedule`}
                        className="btn-schedule"
                        onClick={e => e.stopPropagation()}
                      >
                        📆 Schedule
                      </Link>
                    </td>
                  )}

                  {filteredRole === 'student' && (
                    <td>
                      <button
                        className="btn-payment"
                        onClick={e => { e.stopPropagation(); togglePaymentBox(u.id); }}
                      >
                        💳 Payments
                      </button>
                    </td>
                  )}

                  {/* Arrow Icon */}
                  <td>
                    <Link
                      to={`/admin/users/${u.id}`}
                      className="profile-arrow"
                      onClick={e => e.stopPropagation()}
                      style={{
                        fontSize: '1.25rem',
                        textDecoration: 'none',
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem'
                      }}
                    >
                      &gt;
                    </Link>
                  </td>
                </tr>

                {filteredRole === 'student' && activePaymentUserId === u.id && (
                  <tr className="payment-row" key={`pay-${u.id}`}>
                    <td colSpan="5">
                      <div className="payment-box">
                        <h4>Payments for {u.name}</h4>
                        <ul>
                          {(payments[u.id] || []).map(p => (
                            <li key={p.id}>${p.amount} — {new Date(p.date).toLocaleDateString()}</li>
                          ))}
                        </ul>
                        <div className="payment-form">
                          <input
                            type="number"
                            placeholder="Amount"
                            value={newAmount}
                            onChange={e => setNewAmount(e.target.value)}
                          />
                          <button onClick={() => addPayment(u.id)}>Add</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </section>

      {filteredRole === 'teacher' && (
        <>
          <section className="schedule-tabs">
            <div className="tabs">
              {[
                { key: 'today', label: 'Today' },
                { key: 'this_week', label: 'This Week' },
                { key: 'next_week', label: 'Next Week' },
              ].map(t => (
                <button
                  key={t.key}
                  className={scheduleTab === t.key ? 'active' : ''}
                  onClick={() => setScheduleTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          <section className="embedded-attendance-section">
            <h3>📋 Attendance ({scheduleTab.replace('_', ' ')})</h3>
            <Attendance range={
              scheduleTab === 'today' ? 'today' :
              scheduleTab === 'this_week' ? 'week' : 'month'
            } />
          </section>
        </>
      )}
    </div>
  );
}
