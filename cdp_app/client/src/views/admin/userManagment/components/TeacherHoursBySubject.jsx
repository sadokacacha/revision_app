import React, { useState, useEffect } from 'react';
import { Table, Card, Alert, Spinner } from 'react-bootstrap';
import axiosClient from '../../../../axios-client';

const TeacherHoursBySubject = ({ teacherId }) => {
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHours = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get(`/teachers/${teacherId}/hours-by-subject`);
        if (response.data) {
          setHours(response.data);
        }
      } catch (err) {
        console.error('Error fetching hours:', err);
        setError(err.response?.data?.message || 'Failed to load teacher hours');
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchHours();
    }
  }, [teacherId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        {error}
      </Alert>
    );
  }

  if (!hours.length) {
    return (
      <Alert variant="info" className="m-3">
        No hours recorded for this teacher.
      </Alert>
    );
  }

  return (
    <Card>
      <Card.Body>
        <h5 className="mb-3">Hours by Subject</h5>
        <Table responsive hover>
          <thead className="table-light">
            <tr>
              <th>Subject</th>
              <th>Hours</th>
              <th>Rate/Hour</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {hours.map((record) => (
              <tr key={record.subject}>
                <td>{record.subject}</td>
                <td>{record.hours}</td>
                <td>${record.ratePerHour}</td>
                <td>${record.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default TeacherHoursBySubject;
