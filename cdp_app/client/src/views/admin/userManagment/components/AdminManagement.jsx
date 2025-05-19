import React from "react";
import { Card, Table, Form, Button, Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminManagement = ({
  users,
  userSearch,
  setUserSearch,
  selectedRole,
  setSelectedRole,
  loadingUsers,
  showUserForm
}) => {
  const navigate = useNavigate();

  const filteredUsers = users.filter(
    (user) =>
      (user.role === "admin") &&
      user.name?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Row className="align-items-center mb-3">
          <Col md={5}>
            <Form.Control
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </Col>
          <Col md="auto">
            <DropdownButton title={selectedRole} variant="outline-secondary">
              {["All Roles", "admin", "teacher", "student"].map((r, i) => (
                <Dropdown.Item key={i} onClick={() => setSelectedRole(r)}>
                  {r}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
          <Col md="auto">
            <Button 
              variant="primary" 
              onClick={showUserForm}
            >
              Add User
            </Button>
          </Col>
        </Row>

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
                <th>Role</th>
                <th>Classes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{Array.isArray(user.classes) ? user.classes.join(", ") : user.classes}</td>
                    <td className="d-flex justify-content-center">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewUser(user.id)}
                      >
                        <ChevronRight size={18} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default AdminManagement;