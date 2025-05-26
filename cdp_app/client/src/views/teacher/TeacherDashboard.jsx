import React from 'react';
import { Card, Table, Form, Container, Row, Col, Button } from 'react-bootstrap';
import { Calendar, CreditCard, Download } from 'lucide-react';

// Payments interface outside the component
// interface Payment {
//   period: string;
//   amount: number;
//   status: 'Paid' | 'Pending';
//   date: string;
//   method: string;
//   classes?: string[];
// }

const payments = [
  { period: 'November 2023', amount: 1850.0, status: 'Paid', date: '2023-11-01', method: 'Direct Deposit' },
  { period: 'October 2023', amount: 1850.0, status: 'Paid', date: '2023-10-01', method: 'Direct Deposit' },
  { period: 'September 2023', amount: 1750.0, status: 'Paid', date: '2023-09-01', method: 'Direct Deposit' },
  { period: 'August 2023', amount: 1750.0, status: 'Paid', date: '2023-08-01', method: 'Direct Deposit' },
  { period: 'July 2023', amount: 1500.0, status: 'Paid', date: '2023-07-01', method: 'Check' },
  { period: 'December 2023', amount: 1850.0, status: 'Pending', date: '2023-12-01', method: 'Direct Deposit' },
];

const totalPaid = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
const nextPayment = { date: '2025-04-05', daysLeft: 16 };
const lastPayment = { date: '2025-06-05', daysLeft: 40 };

const TeacherDashboard = () => {
  return (
    <Container fluid className="px-4 py-4 bg-light min-vh-100">
      {/* Payment Summary Cards */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                <CreditCard size={24} className="text-primary" />
              </div>
              <div>
                <div className="text-muted small">Total Paid</div>
                <h3 className="mb-0">${totalPaid.toFixed(2)}</h3>
                <div className="text-muted small">For the current academic year</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                <Calendar size={24} className="text-success" />
              </div>
              <div>
                <div className="text-muted small">Next Payment</div>
                <h3 className="mb-0">{nextPayment.date}</h3>
                <div className="text-muted small">Due in {nextPayment.daysLeft} days</div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 rounded-circle p-3 me-3">
                <Calendar size={24} className="text-danger" />
              </div>
              <div>
                <div className="text-muted small">Last Payment</div>
                <h3 className="mb-0">{lastPayment.date}</h3>
                <div className="text-muted small">Completed {lastPayment.daysLeft} days ago</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Payment Details Section */}
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="mb-1">Payment Details</h5>
              <div className="text-muted small">Monthly payment records</div>
            </div>
            <div className="d-flex gap-2">
              <Form.Control type="text" placeholder="Filter by period..." className="w-auto" />
              <Form.Select className="w-auto">
                <option>All Statuses</option>
                <option>Paid</option>
                <option>Pending</option>
              </Form.Select>
            </div>
          </div>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Period</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, idx) => (
                <tr key={idx}>
                  <td>{payment.period}</td>
                  <td>${payment.amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge bg-${payment.status === 'Paid' ? 'success' : 'warning'} bg-opacity-10 text-${payment.status === 'Paid' ? 'success' : 'warning'} px-2 py-1`}>
                      {payment.status === 'Paid' ? '✓ ' : '⌛ '}{payment.status}
                    </span>
                  </td>
                  <td>{payment.date}</td>
                  <td>{payment.method}</td>
                  <td>
                    <Button variant="link" size="sm" className="text-dark p-0">
                      <Download size={18} /> Receipt
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
};

export default TeacherDashboard;
