import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import Flag from "react-world-flags";

const Profile = ({
  profile,
  name,
  email,
  phone,
  ripNumber,
  role,
  address,
  countryCode,
  countryName,
  avatar,
}) => {
  return (
    <div>
      {/* <Nav /> */}
      <Container className="my-4">
        <h1 className="text-center mb-4" value={profile}>
          {profile} Profile
        </h1>
        <Button variant="light" className="m-2">
          Edit Profile
        </Button>
        <Card className="p-4 shadow-sm">
          <Row className="align-items-center">
            <Col md={3} className="text-center">
              <Image
                src={avatar || "https://i.pravatar.cc/100"}
                roundedCircle
                fluid
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                alt="Profile"
              />
              <Form.Text className="text-muted d-block mt-2"></Form.Text>
            </Col>

            <Col md={9}>
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Name & LastName</Form.Label>
                    <Form.Control
                      className="colorinput"
                      value={name}
                      readOnly
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      className="colorinput"
                      value={email}
                      readOnly
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control
                      className="colorinput"
                      value={phone}
                      readOnly
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>RIP Number</Form.Label>
                    <Form.Control
                      className="colorinput"
                      value={ripNumber}
                      readOnly
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      className="colorinput"
                      value={role}
                      readOnly
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      className="colorinput"
                      value={address}
                      readOnly
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label>Country</Form.Label>
                    <div className="d-flex align-items-center">
                      <Flag
                        code={countryCode}
                        style={{ width: "24px", height: "18px" }}
                      />
                      <span className="ms-2">{countryName}</span>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default Profile;
