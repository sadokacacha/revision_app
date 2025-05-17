import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axiosClient from "../../../../axios-client";

const PaymentFormModal = ({ showModal, setShowModal, user, onPaymentAdded }) => {
  const [saving, setSaving] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentPeriod, setPaymentPeriod] = useState("");

  // Initialize form values based on user data
  useEffect(() => {
    if (user) {
      // Initialize payment method
      setPaymentMethod(user.paymentMethod || 'bank');
      
      // Calculate default payment amount based on payment style
      if (user.role === 'student') {
        let amount = 0;
        switch (user.paymentStyle) {
          case 'semester':
            amount = user.semesterFee || 1500;
            break;
          case 'full':
            amount = user.fullYearFee || 2800;
            break;
          case 'monthly':
          default:
            amount = user.monthlyFee || 300;
            break;
        }
        setPaymentAmount(amount.toString());
        
        // Set default payment period based on existing payments
        const existingPayments = user.payments || [];
        if (user.paymentStyle === 'monthly') {
          const monthNum = existingPayments.length + 1;
          const totalMonths = user.paymentPeriod || 9;
          setPaymentPeriod(`Month ${monthNum}/${totalMonths}`);
        } else if (user.paymentStyle === 'semester') {
          const semPayments = existingPayments.filter(p => p.paymentStyle === 'semester').length;
          setPaymentPeriod(`Semester ${semPayments + 1}/2`);
        } else {
          setPaymentPeriod('Full Year');
        }
      }
    }
  }, [user]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      console.log("Recording payment for user:", user.id, "with role:", user.role);
      
      // Create payment data
      const newPayment = {
        userId: user.id,
        date: paymentDate || new Date().toISOString().split('T')[0],
        amount: parseFloat(paymentAmount),
        status: paymentStatus || 'paid',
        method: paymentMethod,
        period: paymentPeriod,
        paymentStyle: user.role === 'student' ? user.paymentStyle : undefined
      };
      
      console.log("Payment data to be sent:", newPayment);
      
      // Make API call to save payment
      const response = await axiosClient.post(`/users/${user.id}/payments`, newPayment);
      
      console.log("Payment creation response:", response.data);
      
      // Reset form
      resetForm();
      
      // Close modal
      setShowModal(false);
      
      // Notify parent component about the new payment
      if (onPaymentAdded && typeof onPaymentAdded === 'function') {
        onPaymentAdded(response.data);
      }
      
      alert('Payment recorded successfully!');
      
    } catch (error) {
      console.error('Error creating payment:', error);
      if (error.response && error.response.data) {
        console.log("Payment error response:", error.response.data);
        if (error.response.data.message) {
          alert(`Failed to save payment: ${error.response.data.message}`);
        } else if (error.response.data.errors) {
          // Handle validation errors
          const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
          alert(`Validation errors:\n${errorMessages}`);
        } else {
          alert(`Failed to save payment (${error.response.status})`);
        }
      } else {
        alert('Failed to save payment. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };
  
  const resetForm = () => {
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setPaymentAmount("");
    setPaymentStatus("paid");
    setPaymentPeriod("");
    setPaymentMethod(user?.paymentMethod || 'bank');
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Record Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handlePaymentSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              required
            />
            {user?.role === "student" && (
              <Form.Text className="text-muted">
                Suggested amount: €{
                  user.paymentStyle === 'semester' 
                    ? (user.semesterFee || 1500) 
                    : user.paymentStyle === 'full' 
                      ? (user.fullYearFee || 2800)
                      : (user.monthlyFee || 300)
                } ({
                  user.paymentStyle === 'semester'
                    ? 'Per semester (2 payments)'
                    : user.paymentStyle === 'full'
                      ? 'Full year (single payment)'
                      : `Monthly (${user.paymentPeriod || 9} months)`
                })
              </Form.Text>
            )}
          </Form.Group>
          
          {user?.role === "student" && (
            <Form.Group className="mb-3">
              <Form.Label>Payment Period</Form.Label>
              <Form.Control
                type="text"
                placeholder={
                  user.paymentStyle === 'monthly'
                    ? `Month ${(user.payments?.length || 0) + 1}/${user.paymentPeriod || 9}`
                    : user.paymentStyle === 'semester'
                      ? `Semester ${(user.payments?.filter(p => p.paymentStyle === 'semester')?.length || 0) + 1}/2`
                      : 'Full Year'
                }
                name="period"
                value={paymentPeriod}
                onChange={(e) => setPaymentPeriod(e.target.value)}
              />
              <Form.Text className="text-muted">
                {user.paymentStyle === 'full' ? 'Single full payment' : 
                 user.paymentStyle === 'semester' ? 'First or second semester' : 
                 `Which month (1-${user.paymentPeriod || 9})`}
              </Form.Text>
            </Form.Group>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>Payment Method</Form.Label>
            <Form.Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="">Select payment method</option>
              <option value="cash">Cash</option>
              <option value="bank">Bank Transfer</option>
              <option value="check">Check</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Payment Date</Form.Label>
            <Form.Control
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              required
            >
              <option value="">Select status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </Form.Select>
          </Form.Group>
          
          <div className="text-end">
            <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Payment'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PaymentFormModal; 