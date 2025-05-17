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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Make API call to get user details
        const response = await axiosClient.get(`/users/${id}`);
        setUser(response.data);
        
        // Fetch user payments
        const paymentsResponse = await axiosClient.get(`/users/${id}/payments`);
        setPayments(paymentsResponse.data || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [id]);
  
  // Handle user update
  const handleUserUpdated = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };
  
  // Handle payment added
  const handlePaymentAdded = (newPayment) => {
    setPayments(prev => [...prev, newPayment]);
  };
  
  // Handle user deletion
  const handleUserDeleted = () => {
    // Navigate back to users list
    window.location.href = "/admin/users";
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
      </div>
    );
  }

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
        </Col>

        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Tabs defaultActiveKey="details" className="mb-3">
                {/* Details Tab */}
                <Tab eventKey="details" title="Details">
                  {user.role === 'teacher' && (
                    <div>
                      <h5 className="mb-3">Teaching Schedule</h5>
                      <TeacherScheduleView teacherId={id} />
                      
                      <hr className="my-4" />
                      
                      <TeacherHoursBySubject teacherId={id} />
                    </div>
                  )}
                  
                  {user.role === 'student' && (
                    <div>
                      <h5 className="mb-3">Student Information</h5>
                      <Row>
                        <Col md={6}>
                          <p><strong>Class:</strong> {user.classroom || 'Not assigned'}</p>
                          <p><strong>Parents:</strong> {user.parents || 'Not provided'}</p>
                        </Col>
                        <Col md={6}>
                          <p><strong>Enrolled Date:</strong> {user.enrollmentDate || 'Not provided'}</p>
                        </Col>
                      </Row>
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
                  {payments.length > 0 ? (
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
                
                {/* Notes Tab */}
                <Tab eventKey="notes" title="Notes">
                  <p className="text-muted">Notes feature coming soon</p>
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
