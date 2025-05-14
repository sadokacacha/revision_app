import React, { useState } from 'react';
import { useEffect } from "react";

import './login.css';
import logo from '../assets/logo.png';
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextsProvider';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { setUser, setToken } = useStateContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
  
    try {
      const { data } = await axiosClient.post('/login', { email, password });
      // success…
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("USER_ROLE", data.user.role);
      navigate(`/${data.user.role}/dashboard`);
    } catch (err) {
      console.error("Login error:", err);
      const status = err.response?.status;
      if (status === 401) {
        setErrors({ message: "Invalid email or password." });
      } else if (status === 422) {
        setErrors(err.response.data.errors || { message: err.response.data.message });
      } else {
        setErrors({ message: "Something went wrong. Try again later." });
      }
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    const role = localStorage.getItem("USER_ROLE");
  
    if (token && role) {
      navigate(`/${role}/dashboard`);
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-section">
        <img src={logo} alt="College de Paris" className="logo" />
        <h2>Login</h2>

        {errors && <div className="error">{JSON.stringify(errors)}</div>}

        <form onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn primary">Sign in</button>
          <button type="button" className="btn secondary">Connect With Alma</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
