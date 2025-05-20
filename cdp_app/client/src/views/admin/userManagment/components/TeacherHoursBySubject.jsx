import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import axiosClient from '../../../../axios-client';

export default function TeacherHoursBySubject({ teacherId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!teacherId) return;
    setLoading(true);
    setError(null);

    axiosClient
    .get(`/teachers/${teacherId}/hours-by-subject`)   
       .then((response) => {
        setData(Array.isArray(response.data) ? response.data : []);
      })
      .catch((err) => {
        console.error('Error fetching hours:', err);
        setError('Could not load teaching hours.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [teacherId]);

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
  if (data.length === 0) {
    return <div className="text-center text-muted py-3">No hours recorded.</div>;
  }

  const totalHours = data.reduce((sum, r) => sum + r.hours, 0);
  const totalEarnings = data.reduce((sum, r) => sum + r.hours * r.ratePerHour, 0);

  return (
    <>
      <Table bordered hover size="sm">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Hours</th>
            <th>Rate</th>
            <th>Earnings</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.subject}</td>
              <td>{row.hours}</td>
              <td>${row.ratePerHour.toFixed(2)}</td>
              <td>${(row.hours * row.ratePerHour).toFixed(2)}</td>
            </tr>
          ))}
          <tr className="table-active">
            <td><strong>Total</strong></td>
            <td><strong>{totalHours}</strong></td>
            <td></td>
            <td><strong>${totalEarnings.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}
