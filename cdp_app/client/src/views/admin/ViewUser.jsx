// src/pages/ViewUser.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../axios-client';
import './ViewUser.css';

export default function ViewUser() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [user, setUser]         = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name:'', email:'', phone:'', address:'', role:''
  });

  useEffect(() => {
    // 1) load profile (teacher show now includes modules + payments)
    axiosClient.get(`/users/${id}`)
      .then(({ data }) => {
        setUser(data);
        setFormData({
          name:    data.name,
          email:   data.email,
          phone:   data.phone||'',
          address: data.address||'',
          role:    data.role
        });
      })
      .catch(console.error);
  }, [id]);

  const handleSave = () => {
    axiosClient.put(`/users/${id}`, formData)
      .then(() => {
        setUser(u => ({ ...u, ...formData }));
        setEditMode(false);
      })
      .catch(() => alert('Update failed'));
  };

  const handleDelete = () => {
    if (!window.confirm('Delete this user?')) return;
    axiosClient.delete(`/users/${id}`)
      .then(() => navigate('/admin/users'))
      .catch(() => alert('Delete failed'));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="user-profile">
      <header className="user-profile-header">
        <h2>User Details</h2>
        <div className="action-buttons">
          {editMode
            ? <>
                <button onClick={handleSave}>Save</button>
                <button onClick={()=>setEditMode(false)}>Cancel</button>
              </>
            : <>
                <button onClick={()=>setEditMode(true)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
              </>
          }
        </div>
      </header>

      <div className="user-profile-content">
        <div className="profile-card">
          {editMode
            ? <>
                <input
                  type="text" value={formData.name}
                  onChange={e=>setFormData(f=>({...f,name:e.target.value}))}
                  placeholder="Name"
                />
                <input
                  type="email" value={formData.email}
                  onChange={e=>setFormData(f=>({...f,email:e.target.value}))}
                  placeholder="Email"
                />
                <input
                  type="text" value={formData.phone}
                  onChange={e=>setFormData(f=>({...f,phone:e.target.value}))}
                  placeholder="Phone"
                />
                <input
                  type="text" value={formData.address}
                  onChange={e=>setFormData(f=>({...f,address:e.target.value}))}
                  placeholder="Address"
                />
                <select
                  value={formData.role}
                  onChange={e=>setFormData(f=>({...f,role:e.target.value}))}
                >
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </>
            : <>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                {user.role==='teacher' && user.modules && (
                  <>
                    <section className="classes-table">
                      <h3>Classes</h3>
                      <table>
                        <thead>
                          <tr>
                            <th>Module</th>
                            <th>Hours (Done/Total)</th>
                            <th>Price (€)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {user.modules.map(m => (
                            <tr key={m.id}>
                              <td>{m.name}</td>
                              <td>{m.hours_done}/{m.hours_required}</td>
                              <td>€{m.price_due.toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan="2"><strong>Total Due</strong></td>
                            <td><strong>€{user.total_due.toFixed(2)}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </section>

                    <section className="payment-history">
                      <h3>Payment History</h3>
                      <table>
                        <thead>
                          <tr><th>Date</th><th>Amount</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                          {user.payments.map(p=>(
                            <tr key={p.id}>
                              <td>{new Date(p.date).toLocaleDateString()}</td>
                              <td>€{p.amount.toFixed(2)}</td>
                              <td><span className={`status ${p.status}`}>{p.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </section>
                  </>
                )}

                {user.role==='student' && (
                  <div style={{ width:100, height:100, margin:'1rem auto' }}>
                    <CircularProgressbar value={33} text={`1/3`}
                      styles={buildStyles({
                        textColor:'#333', pathColor:'#865DFF', trailColor:'#eee'
                      })}/>
                  </div>
                )}
              </>
          }
          {!editMode && (
            <div className="info-block">
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Address:</strong> {user.address}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
          )}
        </div>

        <Link className="back-link" to="/admin/users">← Back to User Management</Link>
      </div>
    </div>
  );
}
