import React, { useState, useEffect } from "react";
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
import axiosClient from "../../../axios-client";

const Modules = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    description: ''
  });

  useEffect(() => {
    loadClassrooms();
  }, []);

  const loadClassrooms = async () => {
    try {
      const response = await axiosClient.get('/classrooms');
      setClassrooms(response.data);
    } catch (error) {
      console.error('Error loading classrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/classrooms', formData);
      setShowModal(false);
      loadClassrooms();
      setFormData({ name: '', capacity: '', description: '' });
    } catch (error) {
      console.error('Error creating classroom:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        await axiosClient.delete(`/classrooms/${id}`);
        loadClassrooms();
      } catch (error) {
        console.error('Error deleting classroom:', error);
      }
    }
  };

  const filteredClassrooms = classrooms.filter((classroom) => 
    classroom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="ms-3 d-flex justify-content-center">
        <h4 className="fw-bold">Classroom Management</h4>
        <Button
          className="ms-5"
          variant="primary"
          onClick={() => setShowModal(true)}
        >
          Add Classroom
        </Button>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add New Classroom</Modal.Title>
          </Modal.Header>

          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row className="mb-3">
                <Col>
                  <Form.Group controlId="classroomName">
                    <Form.Label>Classroom Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter classroom name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      autoFocus
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="capacity">
                    <Form.Label>Capacity</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter capacity"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </Form.Group>
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
            placeholder="Search classrooms..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Capacity</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClassrooms.map((classroom) => (
                <tr key={classroom.id}>
                  <td>{classroom.name}</td>
                  <td>{classroom.capacity}</td>
                  <td>{classroom.description}</td>
                  <td>
                    <Button variant="outline-dark" size="sm" className="me-2">
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(classroom.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <p className="text-center">
            Showing {filteredClassrooms.length} of {classrooms.length} classrooms
          </p>
        </>
      )}
    </div>
  );
};

export default Modules; 