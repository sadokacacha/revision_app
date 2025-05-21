import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Card } from "react-bootstrap";
import axiosClient from "../../../../axios-client";

const UserFormModal = ({ showModal, setShowModal, onUserCreated, availableClassrooms, availableSubjects, initialRole = 'student' }) => {
  const [loading, setLoading] = useState(false);
  
  // User form state
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: initialRole,
    // Teacher specific fields
    ratePerHour: '',
    paymentMethod: 'bank',
    paymentPlan: 'monthly',
    subjects: [],
    classrooms: [],
    // Student specific fields
    classroom: '',
    paymentStyle: 'monthly',
    paymentPeriod: '9',
    paymentMethod: 'bank',
    // Common fields
    status: 'active',
    notes: ''
  });
  
  const handleUserFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle multi-select checkboxes (subjects, classrooms)
      if (name === 'subjects') {
        const updatedSubjects = checked 
          ? [...userForm.subjects, parseInt(value)]
          : userForm.subjects.filter(id => id !== parseInt(value));
        
        setUserForm(prev => ({ ...prev, subjects: updatedSubjects }));
      } else if (name === 'classrooms') {
        const updatedClassrooms = checked 
          ? [...userForm.classrooms, parseInt(value)]
          : userForm.classrooms.filter(id => id !== parseInt(value));
        
        setUserForm(prev => ({ ...prev, classrooms: updatedClassrooms }));
      }
    } else {
      // Handle regular inputs
      setUserForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmitUserForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare data based on role
      const userData = {
        name: `${userForm.firstName} ${userForm.lastName}`,
        email: userForm.email,
        password: userForm.password,
        phone: userForm.phone,
        address: userForm.address,
        role: userForm.role,
        status: userForm.status,
        notes: userForm.notes
      };
      
      // Add role-specific data
      if (userForm.role === 'teacher') {
        userData.teacherData = {
          hourly_rate: parseFloat(userForm.ratePerHour) || 0,
          payment_method: userForm.paymentMethod,
          payment_plan: userForm.paymentPlan,
          subjects: userForm.subjects,
          classrooms: userForm.classrooms
        };
      } else if (userForm.role === 'student') {
        // Calculate fees based on payment style
        const baseMonthlyFee = 300;
        const baseSemesterFee = 1500;
        const baseFullYearFee = 2800;
        
        userData.studentData = {
          classroom: userForm.classroom,
          payment_style: userForm.paymentStyle,
          payment_period: parseInt(userForm.paymentPeriod) || 9,
          payment_method: userForm.paymentMethod,
          monthly_fee: baseMonthlyFee,
          semester_fee: baseSemesterFee,
          full_year_fee: baseFullYearFee
        };
      }
      
      // Make API call to create user
      const response = await axiosClient.post('/users', userData);
      
      // Close modal and reset form
      resetFormAndClose();
      
      // Notify parent component
      if (onUserCreated && typeof onUserCreated === 'function') {
        onUserCreated(response.data);
      }
      
      // Show success message
      alert('User created successfully!');
      
    } catch (error) {
      console.error('Error creating user:', error);
      
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          alert(`Failed to create user: ${error.response.data.message}`);
        } else if (error.response.data && error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
          alert(`Validation errors:\n${errorMessages}`);
        } else {
          alert(`Failed to create user (${error.response.status})`);
        }
      } else {
        alert('Failed to create user. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const resetFormAndClose = () => {
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      role: initialRole,
      ratePerHour: '',
      paymentMethod: 'bank',
      paymentPlan: 'monthly',
      subjects: [],
      classrooms: [],
      classroom: '',
      paymentStyle: 'monthly',
      paymentPeriod: '9',
      status: 'active',
      notes: ''
    });
    setShowModal(false);
  };

  return (
    <Modal 
      show={showModal} 
      onHide={resetFormAndClose} 
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New {userForm.role.charAt(0).toUpperCase() + userForm.role.slice(1)}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmitUserForm}>
        <Modal.Body>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">Basic Information</h5>
              
              {/* Role Selection */}
              <Form.Group controlId="role" className="mb-3">
                <Form.Label>User Role</Form.Label>
                <Form.Select 
                  name="role"
                  value={userForm.role} 
                  onChange={handleUserFormChange}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>

              {/* Basic Information - All User Types */}
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first name"
                      name="firstName"
                      value={userForm.firstName}
                      onChange={handleUserFormChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter last name" 
                      name="lastName"
                      value={userForm.lastName}
                      onChange={handleUserFormChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      placeholder="Enter email" 
                      name="email"
                      value={userForm.email}
                      onChange={handleUserFormChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter phone number"
                      name="phone"
                      value={userForm.phone}
                      onChange={handleUserFormChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="address" className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter address"
                  name="address"
                  value={userForm.address}
                  onChange={handleUserFormChange}
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Enter password" 
                  name="password"
                  value={userForm.password}
                  onChange={handleUserFormChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="status" className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={userForm.status}
                  onChange={handleUserFormChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="notes" className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  placeholder="Enter any additional notes"
                  name="notes"
                  value={userForm.notes}
                  onChange={handleUserFormChange}
                />
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Teacher-Specific Fields */}
          {userForm.role === 'teacher' && (
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Teacher Information</h5>
                
                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="ratePerHour">
                      <Form.Label>Rate per Hour ($)</Form.Label>
                      <Form.Control
                        type="number"
                        step="0.01"
                        name="ratePerHour"
                        value={userForm.ratePerHour}
                        onChange={handleUserFormChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="paymentPlan">
                      <Form.Label>Payment Plan</Form.Label>
                      <Form.Select
                        name="paymentPlan"
                        value={userForm.paymentPlan}
                        onChange={handleUserFormChange}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="semester">Semester</option>
                        <option value="yearly">Yearly</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="paymentMethod" className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select
                    name="paymentMethod"
                    value={userForm.paymentMethod}
                    onChange={handleUserFormChange}
                  >
                    <option value="bank">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="subjects" className="mb-3">
                  <Form.Label>Subjects</Form.Label>
                  <div className="border rounded p-2">
                    {availableSubjects.map(subject => (
                      <Form.Check
                        key={subject.id}
                        type="checkbox"
                        id={`subject-${subject.id}`}
                        label={subject.name}
                        name="subjects"
                        value={subject.id}
                        checked={userForm.subjects.includes(subject.id)}
                        onChange={handleUserFormChange}
                      />
                    ))}
                  </div>
                </Form.Group>

                <Form.Group controlId="classrooms" className="mb-3">
                  <Form.Label>Assigned Classrooms</Form.Label>
                  <div className="border rounded p-2">
                    {availableClassrooms.map(classroom => (
                      <Form.Check
                        key={classroom.id}
                        type="checkbox"
                        id={`classroom-${classroom.id}`}
                        label={classroom.name}
                        name="classrooms"
                        value={classroom.id}
                        checked={userForm.classrooms.includes(classroom.id)}
                        onChange={handleUserFormChange}
                      />
                    ))}
                  </div>
                </Form.Group>
              </Card.Body>
            </Card>
          )}

          {/* Student-Specific Fields */}
          {userForm.role === 'student' && (
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Student Information</h5>
                
                <Form.Group controlId="classroom" className="mb-3">
                  <Form.Label>Classroom</Form.Label>
                  <Form.Select
                    name="classroom"
                    value={userForm.classroom}
                    onChange={handleUserFormChange}
                    required
                  >
                    <option value="">Select a classroom</option>
                    {availableClassrooms.map(classroom => (
                      <option key={classroom.id} value={classroom.id}>
                        {classroom.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="paymentStyle">
                      <Form.Label>Payment Style</Form.Label>
                      <Form.Select
                        name="paymentStyle"
                        value={userForm.paymentStyle}
                        onChange={handleUserFormChange}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="semester">Semester</option>
                        <option value="full">Full Year</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="paymentMethod">
                      <Form.Label>Payment Method</Form.Label>
                      <Form.Select
                        name="paymentMethod"
                        value={userForm.paymentMethod}
                        onChange={handleUserFormChange}
                      >
                        <option value="bank">Bank Transfer</option>
                        <option value="cash">Cash</option>
                        <option value="check">Check</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {userForm.paymentStyle === 'monthly' && (
                  <Form.Group controlId="paymentPeriod" className="mb-3">
                    <Form.Label>Payment Period (Months)</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="12"
                      name="paymentPeriod"
                      value={userForm.paymentPeriod}
                      onChange={handleUserFormChange}
                    />
                  </Form.Group>
                )}
              </Card.Body>
            </Card>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={resetFormAndClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserFormModal; 