import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import { BsCreditCard2Front, BsCalendar2Date } from "react-icons/bs";

function StudentDashboard() {
  const payments = [
    { id: "INV-2025-01", amount: 1200, status: "Paid", due: "2025-01-05", paid: "2025-01-05" },
    { id: "INV-2025-02", amount: 1200, status: "Paid", due: "2025-02-05", paid: "2025-02-04" },
    { id: "INV-2025-03", amount: 1200, status: "Paid", due: "2025-03-05", paid: "2025-03-03" },
  ];

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const nextPayment = { amount: 1200, due: "2025-04-05", daysLeft: 16 };

  const paymentData = {
    totalPaid,
    nextPayment: "2025-04-05",
    lastPayment: "2025-06-05",
    payments,
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Student Dashboard</h2>
      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary-subtle rounded-circle p-3 me-3">
                  <BsCreditCard2Front className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-muted mb-0">Total Paid</p>
                  <h3 className="mb-0">${paymentData.totalPaid}</h3>
                </div>
              </div>
              <p className="text-muted small mb-0">For the current academic year</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success-subtle rounded-circle p-3 me-3">
                  <BsCalendar2Date className="text-success" size={24} />
                </div>
                <div>
                  <p className="text-muted mb-0">Next Payment</p>
                  <h3 className="mb-0">April 5, 2025</h3>
                </div>
              </div>
              <p className="text-muted small mb-0">Due in {nextPayment.daysLeft} days</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-danger-subtle rounded-circle p-3 me-3">
                  <BsCalendar2Date className="text-danger" size={24} />
                </div>
                <div>
                  <p className="text-muted mb-0">Last Payment</p>
                  <h3 className="mb-0">Jun 5, 2025</h3>
                </div>
              </div>
              <p className="text-muted small mb-0">Completed</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <div className="mb-3">
            <strong>Payment method:</strong>{" "}
            <Button variant="secondary" size="sm" disabled>
              Semester
            </Button>{" "}
            <Button variant="outline-secondary" size="sm">
              Month
            </Button>
          </div>

          <div className="d-flex justify-content-between mb-4">
            {paymentData.payments.map((p, i) => (
              <div key={i} className="text-center">
                <div
                  className="bgcolor rounded-circle mx-auto d-flex align-items-center justify-content-center"
                  style={{ width: "30px", height: "30px" }}
                >
                  <i className="text-white bi-record-circle-fill"></i>
                </div>
                <small>${p.amount}</small>
                <br />
                <small>{p.due}</small>
              </div>
            ))}
          </div>

          <div className="bg-light p-3 rounded">
            <h5>Upcoming Payment</h5>
            <p>
              Your next payment of <strong>${nextPayment.amount}</strong> is due
              on <strong>{nextPayment.due}</strong>.
            </p>
            <ProgressBar
              now={100 - (nextPayment.daysLeft / 30) * 100}
              label={`${nextPayment.daysLeft} days`}
              className="mb-2"
            />
            <small className="text-danger">
              If there is an error please consider contacting the administration
            </small>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <h5>Payment History</h5>
            <div>
              <Button variant="outline-secondary" size="sm" className="me-2">
                This Year
              </Button>
              <Button id="color" variant="outline-primary" size="sm">
                Export
              </Button>
            </div>
          </div>

          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Payment Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={i}>
                  <td>{p.id}</td>
                  <td>${p.amount.toFixed(2)}</td>
                  <td>
                    <Badge bg="success">{p.status}</Badge>
                  </td>
                  <td>{p.due}</td>
                  <td>{p.paid}</td>
                  <td>
                    <Button variant="link" size="sm">
                      View Receipt
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default StudentDashboard;
