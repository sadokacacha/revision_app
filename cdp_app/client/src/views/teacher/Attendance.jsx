import { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { useStateContext } from '../../contexts/ContextsProvider';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStateContext();

  useEffect(() => {
    loadTodayAttendance();
  }, []);

  const loadTodayAttendance = async () => {
    try {
      const data = await attendanceService.getTodayAttendance();
      setAttendance(data);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      await attendanceService.markAttendance({
        student_id: studentId,
        status: status,
        teacher_id: user.id
      });
      await loadTodayAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="card animated fadeInDown">
      <h1>Today's Attendance</h1>
      <div className="attendance-container">
        {attendance.length === 0 ? (
          <p>No classes scheduled for today.</p>
        ) : (
          attendance.map((session) => (
            <div key={session.id} className="attendance-session">
              <h3>{session.subject_name}</h3>
              <p>Class: {session.classroom_name}</p>
              <p>Time: {session.start_time} - {session.end_time}</p>
              <div className="students-list">
                {session.students.map((student) => (
                  <div key={student.id} className="student-attendance">
                    <span>{student.name}</span>
                    <div className="attendance-actions">
                      <button
                        onClick={() => markAttendance(student.id, 'present')}
                        className={`btn ${student.status === 'present' ? 'btn-success' : ''}`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => markAttendance(student.id, 'absent')}
                        className={`btn ${student.status === 'absent' ? 'btn-danger' : ''}`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 