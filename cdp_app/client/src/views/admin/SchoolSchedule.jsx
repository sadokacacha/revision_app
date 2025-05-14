import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import "./SchoolSchedule.css";

export default function SchoolSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [filter, setFilter] = useState({
    classroomId: "",
    teacherId: "",
    subjectId: "",
    
  });

const [newEntry, setNewEntry] = useState({
  classroom_id: "",
  teacher_id: "",
  subject_id: "",
  day: "Monday",
  start_time: "08:00",
  end_time: "09:00",
  date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
});

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const hours = Array.from({ length: 13 }, (_, i) => `${String(8 + i).padStart(2, "0")}:00`);

  useEffect(() => {
    axiosClient.get("/schedules").then((r) => setSchedule(r.data));
    axiosClient.get("/classrooms").then((r) => setClassrooms(r.data));
    axiosClient.get("/teachers").then((r) => setTeachers(r.data));
    axiosClient.get("/subjects").then((r) => setSubjects(r.data));
  }, []);

  const filtered = schedule.filter((s) => {
    return (
      (!filter.classroomId || s.classroom_id === +filter.classroomId) &&
      (!filter.teacherId || s.teacher_id === +filter.teacherId) &&
      (!filter.subject_id || s.subject_id === +filter.subjectId)
      
    );
  });

const handleAdd = (e) => {
  e.preventDefault();
  axiosClient
    .post("/schedules", {
      ...newEntry,
      classroom_id: +newEntry.classroom_id,
      teacher_id: +newEntry.teacher_id,
      subject_id: +newEntry.subject_id,
    })
    .then((res) => {
      setSchedule((prev) => [...prev, res.data]);
      setNewEntry({
        classroom_id: "",
        teacher_id: "",
        subject_id: "",
        day: "Monday",
        start_time: "08:00",
        end_time: "09:00",
      });
    })
    .catch((err) => {
      console.error("Add schedule error:", err.response?.data || err.message);
      alert("Something went wrong while adding the schedule.");
    });
};

  return (
    <div className="school-schedule">
      <h2>📅 Weekly Schedule</h2>

      {/* Filters */}
      <div className="filter-container">
        <select onChange={e => setFilter(f => ({ ...f, classroomId: e.target.value }))}>
          <option value="">All Rooms</option>
          {classrooms.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select onChange={e => setFilter(f => ({ ...f, teacherId: e.target.value }))}>
          <option value="">All Teachers</option>
          {teachers.map(t => (
            <option key={t.id} value={t.id}>{t.user.name}</option>
          ))}
        </select>

      <select
  onChange={e => setFilter(f => ({ ...f, subject_id: e.target.value }))}
>
  <option value="">All Subjects</option>
  {subjects.map(s => (
    <option key={s.id} value={s.id}>{s.name}</option>
  ))}
</select>
      </div>

      {/* Add Schedule */}
      <form className="add-schedule-form" onSubmit={handleAdd}>
        <h3>➕ Add Class to Schedule</h3>

        <select required value={newEntry.classroom_id} onChange={e => setNewEntry(n => ({ ...n, classroom_id: e.target.value }))}>
          <option value="">Select Room</option>
          {classrooms.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select required value={newEntry.teacher_id} onChange={e => setNewEntry(n => ({ ...n, teacher_id: e.target.value }))}>
          <option value="">Select Teacher</option>
          {teachers.map(t => (
            <option key={t.id} value={t.id}>{t.user.name}</option>
          ))}
        </select>

        <select required value={newEntry.subject_id} onChange={e => setNewEntry(n => ({ ...n, subject_id: e.target.value }))}>
          <option value="">Select Subject</option>
          {subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <select value={newEntry.day} onChange={e => setNewEntry(n => ({ ...n, day: e.target.value }))}>
          {days.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        <select value={newEntry.start_time} onChange={e => setNewEntry(n => ({ ...n, start_time: e.target.value }))}>
          {hours.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>

        <select value={newEntry.end_time} onChange={e => setNewEntry(n => ({ ...n, end_time: e.target.value }))}>
          {hours.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>

        <button type="submit">Add</button>
      </form>

      {/* Display Schedule */}
 <div className="schedule-list">
  {filtered.map((s) => (
    <div key={s.id} className="schedule-card">
      <strong>{s.day}</strong> | {s.start_time} - {s.end_time}
      <div>📚 {s.subject?.name || "N/A"}</div>
      <div>👨‍🏫 {s.teacher?.user?.name || "N/A"}</div>
      <div>🏫 {s.classroom?.name || "N/A"}</div>
    </div>
  ))}
</div>
    </div>
  );
}
