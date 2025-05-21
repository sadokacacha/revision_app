import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/admin">Admin Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/admin" 
              active={location.pathname === "/admin"}
            >
              Dashboard
            </Nav.Link>
            
            <NavDropdown title="User Management" id="user-management-dropdown">
              <NavDropdown.Item as={Link} to="/admin/users">All Users</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/teachers">Teachers</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/students">Students</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Payments" id="payments-dropdown">
              <NavDropdown.Item as={Link} to="/admin/payments">All Payments</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/payments/teachers">Teacher Payments</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/payments/students">Student Payments</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/admin/payments/reports">Payment Reports</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Attendance" id="attendance-dropdown">
              <NavDropdown.Item as={Link} to="/admin/attendance">View Attendance</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/attendance/reports">Attendance Reports</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Settings" id="settings-dropdown">
              <NavDropdown.Item as={Link} to="/admin/settings/general">General Settings</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/settings/payments">Payment Settings</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/settings/notifications">Notification Settings</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          
          <Nav>
            <NavDropdown title="Account" id="account-dropdown" align="end">
              <NavDropdown.Item as={Link} to="/admin/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/admin/settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar; 