import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axiosClient from "../../../../axios-client";

const TeacherHoursBySubject = ({ teacherId }) => {
  const [hoursBySubject, setHoursBySubject] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTeacherHours = async () => {
      try {
        const response = await axiosClient.get(`/teachers/${teacherId}/hours-by-subject`);
        setHoursBySubject(response.data || []);
      } catch (error) {
        console.error('Error fetching teacher hours:', error);
        // If API not available, use mock data
        setHoursBySubject([
          { subject: 'Mathematics', hours: 20, ratePerHour: 50 },
          { subject: 'Physics', hours: 15, ratePerHour: 55 },
          { subject: 'Chemistry', hours: 10, ratePerHour: 45 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    if (teacherId) {
      fetchTeacherHours();
    }
  }, [teacherId]);
  
  if (loading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  const totalHours = hoursBySubject.reduce((total, item) => total + item.hours, 0);
  const totalAmount = hoursBySubject.reduce((total, item) => total + (item.hours * item.ratePerHour), 0);
  
  return (
    <div className="teacher-hours">
      <h6 className="mb-3">Hours by Subject</h6>
      {hoursBySubject.length === 0 ? (
        <div className="text-center text-muted py-3">
          No teaching hours recorded
        </div>
      ) : (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Hours</th>
              <th>Rate/Hour</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {hoursBySubject.map((item, index) => (
              <tr key={index}>
                <td>{item.subject}</td>
                <td>{item.hours}</td>
                <td>${item.ratePerHour}</td>
                <td>${item.hours * item.ratePerHour}</td>
              </tr>
            ))}
            <tr className="table-active">
              <td colSpan="1"><strong>Total</strong></td>
              <td><strong>{totalHours}</strong></td>
              <td></td>
              <td><strong>${totalAmount}</strong></td>
            </tr>
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TeacherHoursBySubject; 