import React from "react";
import { Button } from "react-bootstrap";

const UserProfile = ({ user, onEditClick, onDeleteClick }) => {
  // Default avatar or user's profile picture
  const avatarUrl = user.avatar || "/default-avatar.png";
  
  // Get payment info for students
  const getPaymentInfo = () => {
    if (!user || user.role !== 'student') return null;
    
    const paymentStyle = user.paymentStyle || 'monthly';
    const period = user.paymentPeriod || 9;
    
    let amount = 0;
    let label = '';
    
    switch (paymentStyle) {
      case 'semester':
        amount = user.semesterFee || 1500;
        label = 'Per semester (2 payments)';
        break;
      case 'full':
        amount = user.fullYearFee || 2800;
        label = 'Full year (single payment)';
        break;
      case 'monthly':
      default:
        amount = user.monthlyFee || 300;
        label = `Monthly (${period} months)`;
        break;
    }
    
    return { style: paymentStyle, amount, label, period };
  };
  
  const paymentInfo = getPaymentInfo();

  return (
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
          <button 
            className="btn btn-light btn-sm"
            onClick={onEditClick}
          >
            <i className="bi bi-pen"></i>
          </button>
          <button 
            className="btn btn-danger btn-sm"
            onClick={onDeleteClick}
          >
            <i className="bi bi-trash2"></i>
          </button>
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
      {user.role === "student" && paymentInfo && (
        <>
          <p>
            <strong>Payment Style:</strong> {paymentInfo.label}
          </p>
          <p>
            <strong>Fee:</strong> €{paymentInfo.amount}
          </p>
        </>
      )}
      <p>
        <strong>Payment Method:</strong>
      </p>
      <Button variant="outline-dark" size="sm">
        {user.paymentMethod || 'N/A'}
      </Button>
    </div>
  );
};

export default UserProfile; 