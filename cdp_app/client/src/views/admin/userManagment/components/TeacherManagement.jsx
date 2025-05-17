import React from "react";
import { Card, Table, Form, Button } from "react-bootstrap";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TodaysTeacherList from "./TodaysTeacherList";

const TeacherManagement = ({ 
  users, 
  search, 
  setSearch, 
  loadingUsers, 
  showUserForm
}) => {
  const navigate = useNavigate();
  
  // Filter users to show only teachers
  const teacherUsers = users.filter(user => user.role === 'teacher');
  
  const handleViewUser = (teacherId) => {
    navigate(`/admin/users/${teacherId}`);
  };
  
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
          <Button 
            id="color"
            onClick={showUserForm}
          >
            Add Teacher
          </Button>
        </div>

        {loadingUsers ? (
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
                <th>Rate / Hour</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {teacherUsers.length > 0 ? (
                teacherUsers
                  .filter(teacher => teacher.name?.toLowerCase().includes(search.toLowerCase()))
                  .map((teacher) => (
                    <tr key={teacher.id}>
                      <td>{teacher.name}</td>
                      <td>{teacher.email}</td>
                      <td>{Array.isArray(teacher.subjects) ? teacher.subjects.join(", ") : teacher.subjects || "Not assigned"}</td>
                      <td>${teacher.ratePerHour || 0}</td>
                      <td className="text-center">
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleViewUser(teacher.id)}
                        >
                          <ChevronRight size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
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