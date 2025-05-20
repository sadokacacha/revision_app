import React, { useState, useEffect } from "react";
import { Card, Table, Form, Button } from "react-bootstrap";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../../axios-client";
import TodaysTeacherList from "./TodaysTeacherList";

const TeacherManagement = ({ search, setSearch, loadingUsers, showUserForm, onTeacherAdded }) => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get("/teachers");
        setTeachers(res.data);
      } catch (err) {
        setTeachers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [onTeacherAdded]);

  const handleViewUser = (teacher) => {
    navigate(`/admin/users/${teacher.user.id}`);
  };

  // Filter by search
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <h4 className="mb-0 me-3">Teacher Management</h4>
            <Form.Control
              placeholder="Search teachers..."
              className="form-control-sm"
              style={{ width: "200px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button id="color" onClick={showUserForm}>
            Add Teacher
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <Table responsive bordered hover>
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subjects</th>
                <th>Classes</th>
                <th>Rate / Hour</th>
                <th>Payment Method</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>{teacher.user?.name}</td>
                    <td>{teacher.user?.email}</td>
                    <td>
                      {teacher.subjects && teacher.subjects.length > 0
                        ? teacher.subjects.map((s) => s.name).join(", ")
                        : "Not assigned"}
                    </td>
                    <td>
                      {teacher.classrooms && teacher.classrooms.length > 0
                        ? teacher.classrooms.map((c) => c.name).join(", ")
                        : "Not assigned"}
                    </td>
                    <td>${teacher.hourly_rate || 0}/hr</td>
                    <td>{teacher.payment_method || "Not set"}</td>
                    <td className="d-flex gap-2 justify-content-center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewUser(teacher)}
                      >
                        <ChevronRight size={18} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No teachers found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
        
        <TodaysTeacherList />
      </Card.Body>
    </Card>
  );
};

export default TeacherManagement; 