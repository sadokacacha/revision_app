import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import axiosClient from "../../../../axios-client";

const EditUserModal = ({ 
  showModal, 
  setShowModal, 
  user,
  onUserUpdated
}) => {
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    ratePerHour: user?.ratePerHour || '',
    paymentStyle: user?.paymentStyle || 'monthly',
    paymentPeriod: user?.paymentPeriod || '9',
    paymentMethod: user?.paymentMethod || 'bank'
  });
  
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Make API call to update user
      const response = await axiosClient.put(`/users/${user.id}`, editForm);
      
      // Close modal
      setShowModal(false);
      
      // Notify parent component
      if (onUserUpdated && typeof onUserUpdated === 'function') {
        onUserUpdated(response.data || editForm);
      }
      
    } catch (error) {
      console.error('Error updating user:', error);
      
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          alert(`Failed to update user: ${error.response.data.message}`);
        } else if (error.response.data.errors) {
          // Handle validation errors
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
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleEditSubmit}>
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
          
          {user?.role === 'teacher' && (
            <Form.Group controlId="ratePerHour" className="mb-3">
              <Form.Label>Rate per Hour ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="ratePerHour"
                value={editForm.ratePerHour}
                onChange={handleEditFormChange}
              />
            </Form.Group>
          )}
          
          {user?.role === 'student' && (
            <>
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
                
                {editForm.paymentStyle === 'monthly' && (
                  <Col>
                    <Form.Group controlId="paymentPeriod">
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
                  </Col>
                )}
              </Row>
            </>
          )}
          
          <Form.Group controlId="paymentMethod" className="mb-3">
            <Form.Label>Payment Method</Form.Label>
            <Form.Select
              name="paymentMethod"
              value={editForm.paymentMethod}
              onChange={handleEditFormChange}
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Check">Check</option>
              <option value="N/A">N/A</option>
            </Form.Select>
          </Form.Group>
          
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