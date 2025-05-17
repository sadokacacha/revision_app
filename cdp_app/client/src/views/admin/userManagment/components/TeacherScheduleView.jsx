import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axiosClient from "../../../../axios-client";

const TeacherScheduleView = ({ teacherId }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!teacherId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axiosClient.get(`/teachers/${teacherId}/schedule`);
        if (Array.isArray(response.data)) {
          setSchedule(response.data);
        } else {
          console.warn('Invalid schedule data format:', response.data);
          setSchedule([]);
        }
      } catch (error) {
        console.error('Error fetching teacher schedule:', error);
        setError('Failed to load schedule data');
      } finally {
        setLoading(false);
      }
    };
    
    if (teacherId) {
      fetchSchedule();
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
  
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }
  
  return (
    <div className="schedule-container">
      {(!Array.isArray(schedule) || schedule.length === 0) ? (
        <div className="text-center text-muted py-3">
          No schedule information available
        </div>
      ) : (
        <Table responsive bordered hover>
          <thead>
            <tr>
              <th>Day</th>
              <th>Time</th>
              <th>Subject</th>
              <th>Classroom</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((s, index) => (
              <tr key={index}>
                <td>{s.day}</td>
                <td>{s.start_time} - {s.end_time}</td>
                <td>{s.subject?.name || 'Not specified'}</td>
                <td>{s.classroom?.name || 'Not specified'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TeacherScheduleView; 