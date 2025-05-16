import React from 'react';
import { useState, useEffect } from 'react';
import { scheduleService } from '../../services/scheduleService';
import { useStateContext } from '../../contexts/ContextProvider';

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStateContext();

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      // For students, we get the schedule by their classroom ID
      const data = await scheduleService.getClassroomSchedule(user.classroom_id);
      setSchedule(data);
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Schedule</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="schedule-container">
          {schedule.length === 0 ? (
            <p>No scheduled classes found.</p>
          ) : (
            schedule.map((item) => (
              <div key={item.id} className="schedule-item">
                <h3>{item.subject_name}</h3>
                <p>Teacher: {item.teacher_name}</p>
                <p>Time: {item.start_time} - {item.end_time}</p>
                <p>Day: {item.day}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule; 