import { useEffect, useState } from "react";
import { Row, Col, Card, Table, Button, Form } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosClient from "../../../axios-client";

export default function SchoolSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
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

  // Get Monday and Sunday of the current week
  const getWeekBounds = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(date);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    
    return { monday, sunday };
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(nextWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  // Get formatted week display
  const getWeekDisplay = () => {
    const { monday, sunday } = getWeekBounds(currentWeek);
    return `${monday.toLocaleDateString()} - ${sunday.toLocaleDateString()}`;
  };

  // Fetch schedule data when component mounts or week changes
  useEffect(() => {
    const { monday, sunday } = getWeekBounds(currentWeek);
    const fromDate = formatDate(monday);
    const toDate = formatDate(sunday);
    
    setLoading(true);
    
    // Fetch schedule for the selected week
    axiosClient.get(`/schedules/period?from=${fromDate}&to=${toDate}`)
      .then((response) => {
        setSchedule(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching schedule:", error);
        // Use mock data if API fails
        const mockData = [];
        for (let i = 0; i < 5; i++) {
          mockData.push({
            id: i + 1,
            day: days[i],
            start_time: "09:00",
            end_time: "10:30",
            teacher: { user: { name: "Sample Teacher" } },
            classroom: { name: "Sample Classroom" },
            subject: { name: "Sample Subject" }
          });
        }
        setSchedule(mockData);
        setLoading(false);
      });
    
    // Fetch other data if not already loaded
    if (classrooms.length === 0) {
      axiosClient.get("/classrooms").then((r) => setClassrooms(r.data));
    }
    
    if (teachers.length === 0) {
      axiosClient.get("/teachers").then((r) => setTeachers(r.data));
    }
    
    if (subjects.length === 0) {
      axiosClient.get("/subjects").then((r) => setSubjects(r.data));
    }
    
  }, [currentWeek]);

  // Filter the schedule based on user selections
  const filtered = schedule.filter((s) => {
    return (
      (!filter.classroomId || s.classroom_id === +filter.classroomId) &&
      (!filter.teacherId || s.teacher_id === +filter.teacherId) &&
      (!filter.subjectId || s.subject_id === +filter.subjectId)
    );
  });

  // Handle adding a new schedule entry
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
          date: new Date().toISOString().slice(0, 10),
        });
      })
      .catch((err) => {
        console.error("Add schedule error:", err.response?.data || err.message);
        alert("Something went wrong while adding the schedule.");
      });
  };

  // Create an organized schedule grid by time slots and days
  const createScheduleGrid = () => {
    const grid = {};
    
    // Initialize the grid with empty cells for each day and time slot
    hours.forEach(time => {
      grid[time] = {};
      days.forEach(day => {
        grid[time][day] = [];
      });
    });
    
    // Populate the grid with schedule entries
    filtered.forEach(entry => {
      // Find the closest time slot (this is simplified)
      const timeSlot = hours.find(h => h === entry.start_time) || hours[0];
      if (grid[timeSlot][entry.day]) {
        grid[timeSlot][entry.day].push(entry);
      }
    });
    
    return grid;
  };

  const scheduleGrid = createScheduleGrid();

  return (
    <div className="school-schedule p-4">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">📅 Weekly Schedule</h2>
            <div className="d-flex align-items-center">
              <Button variant="outline-primary" onClick={goToPreviousWeek} className="me-2">
                <ChevronLeft size={18} />
                Previous Week
              </Button>
              <span className="mx-2 fw-bold">{getWeekDisplay()}</span>
              <Button variant="outline-primary" onClick={goToNextWeek} className="ms-2">
                Next Week
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Classroom</Form.Label>
                <Form.Select onChange={e => setFilter(f => ({ ...f, classroomId: e.target.value }))}>
                  <option value="">All Rooms</option>
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Teacher</Form.Label>
                <Form.Select onChange={e => setFilter(f => ({ ...f, teacherId: e.target.value }))}>
                  <option value="">All Teachers</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.user?.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Subject</Form.Label>
                <Form.Select onChange={e => setFilter(f => ({ ...f, subjectId: e.target.value }))}>
                  <option value="">All Subjects</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Weekly Schedule View */}
          <Card className="mb-4">
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table bordered className="m-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="text-center" style={{ width: '10%' }}>Time</th>
                        {days.map(day => (
                          <th key={day} className="text-center">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {hours.map(time => (
                        <tr key={time}>
                          <td className="text-center fw-bold">{time}</td>
                          {days.map(day => (
                            <td key={`${day}-${time}`} className="align-top">
                              {scheduleGrid[time][day].length > 0 ? (
                                scheduleGrid[time][day].map((entry, idx) => (
                                  <div 
                                    key={idx} 
                                    className="p-1 mb-1 rounded" 
                                    style={{ backgroundColor: '#f0f8ff', fontSize: '0.85rem' }}
                                  >
                                    <div className="fw-bold">{entry.subject?.name}</div>
                                    <div>{entry.classroom?.name}</div>
                                    <div className="text-muted">{entry.teacher?.user?.name}</div>
                                    <div className="small">{entry.start_time} - {entry.end_time}</div>
                                  </div>
                                ))
                              ) : null}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Add Schedule Form */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">➕ Add Class to Schedule</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleAdd}>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Classroom</Form.Label>
                      <Form.Select 
                        required 
                        value={newEntry.classroom_id} 
                        onChange={e => setNewEntry(n => ({ ...n, classroom_id: e.target.value }))}
                      >
                        <option value="">Select Room</option>
                        {classrooms.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Teacher</Form.Label>
                      <Form.Select 
                        required 
                        value={newEntry.teacher_id} 
                        onChange={e => setNewEntry(n => ({ ...n, teacher_id: e.target.value }))}
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map(t => (
                          <option key={t.id} value={t.id}>{t.user?.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Subject</Form.Label>
                      <Form.Select 
                        required 
                        value={newEntry.subject_id} 
                        onChange={e => setNewEntry(n => ({ ...n, subject_id: e.target.value }))}
                      >
                        <option value="">Select Subject</option>
                        {subjects.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Day</Form.Label>
                      <Form.Select 
                        value={newEntry.day} 
                        onChange={e => setNewEntry(n => ({ ...n, day: e.target.value }))}
                      >
                        {days.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Start Time</Form.Label>
                      <Form.Select 
                        value={newEntry.start_time} 
                        onChange={e => setNewEntry(n => ({ ...n, start_time: e.target.value }))}
                      >
                        {hours.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>End Time</Form.Label>
                      <Form.Select 
                        value={newEntry.end_time} 
                        onChange={e => setNewEntry(n => ({ ...n, end_time: e.target.value }))}
                      >
                        {hours.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="text-end">
                  <Button type="submit" variant="primary">Add to Schedule</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </div>
  );
}
