import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Card } from "react-bootstrap";
import axiosClient from "../../../../axios-client";

const EditUserModal = ({ 
  showModal, 
  setShowModal, 
  user,
  onUserUpdated,
  availableClassrooms,
  availableSubjects
}) => {
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    status: user?.status || 'active',
    notes: user?.notes || '',
    // Teacher specific fields
    ratePerHour: user?.ratePerHour || user?.hourly_rate || '',
    paymentMethod: user?.paymentMethod || user?.payment_method || 'bank',
    paymentPlan: user?.paymentPlan || user?.payment_plan || 'monthly',
    subjects: user?.subjects?.map(s => s.id) || [],
    classrooms: user?.classrooms?.map(c => c.id) || [],
    // Student specific fields
    classroom: user?.classroom || user?.classroom_id || '',
    paymentStyle: user?.paymentStyle || user?.payment_style || 'monthly',
    paymentPeriod: user?.paymentPeriod || user?.payment_period || '9'
  });
  
  const handleEditFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle multi-select checkboxes (subjects, classrooms)
      if (name === 'subjects') {
        const updatedSubjects = checked 
          ? [...editForm.subjects, parseInt(value)]
          : editForm.subjects.filter(id => id !== parseInt(value));
        
        setEditForm(prev => ({ ...prev, subjects: updatedSubjects }));
      } else if (name === 'classrooms') {
        const updatedClassrooms = checked 
          ? [...editForm.classrooms, parseInt(value)]
          : editForm.classrooms.filter(id => id !== parseInt(value));
        
        setEditForm(prev => ({ ...prev, classrooms: updatedClassrooms }));
      }
    } else {
      // Handle regular inputs
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Prepare data based on role
      const userData = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        status: editForm.status,
        notes: editForm.notes
      };
      
      // Add role-specific data
      if (user.role === 'teacher') {
        userData.teacherData = {
          hourly_rate: parseFloat(editForm.ratePerHour) || 0,
          payment_method: editForm.paymentMethod,
          payment_plan: editForm.paymentPlan,
          subjects: editForm.subjects,
          classrooms: editForm.classrooms
        };
      } else if (user.role === 'student') {
        userData.studentData = {
          classroom: editForm.classroom,
          payment_style: editForm.paymentStyle,
          payment_period: parseInt(editForm.paymentPeriod) || 9,
          payment_method: editForm.paymentMethod
        };
      }
      
      // Make API call to update user
      const response = await axiosClient.put(`/users/${user.id}`, userData);
      
      // Close modal
      setShowModal(false);
      
      // Notify parent component
      if (onUserUpdated && typeof onUserUpdated === 'function') {
        onUserUpdated(response.data);
      }
      
    } catch (error) {
      console.error('Error updating user:', error);
      
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          alert(`Failed to update user: ${error.response.data.message}`);
        } else if (error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
          alert(`Validation errors:\n${errorMessages}`);
        } else {
          alert(`Failed to update user (${error.response.status})`);
        }
      } else {
        alert('Failed to update user. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleEditSubmit}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">Basic Information</h5>
              
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="name">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditFormChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditFormChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={editForm.address}
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="status" className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditFormChange}
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
                  value={editForm.notes}
                  onChange={handleEditFormChange}
                />
              </Form.Group>
            </Card.Body>
          </Card>
          
          {user?.role === 'teacher' && (
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
                        value={editForm.ratePerHour}
                        onChange={handleEditFormChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="paymentPlan">
                      <Form.Label>Payment Plan</Form.Label>
                      <Form.Select
                        name="paymentPlan"
                        value={editForm.paymentPlan}
                        onChange={handleEditFormChange}
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
                    value={editForm.paymentMethod}
                    onChange={handleEditFormChange}
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
                        checked={editForm.subjects.includes(subject.id)}
                        onChange={handleEditFormChange}
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
                        checked={editForm.classrooms.includes(classroom.id)}
                        onChange={handleEditFormChange}
                      />
                    ))}
                  </div>
                </Form.Group>
              </Card.Body>
            </Card>
          )}
          
          {user?.role === 'student' && (
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Student Information</h5>
                
                <Form.Group controlId="classroom" className="mb-3">
                  <Form.Label>Classroom</Form.Label>
                  <Form.Select
                    name="classroom"
                    value={editForm.classroom}
                    onChange={handleEditFormChange}
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
                        value={editForm.paymentStyle}
                        onChange={handleEditFormChange}
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
                        value={editForm.paymentMethod}
                        onChange={handleEditFormChange}
                      >
                        <option value="bank">Bank Transfer</option>
                        <option value="cash">Cash</option>
                        <option value="check">Check</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {editForm.paymentStyle === 'monthly' && (
                  <Form.Group controlId="paymentPeriod" className="mb-3">
                    <Form.Label>Payment Period (Months)</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="12"
                      name="paymentPeriod"
                      value={editForm.paymentPeriod}
                      onChange={handleEditFormChange}
                    />
                  </Form.Group>
                )}
              </Card.Body>
            </Card>
          )}
          
          <div className="text-end">
            <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserModal; 