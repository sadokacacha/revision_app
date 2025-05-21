import React, { useState, useEffect } from "react";
import { Card, Table, Row, Col, Button, Form, Badge, Tabs, Tab } from "react-bootstrap";
import axiosClient from "../../../axios-client";

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateRange: 'all',
    search: ''
  });

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/payments', { params: filters });
      setPayments(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status) => {
    const variants = {
      paid: 'success',
      pending: 'warning',
      overdue: 'danger',
      cancelled: 'secondary'
    };
    return <Badge bg={variants[status] || 'primary'}>{status}</Badge>;
  };

  const getPaymentType = (payment) => {
    return payment.type === 'salary' ? 'Teacher Salary' : 'Student Fee';
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

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Payments Management</h2>

      <Card className="mb-4">
        <Card.Body>
          <Tabs defaultActiveKey="all" className="mb-3">
            <Tab eventKey="all" title="All Payments">
              <Row className="mb-4">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Payment Type</Form.Label>
                    <Form.Select
                      name="type"
                      value={filters.type}
                      onChange={handleFilterChange}
                    >
                      <option value="all">All Types</option>
                      <option value="salary">Teacher Salaries</option>
                      <option value="fee">Student Fees</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                    >
                      <option value="all">All Status</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Date Range</Form.Label>
                    <Form.Select
                      name="dateRange"
                      value={filters.dateRange}
                      onChange={handleFilterChange}
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Search</Form.Label>
                    <Form.Control
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Search payments..."
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Table responsive hover>
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id}>
                      <td>{new Date(payment.date).toLocaleDateString()}</td>
                      <td>{getPaymentType(payment)}</td>
                      <td>{payment.user?.name || 'N/A'}</td>
                      <td>${payment.amount}</td>
                      <td>{payment.method}</td>
                      <td>{getStatusBadge(payment.status)}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2">
                          View
                        </Button>
                        {payment.status === 'pending' && (
                          <Button variant="outline-success" size="sm">
                            Mark Paid
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Tab>
            <Tab eventKey="reports" title="Payment Reports">
              <Row className="mt-4">
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h5>Payment Summary</h5>
                      <p>Total Payments: ${payments.reduce((sum, p) => sum + p.amount, 0)}</p>
                      <p>Pending Payments: ${payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)}</p>
                      <p>Overdue Payments: ${payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <h5>Payment Methods</h5>
                      <p>Bank Transfer: {payments.filter(p => p.method === 'bank').length}</p>
                      <p>Cash: {payments.filter(p => p.method === 'cash').length}</p>
                      <p>Check: {payments.filter(p => p.method === 'check').length}</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PaymentsPage; 