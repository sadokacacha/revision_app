<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bootstrap Sidebar</title>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
  />
  <div className="d-flex">
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
      style={{
        width: 250,
        height: "100vh",
        backgroundColor: "#000042 !important"
      }}
    >
      <a
        href="/"
        className="d-flex align-items-center mb-1 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <img src="/asstes/logo.png" alt="" />
      </a>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a href="#" className="nav-link text-white" aria-current="page">
            Home
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-white">
            Dashboard
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-white">
            Orders
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-white">
            Messages
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-white">
            Settings
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-white">
            Logout
          </a>
        </li>
      </ul>
      <div className="dropdown">
        <ul
          className="dropdown-menu dropdown-menu-dark text-small shadow"
          aria-labelledby="dropdownUser"
        >
          <li>
            <a className="dropdown-item" href="#">
              Profile
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Settings
            </a>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Sign out
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="p-4" style={{ width: "100%" }}>
      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    </div>
  </div>
</>
