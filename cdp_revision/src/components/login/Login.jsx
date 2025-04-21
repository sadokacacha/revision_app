import React from 'react';
import './login_style.css';

import logo from '../../assetes/logo.png';
import eye_icon from '../../assetes/eye_icon.png';
import profile_icon from '../../assetes/profile_icon.png';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-section">
        <img src={logo} alt="College de Paris" className="logo" />
        <h2>Login</h2>
        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="btn primary">Sign in</button>
          <button type="button" className="btn secondary">Connect With Alma</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
