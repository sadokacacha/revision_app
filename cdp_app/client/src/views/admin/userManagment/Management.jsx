import React, { useState } from "react";
import {
  Card,
  Table,
  Form,
  Button,
  Nav,
  Badge,
  InputGroup,
  FormControl,
  ButtonGroup,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Modal,
} from "react-bootstrap";
import {
  CheckCircle,
  Circle,
  XCircle,
  Mail,
  Printer,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const payments = [
  {
    id: 1,
    name: "Sadok Acacha",
    amount: 19623.0,
    paymentMethod: "semester",
    paymentType: "check",
    creationDate: "Mar 23, 2022",
    status: "succeeded",
    role: "student"
  },
  {
    id: 2,
    name: "Sadok Acacha1",
    amount: 19623.0,
    paymentMethod: "annual",
    paymentType: "cash",
    creationDate: "Mar 23, 2022",
    status: "pending",
    role: "student"
  },
  {
    id: 3,
    name: "Robert Johnson",
    amount: 1200.0,
    paymentMethod: "monthly",
    paymentType: "bank",
    creationDate: "Mar 23, 2022",
    status: "succeeded",
    role: "teacher",
    hours: 24,
    ratePerHour: 50
  }
];

const teachersData = [
  {
    name: "Robert Johnson",
    email: "robert@example.com",
    class: "c1",
    module: "Html&Css",
    ratePerHour: 50,
    totalHours: 0,
    pendingPayment: 0
  },
  {
    name: "Aziz Iadhari",
    email: "aziz@example.com",
    class: "cd3",
    module: "photoshop",
    ratePerHour: 45,
    totalHours: 0,
    pendingPayment: 0
  },
  {
    name: "Sadok Acacha",
    email: "sadok@example.com",
    class: "cd4",
    module: "algorithme",
    ratePerHour: 55,
    totalHours: 0,
    pendingPayment: 0
  }
];

const modules = ["Html&Css", "photoshop", "algorithme"];
const values = ["0.5", "1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"];

const dummyUsers = [
  {
    name: "Alice Dupont",
    email: "alice@admin.com",
    role: "admin",
    classes: ["c1", "c2"],
  },
  {
    name: "Bob Martin",
    email: "bob@teacher.com",
    role: "teacher",
    classes: ["c3"],
  },
];

const getStatusDetails = (status) => {
  switch (status) {
    case "succeeded":
      return {
        variant: "success",
        icon: <CheckCircle size={16} />,
        text: "Succeeded",
      };
    case "pending":
      return {
        variant: "warning",
        icon: <Circle size={16} />,
        text: "Pending",
      };
    case "declined":
      return {
        variant: "danger",
        icon: <XCircle size={16} />,
        text: "Declined",
      };
    case "refunded":
      return { variant: "info", icon: <Circle size={16} />, text: "Refunded" };
    default:
      return {
        variant: "secondary",
        icon: <Circle size={16} />,
        text: "Unknown",
      };
  }
};

export default function Management() {
  const [activeRole, setActiveRole] = useState("student");
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [showModal, setShowModal] = useState(false);
  const [xshowModal2, setxShowModal2] = useState(false);
  const filteredTeachers = teachersData.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = dummyUsers.filter(
    (user) =>
      (selectedRole === "All Roles" || user.role === selectedRole) &&
      user.name.toLowerCase().includes(userSearch.toLowerCase())
  );

  const renderStudentManagement = () => {
    const filteredPayments = payments.filter(p => 
      (activeTab === "all" ? true : p.status === activeTab) && p.role === "student"
    );

    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="text-center mb-3">Student Payments</h4>
          <Col md="auto" className="d-flex justify-content-center">
            <Button
              id="color"
              className="mb-3"
              variant="primary"
              onClick={() => setShowModal(true)}
            >
              Add Student
            </Button>
          </Col>
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Add New Student</Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                <Row className="mb-3">
                  <Col>
                    <Form.Group controlId="gradeLevel" className="mb-3">
                      <Form.Label>Grade Level</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter grade level"
                        autoFocus
                      />
                    </Form.Group>

                    <Form.Group controlId="parentName" className="mb-3">
                      <Form.Label>Parent Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter parent name"
                      />
                    </Form.Group>

                    <Form.Group controlId="parentContact" className="mb-3">
                      <Form.Label>Parent Contact</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter parent contact"
                      />
                    </Form.Group>

                    <Form.Group controlId="firstName" className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter first name"
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group controlId="lastName" className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter last name" />
                    </Form.Group>

                    <Form.Group controlId="email" className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group controlId="password" className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter password"
                      />
                    </Form.Group>

                    <Form.Group controlId="phone" className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter phone number"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="paymentMethod" className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select defaultValue="">
                    <option disabled value="">
                      -- Select payment method --
                    </option>
                    <option>Per Semester</option>
                    <option>Monthly</option>
                    <option>Per Hour</option>
                  </Form.Select>
                </Form.Group>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button id="color" variant="primary" type="submit">
                  Save User
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
          <Nav variant="pills" className="justify-content-center mb-4">
            {["all", "succeeded", "pending", "declined", "refunded"].map(
              (tab) => (
                <Nav.Item key={tab}>
                    <Nav.Link
                    id="navcolor"
                      className=""
                      active={activeTab === tab}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Nav.Link>
                </Nav.Item>
              )
            )}
          </Nav>
          <Table responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Payment Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.name}</td>
                  <td>${payment.amount.toFixed(2)}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>{payment.paymentType}</td>
                  <td>{payment.creationDate}</td>
                  <td>
                    <Badge
                      bg={getStatusDetails(payment.status).variant}
                      className="d-flex align-items-center gap-1"
                    >
                      {getStatusDetails(payment.status).icon}
                      {getStatusDetails(payment.status).text}
                    </Badge>
                  </td>
                  <td>
                    <ButtonGroup>
                      <Button variant="light" size="sm">
                        <i className="bi bi-eye"></i>
                      </Button>
                      <Button variant="light" size="sm">
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button variant="light" size="sm">
                        <i className="bi bi-trash"></i>
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  const renderTeacherManagement = () => {
    const filteredPayments = payments.filter(p => p.role === "teacher");

    return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="text-center mb-3">Teacher Payments</h4>
          <Table responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Hours</th>
                <th>Rate/Hour</th>
                <th>Total Amount</th>
                <th>Payment Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.name}</td>
                  <td>{payment.hours}</td>
                  <td>${payment.ratePerHour}</td>
                  <td>${payment.amount.toFixed(2)}</td>
                  <td>{payment.paymentType}</td>
                  <td>{payment.creationDate}</td>
                  <td>
                    <Badge
                      bg={getStatusDetails(payment.status).variant}
                      className="d-flex align-items-center gap-1"
                    >
                      {getStatusDetails(payment.status).icon}
                      {getStatusDetails(payment.status).text}
                    </Badge>
                  </td>
                  <td>
                    <ButtonGroup>
                      <Button variant="light" size="sm">
                        <i className="bi bi-eye"></i>
                      </Button>
                      <Button variant="light" size="sm">
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button variant="light" size="sm">
                        <i className="bi bi-trash"></i>
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  const renderAdminManagement = () => (
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
            <Button variant="primary" onClick={() => setShowModal(true)}>
              Add User
            </Button>
          </Col>
        </Row>

        <Table responsive bordered hover>
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Classes</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length ? (
              filteredUsers.map((user, i) => (
                <tr key={i}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.classes.join(", ")}</td>
                  <td className="d-flex justify-content-center">
                    <Link to="/admin/admin-details">
                      <Button>
                        <ChevronRight size={18} />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>

        <Form>
          <Modal.Body>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    autoFocus
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter last name" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter password" />
            </Form.Group>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="phone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="text" placeholder="Enter phone number" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="rib">
                  <Form.Label>RIB Number</Form.Label>
                  <Form.Control type="text" placeholder="Enter RIB number" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="paymentMethod" className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select defaultValue="">
                <option disabled value="">
                  -- Select payment method --
                </option>
                <option>Per Semester</option>
                <option>Monthly</option>
                <option>Per Hour</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save User
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Card>
  );

  return (
    <Container className="py-4">
      <div className="text-center mb-4">
        <ButtonGroup>
          {["student", "teacher", "admin"].map((role) => (
            <Button
              key={role}
              id="color"
              variant={activeRole === role ? "primary" : "outline-primary"}
              onClick={() => setActiveRole(role)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {activeRole === "student" && renderStudentManagement()}
      {activeRole === "teacher" && renderTeacherManagement()}
      {activeRole === "admin" && renderAdminManagement()}
    </Container>
  );
}
