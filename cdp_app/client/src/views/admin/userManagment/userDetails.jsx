import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

function UserDetails({ user }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDate, setPaymentDate] = useState("");

  if (!user || !user.classes || !user.payments) {
    return (
      <div className="container my-5 text-danger">
        User data is not available.
      </div>
    );
  }

  // Default avatar or user's profile picture
  const avatarUrl = user.avatar || "/default-avatar.png";

  const calculateTotal = () => {
    if (user.role === "teacher") {
      return user.classes.reduce(
        (acc, curr) => acc + (parseFloat(curr.hours) * parseFloat(curr.ratePerHour || 0)),
        0
      );
    } else {
      return user.classes.reduce(
        (acc, curr) => acc + parseFloat(curr.price.replace(",", ".")),
        0
      );
    }
  };

  const total = calculateTotal();

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to update the payment
    const newPayment = {
      date: paymentDate,
      amount: paymentAmount,
      status: paymentStatus,
      method: paymentMethod
    };
    console.log("New payment:", newPayment);
    setShowPaymentModal(false);
  };

  return (
    <div className="container my-5">
      <h4 className="mb-4">← User Details</h4>
      <div className="row g-4">
        {/* Left panel */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <div className="text-center">
              <img
                src={avatarUrl}
                alt={`${user.name}'s profile`}
                className="rounded-circle me-2"
                width="100"
                height="100"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
              />
              <h5>{user.name}</h5>
              <p className="text-muted mb-1">{user.email}</p>
              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-light btn-sm"><i className="bi bi-pen"></i></button>
                <button className="btn btn-danger btn-sm"><i className="bi bi-trash2"></i></button>
              </div>
            </div>
            <hr />
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Address:</strong> {user.address}
            </p>
            {user.role === "teacher" && (
              <p>
                <strong>Rate per Hour:</strong> ${user.ratePerHour}
              </p>
            )}
            {user.role === "student" && (
              <p>
                <strong>Payment Schedule:</strong> {user.paymentSchedule}
              </p>
            )}
            <p>
              <strong>Payment Type:</strong>
            </p>
            <button className="btn btn-outline-dark btn-sm">
              {user.paymentType}
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div className="col-md-8">
          {/* Classes */}
          <div className="card p-3 shadow-sm mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6>{user.role === "teacher" ? "Teaching Schedule" : "Classes"}</h6>
              <div>
                <button 
                  className="btn bgcolor btn-sm me-2"
                  onClick={() => setShowPaymentModal(true)}
                >
                  {user.role === "teacher" ? "Add Payment" : "Record Payment"}
                </button>
                <button className="btn btn-secondary btn-sm me-2">Edit</button>
                <button className="btn btn-danger btn-sm">Delete</button>
              </div>
            </div>
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Modules</th>
                  <th>Number of Hours</th>
                  <th>Schedule</th>
                  {user.role === "teacher" ? (
                    <th>Rate per Hour</th>
                  ) : (
                    <th>Prices</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {user.classes.map((cls, idx) => (
                  <tr key={idx}>
                    <td>{cls.module}</td>
                    <td>{cls.hours}</td>
                    <td>{cls.schedule}</td>
                    <td>
                      {user.role === "teacher" 
                        ? `$${cls.ratePerHour}/hr`
                        : `${cls.price} ${cls.selected && <span className="text-warning">✔</span>}`
                      }
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" className="text-end">
                    <strong>Total</strong>
                  </td>
                  <td>
                    <strong>${total.toFixed(2)}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment History */}
          <div className="card p-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="text-success">Payment History</h6>
              <div>
                <button className="btn btn-secondary btn-sm me-2">Edit</button>
                <button className="btn btn-danger btn-sm">Delete</button>
              </div>
            </div>
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {user.payments.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.date}</td>
                    <td>${p.amount}</td>
                    <td>{p.method}</td>
                    <td>
                      <span className={`badge bg-${p.status === 'paid' ? 'success' : 'warning'} text-capitalize`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
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
            </Form.Group>
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
              <Button variant="secondary" className="me-2" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Payment
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserDetails;
