import React from 'react'

const StudentDashboard = () => {
  const payments = [
    {
      id: "INV-2025-01",
      amount: 1200,
      status: "Paid",
      due: "2025-01-05",
      paid: "2025-01-05",
    },
    {
      id: "INV-2025-02",
      amount: 1200,
      status: "Paid",
      due: "2025-02-05",
      paid: "2025-02-04",
    },
    {
      id: "INV-2025-03",
      amount: 1200,
      status: "Paid",
      due: "2025-03-05",
      paid: "2025-03-03",
    },
  ];

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const nextPayment = { amount: 1200, due: "2025-04-05", daysLeft: 16 };

  const paymentData = {
    totalPaid: 4800,
    nextPayment: "2025-04-05",
    lastPayment: "2025-06-05",
    payments: [
      { amount: 560, date: "2025-03-05", status: "completed" },
      { amount: 560, date: "2025-04-05", status: "upcoming" },
      { amount: 560, date: "2025-05-05", status: "pending" },
      { amount: 560, date: "2025-06-05", status: "pending" },
      { amount: 560, date: "2025-07-05", status: "pending" },
      { amount: 560, date: "2025-08-05", status: "pending" },
      { amount: 560, date: "2025-09-05", status: "pending" },
      { amount: 560, date: "2025-10-05", status: "pending" },
      { amount: 560, date: "2025-11-05", status: "pending" },
    ],
  };
  return (
    <Container className="my-4 container py-5">
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-wrapper bg-primary-subtle rounded-circle p-3 me-3">
                  <BsCreditCard2Front className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-muted mb-0">Total Paid</p>
                  <h3 className="mb-0">${paymentData.totalPaid}</h3>
                </div>
              </div>
              <p className="text-muted small mb-0">
                For the current academic year
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-wrapper bg-success-subtle rounded-circle p-3 me-3">
                  <BsCalendar2Date className="text-success" size={24} />
                </div>
                <div>
                  <p className="text-muted mb-0">Next Payment</p>
                  <h3 className="mb-0">April 5, 2025</h3>
                </div>
              </div>
              <p className="text-muted small mb-0">Due in 16 days</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="icon-wrapper bg-danger-subtle rounded-circle p-3 me-3">
                  <BsCalendar2Date className="text-danger" size={24} />
                </div>
                <div>
                  <p className="text-muted mb-0">Last Payment</p>
                  <h3 className="mb-0">Jun 5, 2025</h3>
                </div>
              </div>
              <p className="text-muted small mb-0">Due in 16 days</p>
            </div>
          </div>
        </div>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <div className="mb-3">
            <strong>Payment method:</strong>{" "}
            <Button variant="secondary" size="sm" disabled>
              Semester
            </Button>{" "}
            <Button variant="outline-secondary" size="sm">
              Month
            </Button>
          </div>

          <div className="d-flex justify-content-between mb-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="text-center ">
                
                <div
                  className="bgcolor rounded-circle mx-auto d-flex align-items-center justify-content-center"
                  style={{ width: "30px", height: "30px" }}
                >
                  <i class="text-white bi-record-circle-fill"></i>
                </div>
                <small>560 DT</small>
                <br />
                <small>12/20/2025</small>
              </div>
            ))}
          </div>

          <div className="bg-light p-3 rounded">
            <h5>Upcoming Payment</h5>
            <p>
              Your next payment of <strong>${nextPayment.amount}</strong> is due
              on <strong>{nextPayment.due}</strong>.
            </p>
            <ProgressBar
              now={100 - (nextPayment.daysLeft / 30) * 100}
              label={`${nextPayment.daysLeft} days`}
              className="mb-2"
            />
            <small className="text-danger">
              If there is an error please consider contacting the administration
            </small>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <h5>Payment History</h5>
            <div>
              <Button variant="outline-secondary" size="sm" className="me-2">
                This Year
              </Button>
              <Button id="color" variant="outline-primary" size="sm">
                Export
              </Button>
            </div>
          </div>

          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Payment Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={i}>
                  <td>{p.id}</td>
                  <td>${p.amount.toFixed(2)}</td>
                  <td>
                    <Badge bg="success">{p.status}</Badge>
                  </td>
                  <td>{p.due}</td>
                  <td>{p.paid}</td>
                  <td>
                    <Button variant="link" size="sm">
                      View Receipt
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default StudentDashboard