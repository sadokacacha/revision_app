import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
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
    role: initialRole,
    // Teacher specific fields
    ratePerHour: '',
    paymentMethod: 'bank',
    subjects: [],
    classrooms: [],
    // Student specific fields
    classroom: '',
    paymentStyle: 'monthly',
    paymentPeriod: '9',
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
      console.log("Creating user with role:", userForm.role);
      
      // Prepare data based on role
      const userData = {
        name: `${userForm.firstName} ${userForm.lastName}`,
        email: userForm.email,
        password: userForm.password,
        phone: userForm.phone,
        role: userForm.role,
      };
      
      // Add role-specific data
      if (userForm.role === 'teacher') {
        console.log("Teacher data:", {
          ratePerHour: parseFloat(userForm.ratePerHour) || 0,
          subjects: userForm.subjects,
          classrooms: userForm.classrooms
        });
        
        userData.teacherData = {
          ratePerHour: parseFloat(userForm.ratePerHour) || 0,
          paymentMethod: userForm.paymentMethod,
          subjects: userForm.subjects,
          classrooms: userForm.classrooms,
        };
      } else if (userForm.role === 'student') {
        // Calculate fees based on payment style
        const baseMonthlyFee = 300;
        const baseSemesterFee = 1500;
        const baseFullYearFee = 2800;
        
        userData.studentData = {
          classroom: userForm.classroom,
          paymentStyle: userForm.paymentStyle,
          paymentPeriod: parseInt(userForm.paymentPeriod) || 9,
          paymentMethod: userForm.paymentMethod,
          monthlyFee: baseMonthlyFee,
          semesterFee: baseSemesterFee,
          fullYearFee: baseFullYearFee
        };
        
        console.log("Student data:", userData.studentData);
      }
      
      console.log("Sending user data:", userData);
      
      // Make API call to create user
      const response = await axiosClient.post('/users', userData);
      
      console.log("User creation response:", response.data);
      
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
        console.log("Response error data:", error.response.data);
        console.log("Response status:", error.response.status);
        
        if (error.response.data && error.response.data.message) {
          alert(`Failed to create user: ${error.response.data.message}`);
        } else if (error.response.data && error.response.data.errors) {
          // Handle validation errors
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
      role: initialRole,
      ratePerHour: '',
      paymentMethod: 'bank',
      subjects: [],
      classrooms: [],
      classroom: '',
      paymentStyle: 'monthly',
      paymentPeriod: '9',
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
                  autoFocus
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

          <Form.Group controlId="email" className="mb-3">
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

          <Form.Group controlId="phone" className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter phone number"
              name="phone"
              value={userForm.phone}
              onChange={handleUserFormChange}
            />
          </Form.Group>

          {/* Teacher-Specific Fields */}
          {userForm.role === 'teacher' && (
            <>
              <hr />
              <h5>Teacher Information</h5>
              
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="ratePerHour">
                    <Form.Label>Rate per Hour ($)</Form.Label>
                    <Form.Control 
                      type="number" 
                      min="0"
                      step="0.01"
                      placeholder="Enter hourly rate" 
                      name="ratePerHour"
                      value={userForm.ratePerHour}
                      onChange={handleUserFormChange}
                      required
                    />
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
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col>
                  <Form.Group controlId="subjects">
                    <Form.Label>Subjects to Teach</Form.Label>
                    <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ced4da', padding: '10px', borderRadius: '4px' }}>
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
                </Col>
                <Col>
                  <Form.Group controlId="classrooms">
                    <Form.Label>Assigned Classrooms</Form.Label>
                    <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ced4da', padding: '10px', borderRadius: '4px' }}>
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
                </Col>
              </Row>
            </>
          )}
          
          {/* Student-Specific Fields */}
          {userForm.role === 'student' && (
            <>
              <hr />
              <h5>Student Information</h5>
              
              <Form.Group controlId="classroom" className="mb-3">
                <Form.Label>Assigned Class</Form.Label>
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
                
                {userForm.paymentStyle === 'monthly' && (
                  <Col>
                    <Form.Group controlId="paymentPeriod">
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
                  </Col>
                )}
                
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
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={resetFormAndClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save User'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserFormModal; 