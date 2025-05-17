import React from "react";
import { Table, Badge, Button } from "react-bootstrap";

const PaymentsList = ({ payments, user }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="text-center text-muted py-3">
        No payment records found
      </div>
    );
  }

  return (
    <Table responsive bordered hover>
      <thead className="table-light">
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Method</th>
          <th>Status</th>
          {user?.role === 'student' && <th>Period</th>}
        </tr>
      </thead>
      <tbody>
        {payments.map((payment, idx) => (
          <tr key={payment.id || idx}>
            <td>{payment.date}</td>
            <td>€{payment.amount}</td>
            <td>{payment.method}</td>
            <td>
              <Badge bg={payment.status === 'paid' ? 'success' : 'warning'}>
                {payment.status}
              </Badge>
            </td>
            {user?.role === 'student' && (
              <td>
                {payment.period || 
                  (user.paymentStyle === 'monthly' 
                    ? `Month ${idx + 1}/${user.paymentPeriod || 9}` 
                    : user.paymentStyle === 'semester' 
                      ? `Semester ${idx + 1}/2` 
                      : 'Full year')
                }
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PaymentsList; 