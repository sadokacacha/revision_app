import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextProvider';
import './login.css';
import logo from '../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useStateContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const backgroundStyle = {
    backgroundImage: "url('paris_night.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  };
  
  const transparentStyle = {
    background: "rgba(255,255,255, 0.10)",
    borderRadius: "16px",
    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(2px)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.07)",
  };

  useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    const role = localStorage.getItem('USER_ROLE');
    if (token && role) {
      navigate(`/${role}/dashboard`);
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosClient.post('/login', {
        email,
        password
      });

      console.log('Login response data:', response.data);
      const { user, authorization } = response.data;
      
      // Default to student role if none is provided
      if (!user.role) {
        console.warn('User has no role, defaulting to student');
        user.role = 'student';
      }
      
      console.log('User from login:', user);
      console.log('User role:', user.role);
      
      // Store the token first
      setToken(authorization.token);
      
      // Then store the user with role
      setUser(user);
      
      // Double-check the role is stored
      localStorage.setItem('USER_ROLE', user.role);
      
      // Redirect based on role with a small delay to ensure state updates
      setTimeout(() => {
        const redirectRole = user.role || localStorage.getItem('USER_ROLE') || 'student';
        const redirectPath = `/${redirectRole}/dashboard`;
        console.log(`Navigating to ${redirectPath}`);
        navigate(redirectPath);
      }, 100);
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={backgroundStyle} className="d-flex align-items-center justify-content-left">
        <div style={transparentStyle} className="h-100 p-5 d-flex align-items-center justify-content-center">
          <div className="">
            <img 
              src={logo} 
              alt="College de Paris" 
              className="img-fluid mb-4"
              style={{ width: "200px" }} 
            />
            
            <div className="text-center">
              {error && (
                <div className="mb-3 error p-2" style={{color: 'white', background: 'rgba(220, 53, 69, 0.7)', borderRadius: '5px'}}>
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="login-section p-2 m-1"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="mb-3">
                  <input
                    type="password"
                    className="login-section p-2"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                
                <div className="mt-5 d-grid gap-3">
                  <button 
                    id="color" 
                    type="submit" 
                    className="btn p2 login-sectionx"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Login'}
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
      </div>
    </div>
  );
};

export default Login;