import React, { useState } from "react";
import { Card, Table, Form, Button, Nav, Badge, ButtonGroup, Col } from "react-bootstrap";
import { Mail, Printer, ChevronRight, CheckCircle, Circle, XCircle, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../../axios-client";

const getStatusDetails = (status) => {
  switch (status) {
    case "paid":
      return {
        variant: "success",
        icon: <CheckCircle size={16} />,
        text: "Paid",
      };
    case "pending":
      return {
        variant: "warning",
        icon: <Circle size={16} />,
        text: "Pending",
      };
    case "overdue":
      return {
        variant: "danger",
        icon: <XCircle size={16} />,
        text: "Overdue",
      };
    default:
      return {
        variant: "secondary",
        icon: <Circle size={16} />,
        text: "Unknown",
      };
  }
};

const StudentManagement = ({ 
  users, 
  payments, 
  userSearch, 
  setUserSearch, 
  activeTab, 
  setActiveTab, 
  loadingUsers, 
  loadingPayments,
  showUserForm 
}) => {
  const navigate = useNavigate();
  
  // Filter users to show only students
  const studentUsers = users.filter(user => user.role === 'student');
  
  // Ensure payments is always an array before filtering
  const paymentsArray = Array.isArray(payments) ? payments : [];
  const filteredPayments = paymentsArray.filter(p => 
    (activeTab === "all" ? true : p.status === activeTab) && p.role === "student"
  );
  
  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const handlePrintReceipt = async (paymentId) => {
    try {
      const response = await axiosClient.get(`/payments/${paymentId}/receipt`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Failed to generate receipt');
    }
  };
  
  const markStudentPayment = async (studentId) => {
    try {
      const student = users.find(u => u.id === studentId && u.role === 'student');
      if (!student) return;
      
      // Get payment details based on student's payment style
      const paymentData = {
        userId: studentId,
        date: new Date().toISOString().split('T')[0], // Today
        status: 'paid',
        method: student.paymentMethod || 'bank',
      };
      
      // Variables for period tracking
      let semesterPayments, monthlyPayments, totalMonths;
      
      // Calculate amount and period based on payment style
      switch (student.paymentStyle) {
        case 'semester':
          paymentData.amount = student.semesterFee || 1500;
          // Check if this is first or second semester payment
          semesterPayments = paymentsArray.filter(p => 
            p.userId === studentId && p.paymentStyle === 'semester'
          ).length;
          paymentData.period = `Semester ${semesterPayments + 1}/2`;
          break;
          
        case 'full':
          paymentData.amount = student.fullYearFee || 2800;
          paymentData.period = 'Full Year';
          break;
          
        case 'monthly':
        default:
          paymentData.amount = student.monthlyFee || 300;
          // Check which month payment this is
          monthlyPayments = paymentsArray.filter(p => 
            p.userId === studentId && p.paymentStyle === 'monthly'
          ).length;
          totalMonths = student.paymentPeriod || 9;
          paymentData.period = `Month ${monthlyPayments + 1}/${totalMonths}`;
          break;
      }
      
      // Add payment style to data
      paymentData.paymentStyle = student.paymentStyle || 'monthly';
      
      // Send payment record
      const response = await axiosClient.post(`/users/${studentId}/payments`, paymentData);
      
      // Add the new payment to the list (would normally happen via a re-fetch)
      const updatedPayments = [...paymentsArray, response.data];
      
      alert('Payment recorded successfully!');
      return updatedPayments;
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Failed to record payment.');
      return paymentsArray;
    }
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h4 className="text-center mb-3">Student Management</h4>
        <Col md="auto" className="d-flex justify-content-center">
          <Button
            id="color"
            className="mb-3"
            variant="primary"
            onClick={showUserForm}
          >
            Add Student
          </Button>
        </Col>
        
        <div className="mb-3">
          <Form.Control
            placeholder="Search students..."
            className="form-control-sm"
            style={{ width: "100%" }}
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
        </div>

        <h5 className="mb-3">Students</h5>
        {loadingUsers ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Table responsive bordered hover className="mb-4">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Class</th>
                <th>Payment Style</th>
                <th>Payment Method</th>
                <th>Last Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentUsers.length > 0 ? (
                studentUsers
                  .filter(student => student.name?.toLowerCase().includes(userSearch.toLowerCase()))
                  .map((student) => {
                    const lastPayment = paymentsArray
                      .filter(p => p.userId === student.id)
                      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                    
                    const statusDetails = getStatusDetails(lastPayment?.status || 'pending');
                    
                    return (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{Array.isArray(student.classes) ? student.classes.join(", ") : student.classes}</td>
                        <td>{student.paymentStyle || 'monthly'}</td>
                        <td>{student.paymentMethod || 'bank'}</td>
                        <td>{lastPayment ? new Date(lastPayment.date).toLocaleDateString() : 'No payments'}</td>
                        <td>
                          <Badge bg={statusDetails.variant}>
                            {statusDetails.icon} {statusDetails.text}
                          </Badge>
                        </td>
                        <td className="d-flex gap-2 justify-content-center">
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => markStudentPayment(student.id)}
                          >
                            Record Payment
                          </Button>
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleViewUser(student.id)}
                          >
                            <ChevronRight size={18} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        <h5 className="mb-3">Payment Records</h5>
        <Nav className="mb-3">
          <Nav.Item>
            <Nav.Link
              active={activeTab === "all"}
              onClick={() => setActiveTab("all")}
            >
              All
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === "paid"}
              onClick={() => setActiveTab("paid")}
            >
              Paid
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === "pending"}
              onClick={() => setActiveTab("pending")}
            >
              Pending
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={activeTab === "overdue"}
              onClick={() => setActiveTab("overdue")}
            >
              Overdue
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {loadingPayments ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Table responsive bordered hover>
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Payment Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => {
                  const student = studentUsers.find(s => s.id === payment.userId);
                  const statusDetails = getStatusDetails(payment.status);
                  
                  return (
                    <tr key={payment.id}>
                      <td>{student?.name || 'Unknown'}</td>
                      <td>${payment.amount}</td>
                      <td>{payment.method}</td>
                      <td>{payment.paymentStyle}</td>
                      <td>{new Date(payment.date).toLocaleDateString()}</td>
                      <td>
                        <Badge bg={statusDetails.variant}>
                          {statusDetails.icon} {statusDetails.text}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handlePrintReceipt(payment.id)}
                        >
                          <Receipt size={16} /> Receipt
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No payment records found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default StudentManagement; 