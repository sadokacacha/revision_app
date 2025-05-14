// src/components/Attendance.jsx
import { useEffect, useState } from 'react';
import axiosClient from '../../axios-client';
import './Attendance.css';

export default function Attendance({ range = 'today' }) {
  const [schedule, setSchedule]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [attendanceStatus, setStatus] = useState({});

  // 1) load schedule once range changes
  useEffect(() => {
    setLoading(true);
    setError(null);
    const endpoint =
      range === 'today'     ? '/emploi/today' :
      range === 'week'      ? '/emploi/week' :
                              '/emploi/next-week';

    axiosClient.get(endpoint)
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.schedules;
        setSchedule(list);
      })
      .catch(() => setError('Could not load schedule.'))
      .finally(() => setLoading(false));
  }, [range]);

  // 2) helper: compute decimal hours
  const computeHours = (start, end) => {
    const [h1,m1] = start.split(':').map(Number);
    const [h2,m2] = end.split(':').map(Number);
    return ((h2*60+m2) - (h1*60+m1)) / 60;
  };

  // 3) mark attendance
  const mark = (s, status) => {
    const hrs = status === 'present'
      ? computeHours(s.start_time, s.end_time)
      : 0;

    axiosClient.post('/attendance/mark', {
      schedule_id: s.id,
      teacher_id:  s.teacher.id,   // <- adjust if your shape is s.teacher.user.id
      date:        s.date,
      status,
      hours:       hrs
    })
    .then(() => {
      setStatus(st => ({ ...st, [s.id]: status }));
    })
    .catch(() => alert('Failed to mark attendance.'));
  };

  if (loading) return <p>Loading…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <table className="attendance-table">
      <thead>
        <tr>
          <th>Teacher</th><th>Class</th><th>Date</th>
          <th>Time</th><th>Status</th><th>Mark</th>
        </tr>
      </thead>
      <tbody>
        {schedule.map(s => {
          const st = attendanceStatus[s.id];
          return (
            <tr key={s.id}
                className={st==='present' ? 'present-row' : st==='absent' ? 'absent-row' : ''}>
              <td>{s.teacher.user.name}</td>
              <td>{s.classroom.name}</td>
              <td>{s.date}</td>
              <td>{s.start_time}–{s.end_time}</td>
              <td>{ st ? st.toUpperCase() : 'NOT MARKED' }</td>
              <td>
                <button
                  onClick={() => mark(s,'present')}
                  disabled={st==='present'}
                >✅</button>
                <button
                  onClick={() => mark(s,'absent')}
                  disabled={st==='absent'}
                >❌</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
