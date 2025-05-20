import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Alert, Spinner } from 'react-bootstrap';
import axiosClient from '../../../../axios-client';

export default function TeacherPaymentSummary({ teacherId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllPayments, setShowAllPayments] = useState(false);
  const [allPayments, setAllPayments] = useState([]);
  const [loadingAllPayments, setLoadingAllPayments] = useState(false);

  useEffect(() => {
    if (!teacherId) return;
    setLoading(true);
    setError(null);

    axiosClient
      .get(`/payments/teacher/${teacherId}/summary`)
      .then((response) => {
        setSummary(response.data);
      })
      .catch((err) => {
        console.error('Error fetching payment summary:', err);
        setError('Could not load payment summary.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [teacherId]);

  const handleViewAllPayments = () => {
    if (showAllPayments) {
      setShowAllPayments(false);
      return;
    }

    setLoadingAllPayments(true);
    axiosClient
      .get(`/payments/user/${teacherId}`)
      .then((response) => {
        setAllPayments(response.data.payments || []);
        setShowAllPayments(true);
      })
      .catch((err) => {
        console.error('Error fetching all payments:', err);
        setError('Could not load all payments.');
      })
      .finally(() => {
        setLoadingAllPayments(false);
      });
  };

  if (loading) {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!summary) {
    return <div className="text-center text-muted py-3">No payment information available.</div>;
  }

  const totalPaid = allPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  return (
    <div className="mb-4">
      <h5 className="mb-3">Payment Information</h5>
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <div>
              <p className="mb-1"><strong>Last Payment Date:</strong> {summary.lastPaymentDate || 'No payments yet'}</p>
              <p className="mb-1"><strong>Next Payment Date:</strong> {summary.nextPaymentDate || 'Not scheduled'}</p>
            </div>
            <div>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={handleViewAllPayments}
                disabled={loadingAllPayments}
              >
                {loadingAllPayments ? 'Loading...' : (showAllPayments ? 'Hide All Payments' : 'View All Payments')}
              </Button>
            </div>
          </div>

          <h6>Current Month Summary</h6>
          <Table bordered size="sm">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Hours</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {summary.subjectHours.map((item, index) => (
                <tr key={index}>
                  <td>{item.subject}</td>
                  <td>{item.hours}</td>
                  <td>${item.ratePerHour.toFixed(2)}</td>
                  <td>${(item.hours * item.ratePerHour).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="table-active">
                <td colSpan="3"><strong>Total for Month</strong></td>
                <td><strong>${summary.totalMonthlyPayment.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {showAllPayments && (
        <Card>
          <Card.Body>
            <h6>All Payments History</h6>
            {allPayments.length > 0 ? (
              <>
                <Table bordered size="sm">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPayments.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.date}</td>
                        <td>${parseFloat(payment.amount).toFixed(2)}</td>
                        <td>{payment.method}</td>
                        <td>{payment.status}</td>
                      </tr>
                    ))}
                    <tr className="table-active">
                      <td colSpan="1"><strong>Total Paid</strong></td>
                      <td colSpan="3"><strong>${totalPaid.toFixed(2)}</strong></td>
                    </tr>
                  </tbody>
                </Table>
              </>
            ) : (
              <div className="text-center text-muted py-2">No payment records found</div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}