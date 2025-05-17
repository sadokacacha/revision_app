// src/components/Attendance.jsx
import { useEffect, useState } from 'react';
import { Card, Table, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import { CheckCircle, XCircle, DollarSign } from 'lucide-react';
import axiosClient from '../../../axios-client';

export default function Attendance({ range = 'today' }) {
  const [schedule, setSchedule] = useState([]);
  const [teachers, setTeachers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceStatus, setStatus] = useState({});
  const [paymentInfo, setPaymentInfo] = useState({});

  // Load schedule and teacher information
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Fetch today's schedule
    axiosClient.get('/schedules/today')
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.schedules || [];
        setSchedule(list);
        
        // Extract unique teacher IDs
        const teacherIds = [...new Set(list.map(s => s.teacher_id))];
        
        // Fetch details for each teacher
        return Promise.all(
          teacherIds.map(id => axiosClient.get(`/teachers/${id}`))
        );
      })
      .then((teacherResponses) => {
        // Create a mapping of teacher IDs to their details
        const teacherMap = {};
        teacherResponses.forEach(response => {
          const teacher = response.data;
          teacherMap[teacher.id] = teacher;
        });
        setTeachers(teacherMap);
      })
      .catch((err) => {
        console.error('Error loading schedule or teachers:', err);
        setError('Could not load schedule data.');
        
        // Mock data for development
        setSchedule([
          {
            id: 1,
            teacher_id: 1,
            teacher: { 
              id: 1, 
              user: { id: 101, name: 'John Smith' },
              hourly_rate: 50 
            },
            classroom: { id: 1, name: 'Class A' },
            subject: { id: 1, name: 'Mathematics' },
            date: new Date().toISOString().split('T')[0],
            start_time: '09:00',
            end_time: '10:30'
          },
          {
            id: 2,
            teacher_id: 2,
            teacher: { 
              id: 2, 
              user: { id: 102, name: 'Sarah Johnson' },
              hourly_rate: 45 
            },
            classroom: { id: 2, name: 'Class B' },
            subject: { id: 2, name: 'Physics' },
            date: new Date().toISOString().split('T')[0],
            start_time: '11:00',
            end_time: '12:30'
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, [range]);

  // Calculate decimal hours from time range
  const computeHours = (start, end) => {
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    return ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
  };

  // Calculate payment amount based on hours and hourly rate
  const calculatePayment = (scheduleItem, status) => {
    if (status !== 'present') return 0;
    
    const hours = computeHours(scheduleItem.start_time, scheduleItem.end_time);
    const hourlyRate = scheduleItem.teacher?.hourly_rate || 
      teachers[scheduleItem.teacher_id]?.hourly_rate || 0;
      
    return hours * hourlyRate;
  };

  // Mark teacher attendance
  const markAttendance = (scheduleItem, status) => {
    const hours = status === 'present'
      ? computeHours(scheduleItem.start_time, scheduleItem.end_time)
      : 0;
    
    // Calculate payment amount
    const paymentAmount = calculatePayment(scheduleItem, status);
    
    // Update UI immediately for better user experience
    setStatus(prev => ({ ...prev, [scheduleItem.id]: status }));
    setPaymentInfo(prev => ({ 
      ...prev, 
      [scheduleItem.id]: {
        hours,
        amount: paymentAmount,
        date: scheduleItem.date || new Date().toISOString().split('T')[0]
      }
    }));
    
    // Send attendance record to backend
    axiosClient.post('/attendance/mark', {
      schedule_id: scheduleItem.id,
      teacher_id: scheduleItem.teacher_id || scheduleItem.teacher.id,
      date: scheduleItem.date || new Date().toISOString().split('T')[0],
      status,
      hours
    })
    .then(() => {
      // If successful and present, also record payment
      if (status === 'present') {
        return axiosClient.post(`/payments`, {
          user_id: scheduleItem.teacher.user_id || scheduleItem.teacher.user.id,
          type: 'teacher',
          method: scheduleItem.teacher.payment_method || 'bank',
          amount: paymentAmount,
          date: scheduleItem.date || new Date().toISOString().split('T')[0],
          status: 'pending',
          description: `Payment for ${scheduleItem.subject?.name} class on ${scheduleItem.date}`
        });
      }
    })
    .catch((error) => {
      console.error('Failed to mark attendance:', error);
      // Revert UI changes on error
      setStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[scheduleItem.id];
        return newStatus;
      });
      setPaymentInfo(prev => {
        const newInfo = { ...prev };
        delete newInfo[scheduleItem.id];
        return newInfo;
      });
      alert('Failed to mark attendance. Please try again.');
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading teacher schedule...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h4 className="mb-0">Teacher Attendance - Today</h4>
      </Card.Header>
      <Card.Body>
        {schedule.length === 0 ? (
          <Alert variant="info">
            No classes scheduled for today.
          </Alert>
        ) : (
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Time</th>
                <th>Hours</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map(item => {
                const status = attendanceStatus[item.id];
                const paymentData = paymentInfo[item.id];
                const hours = paymentData?.hours || 
                  (status === 'present' ? 
                    computeHours(item.start_time, item.end_time) : 0);
                const hourlyRate = item.teacher?.hourly_rate || 
                  teachers[item.teacher_id]?.hourly_rate || 0;
                const payment = paymentData?.amount || 
                  (status === 'present' ? hours * hourlyRate : 0);
                
                return (
                  <tr 
                    key={item.id}
                    className={
                      status === 'present' ? 'table-success' : 
                      status === 'absent' ? 'table-danger' : ''
                    }
                  >
                    <td>{item.teacher?.user?.name || 'Unknown Teacher'}</td>
                    <td>{item.classroom?.name || 'Unknown Class'}</td>
                    <td>{item.subject?.name || 'Unknown Subject'}</td>
                    <td>{item.start_time} - {item.end_time}</td>
                    <td>{status === 'present' ? hours.toFixed(2) : '0.00'}</td>
                    <td>
                      {status === 'present' ? (
                        <span className="d-flex align-items-center">
                          <DollarSign size={16} className="me-1" />
                          {payment.toFixed(2)}
                        </span>
                      ) : '0.00'}
                    </td>
                    <td>
                      {status ? (
                        <Badge bg={status === 'present' ? 'success' : 'danger'}>
                          {status.toUpperCase()}
                        </Badge>
                      ) : (
                        <Badge bg="secondary">NOT MARKED</Badge>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-success"
                          size="sm"
                          onClick={() => markAttendance(item, 'present')}
                          disabled={status === 'present'}
                        >
                          <CheckCircle size={16} className="me-1" />
                          Present
                        </Button>
                        <Button 
                          variant="outline-danger"
                          size="sm"
                          onClick={() => markAttendance(item, 'absent')}
                          disabled={status === 'absent'}
                        >
                          <XCircle size={16} className="me-1" />
                          Absent
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
