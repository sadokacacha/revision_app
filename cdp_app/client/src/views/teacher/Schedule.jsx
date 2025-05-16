import { useState, useEffect } from 'react';
import { scheduleService } from '../../services/scheduleService';
import { useStateContext } from '../../contexts/ContextsProvider';

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useStateContext();

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const data = await scheduleService.getTeacherSchedule(user.id);
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
    <div className="card animated fadeInDown">
      <h1>My Schedule</h1>
      <div className="schedule-container">
        {schedule.length === 0 ? (
          <p>No scheduled classes found.</p>
        ) : (
          schedule.map((item) => (
            <div key={item.id} className="schedule-item">
              <h3>{item.subject_name}</h3>
              <p>Class: {item.classroom_name}</p>
              <p>Time: {item.start_time} - {item.end_time}</p>
              <p>Day: {item.day}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 