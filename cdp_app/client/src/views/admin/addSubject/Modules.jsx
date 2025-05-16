import React, { useState } from "react";
import {
  Table,
  InputGroup,
  FormControl,
  Dropdown,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
// import { PencilSquare, Trash } from 'react-bootstrap-icons';

const Modules = () => {
  const [sessionFilter, setSessionFilter] = useState("All Session");
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);

  const courses = [
    { module: "PHP", session: "Informatique", price: 12 },
    { module: "UML", session: "informatique", price: 8 },
    { module: "PHotoshop", session: "design", price: 15 },
    { module: "Anglais", session: "informatique", price: 3 },
  ];

  const filteredCourses = courses.filter((course) => {
    const sessionMatch =
      sessionFilter === "All Session" ||
      course.session.toLowerCase() === sessionFilter.toLowerCase();
    const searchMatch = course.module
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return sessionMatch && searchMatch;
  });

  return (
    <div className="container mt-5 ">
      <div className="ms-3 d-flex justify-content-cente">
        <h4 className="fw-bold">Cours Management</h4>
        <Button
          className="ms-5"
          variant="primary"
          onClick={() => setShowModal(true)}
        >
          Add Courses
        </Button>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add New Courses</Modal.Title>
          </Modal.Header>

          <Form>
            <Modal.Body>
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="Courses Name">
                    <Form.Label>Course Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter first name"
                      autoFocus
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="Session">
                    <Form.Label>Session</Form.Label>
                    <Form.Control type="text" placeholder="Enter last name" />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button id="color" variant="primary" type="submit">
                Save 
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <InputGroup style={{ maxWidth: "300px" }}>
          <FormControl
            placeholder="Search users..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Dropdown onSelect={(e) => setSessionFilter(e)}>
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            {sessionFilter}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey="All Session">All Session</Dropdown.Item>
            <Dropdown.Item eventKey="informatique">informatique</Dropdown.Item>
            <Dropdown.Item eventKey="design">design</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Module</th>
            <th>Session</th>
            <th>Price /h</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course, index) => (
            <tr key={index}>
              <td>{course.module}</td>
              <td>{course.session}</td>
              <td>{course.price} $</td>
              <td>
                <Button variant="outline-dark" size="sm" className="me-2">
                  <i class="bi bi-pen"></i>
                </Button>
                <Button variant="outline-danger" size="sm">
                  <i class="bi bi-trash2"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <p className="text-center">
        Showing {filteredCourses.length} of {courses.length} users
      </p>
    </div>
  );
};

export default Modules;
