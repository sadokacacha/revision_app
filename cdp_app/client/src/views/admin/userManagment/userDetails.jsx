import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Card, Table, Row, Col, Badge, Tabs, Tab } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../../../axios-client";

// Import components
import TeacherScheduleView from "./components/TeacherScheduleView";
import TeacherHoursBySubject from "./components/TeacherHoursBySubject";
import PaymentFormModal from "./components/PaymentFormModal";
import PaymentsList from "./components/PaymentsList";
import UserProfile from "./components/UserProfile";
import EditUserModal from "./components/EditUserModal";
import DeleteUserModal from "./components/DeleteUserModal";

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payments, setPayments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Fetch user data when component mounts or when id changes
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Make API call to get user details
        const response = await axiosClient.get(`/users/${id}`);
        
        // Check if we got valid user data
        if (response.data && response.data.id) {
          setUser(response.data);
          
          // Fetch user payments
          try {
            const paymentsResponse = await axiosClient.get(`/users/${id}/payments`);
            if (Array.isArray(paymentsResponse.data)) {
              setPayments(paymentsResponse.data);
            } else {
              console.warn('Invalid payments data format:', paymentsResponse.data);
              setPayments([]);
            }
          } catch (paymentError) {
            console.error('Error fetching payment data:', paymentError);
            setPayments([]);
          }

          // Fetch teacher attendance if user is a teacher
          if (response.data.role === 'teacher') {
            try {
              const teacherProfileId = response.data.teacher?.id || id;
              if (teacherProfileId) {
                const attendanceResponse = await axiosClient.get(`/teachers/${teacherProfileId}/attendance`);
                if (Array.isArray(attendanceResponse.data)) {
                  setAttendance(attendanceResponse.data);
                } else {
                  setAttendance([]);
                }
              } else {
                setAttendance([]);
              }
            } catch (attendanceError) {
              setAttendance([]);
              // Optionally show a message: "No attendance data available"
            }
          }
        } else {
          console.error('Invalid user data received:', response.data);
          setError('Invalid user data received from server.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchUserData();
    }
  }, [id]);
  
  // Calculate teacher's total hours and payment
  const calculateTeacherPayments = () => {
    if (!user || user.role !== 'teacher' || !attendance.length) return null;
    
    const presentDays = attendance.filter(record => record.status === 'present');
    const totalHours = presentDays.reduce((sum, day) => sum + (day.hours || 8), 0);
    const totalPayment = totalHours * (user.ratePerHour || 0);
    
    return {
      totalHours,
      totalPayment,
      presentDays: presentDays.length
    };
  };
  
  // Handle user update
  const handleUserUpdated = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };
  
  // Handle payment added
  const handlePaymentAdded = (newPayment) => {
    if (newPayment) {
      setPayments(prev => Array.isArray(prev) ? [...prev, newPayment] : [newPayment]);
    }
  };
  
  // Handle user deletion
  const handleUserDeleted = () => {
    window.location.href = "/admin/users";
  };

  // Handle teacher payment
  const handleTeacherPayment = async () => {
    try {
      const paymentData = {
        userId: id,
        amount: calculateTeacherPayments().totalPayment,
        date: new Date().toISOString().split('T')[0],
        status: 'paid',
        method: 'bank',
        type: 'salary',
        hours: calculateTeacherPayments().totalHours
      };
      
      const response = await axiosClient.post(`/users/${id}/payments`, paymentData);
      handlePaymentAdded(response.data);
      alert('Teacher payment recorded successfully!');
    } catch (error) {
      console.error('Error recording teacher payment:', error);
      alert('Failed to record teacher payment');
    }
  };
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="alert alert-danger my-5" role="alert">
        {error || 'User not found'}
        <div className="mt-3">
          <Link to="/admin/users" className="btn btn-primary">
            Back to Users List
          </Link>
        </div>
      </div>
    );
  }

  const teacherPayments = calculateTeacherPayments();

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.find(a => a.date === today);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>User Details</h2>
        <Link to="/admin/users" className="btn btn-outline-secondary">
          Back to Users
        </Link>
      </div>

      <Row>
        {/* User Profile Card */}
        <Col md={4} className="mb-4">
          <UserProfile 
            user={user} 
            onEditClick={() => setShowEditModal(true)}
            onDeleteClick={() => setShowDeleteModal(true)}
          />
          
          {user.role === 'student' && (
            <div className="mt-3">
              <Button variant="primary" size="sm" className="w-100" onClick={() => setShowPaymentModal(true)}>
                Record Payment
              </Button>
            </div>
          )}

          {user.role === 'teacher' && teacherPayments && (
            <Card className="mt-3">
              <Card.Body>
                <h6>This Month's Summary</h6>
                <p className="mb-1">Total Hours: {teacherPayments.totalHours}</p>
                <p className="mb-1">Present Days: {teacherPayments.presentDays}</p>
                <p className="mb-3">Total Payment: ${teacherPayments.totalPayment}</p>
                <Button 
                  variant="success" 
                  size="sm" 
                  className="w-100"
                  onClick={handleTeacherPayment}
                >
                  Record Payment
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Tabs defaultActiveKey="details" className="mb-3">
                {/* Details Tab */}
                <Tab eventKey="details" title="Details">
                  {user.role === 'teacher' && (
                    <div>
                      <h5 className="mb-3">Teaching Information</h5>
                      <Row>
                        <Col md={6}>
                          <p><strong>Subjects:</strong> {user.modules && user.modules.length > 0 ? user.modules.map(m => m.name).join(", ") : "Not assigned"}</p>
                          <p><strong>Classes:</strong> {user.classrooms ? (Array.isArray(user.classrooms) ? user.classrooms.join(", ") : user.classrooms) : "Not assigned"}</p>
                          <p><strong>Rate per Hour:</strong> ${user.hourly_rate || user.ratePerHour || 0}/hr</p>
                          <p><strong>Payment Method:</strong> {user.payment_method || "Not set"}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Total Due This Month:</strong> ${user.total_due || 0}</p>
                          <p><strong>Modules Taught:</strong></p>
                          <ul>
                            {user.modules && user.modules.length > 0 ? user.modules.map(m => (
                              <li key={m.id}>
                                {m.name}: {m.hours_done}h x ${m.price_per_hour}/hr = ${m.price_due}
                              </li>
                            )) : <li>No modules</li>}
                          </ul>
                        </Col>
                      </Row>
                      <hr className="my-4" />
                      <h5 className="mb-3">Payment History</h5>
                      {user.payments && user.payments.length > 0 ? (
                        <Table responsive bordered hover>
                          <thead className="table-light">
                            <tr>
                              <th>Date</th>
                              <th>Amount</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {user.payments.map((p) => (
                              <tr key={p.id}>
                                <td>{new Date(p.date).toLocaleDateString()}</td>
                                <td>${p.amount}</td>
                                <td>{p.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p className="text-muted">No payment records found</p>
                      )}
                    </div>
                  )}
                  
                  {user.role === 'student' && (
                    <div>
                      <h5 className="mb-3">Student Information</h5>
                      <Row>
                        <Col md={6}>
                          <p><strong>Class:</strong> {user.classroom || 'Not assigned'}</p>
                          <p><strong>Parents:</strong> {user.parents || 'Not provided'}</p>
                          <p><strong>Payment Style:</strong> {user.payment_style || user.paymentStyle || 'monthly'}</p>
                          <p><strong>Payment Method:</strong> {user.payment_method || user.paymentMethod || 'bank'}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Enrolled Date:</strong> {user.enrollmentDate || 'Not provided'}</p>
                          <p><strong>Monthly Fee:</strong> ${user.monthlyFee || 0}</p>
                          <p><strong>Semester Fee:</strong> ${user.semesterFee || 0}</p>
                          <p><strong>Full Year Fee:</strong> ${user.fullYearFee || 0}</p>
                        </Col>
                      </Row>
                      <hr className="my-4" />
                      <h5 className="mb-3">Payment History</h5>
                      {Array.isArray(payments) && payments.length > 0 ? (
                        <Table responsive bordered hover>
                          <thead className="table-light">
                            <tr>
                              <th>Date</th>
                              <th>Amount</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((p) => (
                              <tr key={p.id}>
                                <td>{new Date(p.date).toLocaleDateString()}</td>
                                <td>${p.amount}</td>
                                <td>{p.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p className="text-muted">No payment records found</p>
                      )}
                    </div>
                  )}
                  
                  {user.role === 'admin' && (
                    <div>
                      <h5 className="mb-3">Admin Information</h5>
                      <p><strong>Access Level:</strong> {user.accessLevel || 'Standard'}</p>
                      <p><strong>Permissions:</strong> {user.permissions || 'Default permissions'}</p>
                    </div>
                  )}
                </Tab>
                
                {/* Payment History Tab */}
                <Tab eventKey="payments" title="Payment History">
                  {Array.isArray(payments) && payments.length > 0 ? (
                    <PaymentsList payments={payments} user={user} />
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-muted">No payment records found</p>
                      {user.role === 'student' && (
                        <Button variant="primary" onClick={() => setShowPaymentModal(true)}>
                          Record First Payment
                        </Button>
                      )}
                    </div>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Payment Form Modal */}
      <PaymentFormModal
        showModal={showPaymentModal}
        setShowModal={setShowPaymentModal}
        user={user}
        onPaymentAdded={handlePaymentAdded}
      />
      
      {/* Edit User Modal */}
      <EditUserModal
        key={`edit-user-${user.id}`}
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        user={user}
        onUserUpdated={handleUserUpdated}
      />
      
      {/* Delete User Modal */}
      <DeleteUserModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        user={user}
        onUserDeleted={handleUserDeleted}
      />
    </div>
  );
}
