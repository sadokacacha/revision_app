import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import axiosClient from "../../../../axios-client";

const TeacherScheduleView = ({ teacherId }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axiosClient.get(`/teachers/${teacherId}/schedule`);
        setSchedule(response.data);
      } catch (error) {
        console.error('Error fetching teacher schedule:', error);
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
  
  return (
    <div className="schedule-container">
      {schedule.length === 0 ? (
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
                <td>{s.subject?.name}</td>
                <td>{s.classroom?.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TeacherScheduleView; 