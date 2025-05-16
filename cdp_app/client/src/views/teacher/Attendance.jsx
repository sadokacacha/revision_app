import React, { useState, useEffect } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import './attendance.css';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStateContext();

  useEffect(() => {
    loadTodayAttendance();
  }, []);

  const loadTodayAttendance = async () => {
    try {
      // Temporarily using mock data until the service is implemented
      const mockData = [
        {
          id: 1,
          subject_name: "Mathematics",
          classroom_name: "Class A",
          start_time: "09:00",
          end_time: "10:30",
          students: [
            { id: 1, name: "John Doe", status: "present" },
            { id: 2, name: "Jane Smith", status: "absent" },
          ]
        }
      ];
      setAttendance(mockData);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (studentId, status) => {
    try {
      // Implement the actual service call here
      console.log('Marking attendance:', { studentId, status, teacherId: user.id });
      await loadTodayAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Attendance Management</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="attendance-container">
          {attendance.length === 0 ? (
            <p>No classes scheduled for today.</p>
          ) : (
            attendance.map((session) => (
              <div key={session.id} className="attendance-session p-4 mb-4 border rounded">
                <h3 className="text-lg font-semibold mb-2">{session.subject_name}</h3>
                <p className="text-gray-600 mb-1">Class: {session.classroom_name}</p>
                <p className="text-gray-600 mb-4">Time: {session.start_time} - {session.end_time}</p>
                <div className="students-list space-y-3">
                  {session.students.map((student) => (
                    <div key={student.id} className="student-attendance flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span className="font-medium">{student.name}</span>
                      <div className="attendance-actions space-x-2">
                        <button
                          onClick={() => markAttendance(student.id, 'present')}
                          className={`px-4 py-2 rounded ${
                            student.status === 'present'
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-green-100'
                          }`}
                        >
                          Present
                        </button>
                        <button
                          onClick={() => markAttendance(student.id, 'absent')}
                          className={`px-4 py-2 rounded ${
                            student.status === 'absent'
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-red-100'
                          }`}
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
    </div>
  );
};

export default Attendance; 