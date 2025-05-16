import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextsProvider";

function Login() {
  const navigate = useNavigate();
  const { login } = useStateContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const backgroundStyle = {
    backgroundImage: "url('paris_night.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  };

  const transparent = {
    background: "rgba(255,255,255, 0.10)",
    borderRadius: "16px",
    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(2px)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
  };


  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={backgroundStyle} className="d-flex align-items-center justify-content-left">
      <div style={transparent} className="h-100 p-5 d-flex align-items-center justify-content-center">
        <div>
          <img
            src="cdp.png"
            alt="Logo"
            className="img-fluid mb-4"
            style={{ width: "200px" }}
          />
          <form onSubmit={handleSubmit} className="text-center">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="mb-3">
              <input
                type="email"
                className="login-section p-2 m-1"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="login-section p-2"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mt-5 d-grid gap-3">
              <button
                id="color"
                type="submit"
                className="btn p2 login-sectionx"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <button
                id="btn-secondary"
                type="button"
                className="btn p-2"
                disabled={loading}
              >
                Connect With Alma
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
