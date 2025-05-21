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
  const [availableClassrooms, setAvailableClassrooms] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  
  // Fetch user data when component mounts or when id changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch classrooms and subjects
        const [classroomsResponse, subjectsResponse] = await Promise.all([
          axiosClient.get('/classrooms'),
          axiosClient.get('/subjects')
        ]);
        
        setAvailableClassrooms(classroomsResponse.data);
        setAvailableSubjects(subjectsResponse.data);
        
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
              const teacherProfileId = response.data.teacher?.id;
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
              console.error('Error fetching attendance:', attendanceError);
              setAttendance([]);
            }
          }
        } else {
          console.error('Invalid user data received:', response.data);
          setError('Invalid user data received from server.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id]);
  
  // Calculate teacher's total hours and payment
  const calculateTeacherPayments = () => {
    if (!user || user.role !== 'teacher' || !attendance.length) return null;
    
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const presentDays = attendance.filter(record => 
      record.status === 'present' && 
      record.date.startsWith(currentMonth)
    );
    
    const totalHours = presentDays.reduce((sum, day) => sum + (day.hours || 8), 0);
    const totalPayment = totalHours * (user.ratePerHour || user.hourly_rate || 0);
    
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
      const teacherPayments = calculateTeacherPayments();
      if (!teacherPayments || teacherPayments.totalHours === 0) {
        alert('No hours to pay for this month');
        return;
      }

      const paymentData = {
        userId: id,
        amount: teacherPayments.totalPayment,
        date: new Date().toISOString().split('T')[0],
        status: 'paid',
        method: user.paymentMethod || user.payment_method || 'bank',
        type: 'salary',
        hours: teacherPayments.totalHours,
        description: `Salary payment for ${teacherPayments.totalHours} hours`,
        period: new Date().toISOString().slice(0, 7) // YYYY-MM format
      };
      
      const response = await axiosClient.post(`/users/${id}/payments`, paymentData);
      if (response.data) {
        handlePaymentAdded(response.data);
        alert('Teacher payment recorded successfully!');
      }
    } catch (error) {
      console.error('Error recording teacher payment:', error);
      alert(error.response?.data?.message || 'Failed to record teacher payment');
    }
  };

  // Handle student payment
  const handleStudentPayment = async (paymentData) => {
    try {
      const response = await axiosClient.post(`/users/${id}/payments`, {
        ...paymentData,
        userId: id,
        type: 'fee',
        status: 'paid',
        period: paymentData.period || new Date().toISOString().slice(0, 7) // YYYY-MM format
      });
      
      if (response.data) {
        handlePaymentAdded(response.data);
        alert('Student payment recorded successfully!');
      }
    } catch (error) {
      console.error('Error recording student payment:', error);
      alert(error.response?.data?.message || 'Failed to record student payment');
    }
  };

  // Calculate student's payment summary
  const calculateStudentPayments = () => {
    if (!user || user.role !== 'student') return null;

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const monthlyPayments = payments.filter(p => 
      p.status === 'paid' && 
      p.period === currentMonth
    );

    const totalPaid = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalDue = user.total_due || 0;
    const remaining = totalDue - totalPaid;

    return {
      totalPaid,
      totalDue,
      remaining,
      monthlyPayments
    };
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
            <Card className="mt-3">
              <Card.Body>
                <h6>Payment Summary</h6>
                {(() => {
                  const summary = calculateStudentPayments();
                  return (
                    <>
                      <p className="mb-1">Total Due: ${summary.totalDue}</p>
                      <p className="mb-1">Total Paid: ${summary.totalPaid}</p>
                      <p className="mb-3">Remaining: ${summary.remaining}</p>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="w-100"
                        onClick={() => setShowPaymentModal(true)}
                      >
                        Record Payment
                      </Button>
                    </>
                  );
                })()}
              </Card.Body>
            </Card>
          )}

          {user.role === 'teacher' && teacherPayments && (
            <Card className="mt-3">
              <Card.Body>
                <h6>This Month's Summary</h6>
                <p className="mb-1">Total Hours: {teacherPayments.totalHours}</p>
                <p className="mb-1">Present Days: {teacherPayments.presentDays}</p>
                <p className="mb-1">Rate per Hour: ${user.ratePerHour || user.hourly_rate || 0}</p>
                <p className="mb-3">Total Payment: ${teacherPayments.totalPayment}</p>
                <Button 
                  variant="success" 
                  size="sm" 
                  className="w-100"
                  onClick={handleTeacherPayment}
                  disabled={teacherPayments.totalHours === 0}
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
                          <p><strong>Subjects:</strong> {user.subjects && user.subjects.length > 0 ? user.subjects.map(s => s.name).join(", ") : "Not assigned"}</p>
                          <p><strong>Classes:</strong> {user.classrooms && user.classrooms.length > 0 ? user.classrooms.map(c => c.name).join(", ") : "Not assigned"}</p>
                          <p><strong>Rate per Hour:</strong> ${user.hourly_rate || user.ratePerHour || 0}/hr</p>
                          <p><strong>Payment Method:</strong> {user.payment_method || user.paymentMethod || "Not set"}</p>
                          <p><strong>Payment Plan:</strong> {user.payment_plan || user.paymentPlan || "Not set"}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Status:</strong> <Badge bg={user.status === 'active' ? 'success' : user.status === 'inactive' ? 'warning' : 'danger'}>{user.status}</Badge></p>
                          <p><strong>Total Due This Month:</strong> ${user.total_due || 0}</p>
                          <p><strong>Modules Taught:</strong></p>
                          <ul>
                            {user.subjects && user.subjects.length > 0 ? user.subjects.map(s => (
                              <li key={s.id}>
                                {s.name}: {s.hours_done}h x ${s.price_per_hour}/hr = ${s.price_due}
                              </li>
                            )) : <li>No modules</li>}
                          </ul>
                        </Col>
                      </Row>
                      <hr className="my-4" />
                      <h5 className="mb-3">Payment History</h5>
                      {payments && payments.length > 0 ? (
                        <Table responsive bordered hover>
                          <thead className="table-light">
                            <tr>
                              <th>Date</th>
                              <th>Amount</th>
                              <th>Method</th>
                              <th>Status</th>
                              <th>Hours</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map(payment => (
                              <tr key={payment.id}>
                                <td>{new Date(payment.date).toLocaleDateString()}</td>
                                <td>${payment.amount}</td>
                                <td>{payment.method}</td>
                                <td>
                                  <Badge bg={payment.status === 'paid' ? 'success' : 'warning'}>
                                    {payment.status}
                                  </Badge>
                                </td>
                                <td>{payment.hours || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p>No payment history available.</p>
                      )}
                    </div>
                  )}

                  {user.role === 'student' && (
                    <div>
                      <h5 className="mb-3">Student Information</h5>
                      <Row>
                        <Col md={6}>
                          <p><strong>Classroom:</strong> {user.classroom?.name || "Not assigned"}</p>
                          <p><strong>Payment Style:</strong> {user.payment_style || user.paymentStyle || "Not set"}</p>
                          <p><strong>Payment Method:</strong> {user.payment_method || user.paymentMethod || "Not set"}</p>
                          <p><strong>Status:</strong> <Badge bg={user.status === 'active' ? 'success' : user.status === 'inactive' ? 'warning' : 'danger'}>{user.status}</Badge></p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Total Due:</strong> ${user.total_due || 0}</p>
                          <p><strong>Next Payment Date:</strong> {user.next_payment_date ? new Date(user.next_payment_date).toLocaleDateString() : "Not set"}</p>
                          <p><strong>Payment Period:</strong> {user.payment_period || user.paymentPeriod || "Not set"} months</p>
                        </Col>
                      </Row>
                      <hr className="my-4" />
                      <h5 className="mb-3">Payment History</h5>
                      {payments && payments.length > 0 ? (
                        <Table responsive bordered hover>
                          <thead className="table-light">
                            <tr>
                              <th>Date</th>
                              <th>Amount</th>
                              <th>Method</th>
                              <th>Status</th>
                              <th>Period</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map(payment => (
                              <tr key={payment.id}>
                                <td>{new Date(payment.date).toLocaleDateString()}</td>
                                <td>${payment.amount}</td>
                                <td>{payment.method}</td>
                                <td>
                                  <Badge bg={payment.status === 'paid' ? 'success' : 'warning'}>
                                    {payment.status}
                                  </Badge>
                                </td>
                                <td>{payment.period || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <p>No payment history available.</p>
                      )}
                    </div>
                  )}

                  {user.role === 'admin' && (
                    <div>
                      <h5 className="mb-3">Admin Information</h5>
                      <Row>
                        <Col md={6}>
                          <p><strong>Status:</strong> <Badge bg={user.status === 'active' ? 'success' : user.status === 'inactive' ? 'warning' : 'danger'}>{user.status}</Badge></p>
                          <p><strong>Last Login:</strong> {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
                          <p><strong>Updated At:</strong> {new Date(user.updated_at).toLocaleString()}</p>
                        </Col>
                      </Row>
                    </div>
                  )}
                </Tab>

                {/* Schedule Tab - Only for Teachers */}
                {user.role === 'teacher' && (
                  <Tab eventKey="schedule" title="Schedule">
                    <TeacherScheduleView teacherId={user.id} />
                  </Tab>
                )}

                {/* Hours by Subject Tab - Only for Teachers */}
                {user.role === 'teacher' && (
                  <Tab eventKey="hours" title="Hours by Subject">
                    <TeacherHoursBySubject teacherId={user.teacher?.id} />
                  </Tab>
                )}
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit User Modal */}
      <EditUserModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        user={user}
        onUserUpdated={handleUserUpdated}
        availableClassrooms={availableClassrooms}
        availableSubjects={availableSubjects}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        user={user}
        onUserDeleted={handleUserDeleted}
      />

      {/* Payment Form Modal */}
      <PaymentFormModal
        showModal={showPaymentModal}
        setShowModal={setShowPaymentModal}
        user={user}
        onPaymentAdded={handleStudentPayment}
      />
    </div>
  );
}
