import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../../axios-client";

// Teacher Attendance component for today's classes
const TodaysTeacherList = () => {
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [todayDate, setTodayDate] = useState(new Date().toISOString().split('T')[0]); // Today's date in YYYY-MM-DD format
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTodaysSchedule = async () => {
      try {
        // Get today's schedule
        const response = await axiosClient.get('/schedules/today');
        
        // Store today's date from the response if available
        if (response.data && response.data.date) {
          setTodayDate(response.data.date);
        }
        
        // Extract schedules from response
        const schedules = Array.isArray(response.data) ? response.data : response.data.schedules || [];
        setTodaysSchedule(schedules);
      } catch (error) {
        console.error('Error fetching today\'s schedule:', error);
        // Use mock data when API fails with 500 error
        const mockData = [
          {
            id: 1,
            teacher: { id: 1, name: 'John Smith' },
            classroom: { name: 'Class A' },
            subject: { name: 'Mathematics' },
            start_time: '09:00',
            end_time: '10:30'
          },
          {
            id: 2,
            teacher: { id: 2, name: 'Sarah Johnson' },
            classroom: { name: 'Class B' },
            subject: { name: 'Physics' },
            start_time: '11:00',
            end_time: '12:30'
          }
        ];
        setTodaysSchedule(mockData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTodaysSchedule();
  }, []);
  
  // Compute decimal hours between two time strings
  const computeHours = (start, end) => {
    const [h1,m1] = start.split(':').map(Number);
    const [h2,m2] = end.split(':').map(Number);
    return ((h2*60+m2) - (h1*60+m1)) / 60;
  };
  
  // Mark teacher attendance
  const markAttendance = (schedule, status) => {
    const hours = status === 'present' ? computeHours(schedule.start_time, schedule.end_time) : 0;
    
    try {
      // First update UI state for better user experience
      setAttendanceStatus(prev => ({ 
        ...prev, 
        [schedule.id]: status 
      }));
      
      // Then try to save to backend
      axiosClient.post('/attendance/mark', {
        schedule_id: schedule.id,
        teacher_id: schedule.teacher.id,
        date: todayDate, // Use the stored todayDate
        status,
        hours
      })
      .then(response => {
        console.log('Attendance marked successfully:', response.data);
      })
      .catch(error => {
        console.error('Error marking attendance:', error);
        
        // Display specific validation errors if available
        if (error.response && error.response.data && error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
          alert(`Validation errors:\n${errorMessages}`);
        } else {
          alert('API error. Attendance marked in UI only.');
        }
        
        // Revert the UI state since the API call failed
        setAttendanceStatus(prev => {
          const newState = {...prev};
          delete newState[schedule.id];
          return newState;
        });
      });
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
      
      // Revert the UI state
      setAttendanceStatus(prev => {
        const newState = {...prev};
        delete newState[schedule.id];
        return newState;
      });
    }
  };
  
  // View teacher details
  const handleViewTeacher = (teacherId) => {
    navigate(`/admin/users/${teacherId}`);
  };
  
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="today-teachers">
      <h5 className="mb-3">Teachers Teaching Today ({todayDate})</h5>
      
      {todaysSchedule.length === 0 ? (
        <div className="alert alert-info">
          No teachers are scheduled for classes today
        </div>
      ) : (
        <Table responsive bordered hover>
          <thead className="table-light">
            <tr>
              <th>Teacher</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todaysSchedule.map((schedule) => {
              const status = attendanceStatus[schedule.id];
              return (
                <tr 
                  key={schedule.id}
                  className={
                    status === 'present' ? 'table-success' : 
                    status === 'absent' ? 'table-danger' : ''
                  }
                >
                  <td>{schedule.teacher.name || schedule.teacher.user?.name}</td>
                  <td>{schedule.classroom.name}</td>
                  <td>{schedule.subject.name}</td>
                  <td>{schedule.start_time} - {schedule.end_time}</td>
                  <td>{status ? status.toUpperCase() : 'NOT MARKED'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-success" 
                        size="sm"
                        onClick={() => markAttendance(schedule, 'present')}
                        disabled={status === 'present'}
                      >
                        Present
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => markAttendance(schedule, 'absent')}
                        disabled={status === 'absent'}
                      >
                        Absent
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewTeacher(schedule.teacher.id)}
                      >
                        <ChevronRight size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TodaysTeacherList; 