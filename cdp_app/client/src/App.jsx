import { Routes, Route, Navigate } from 'react-router-dom';
import { useStateContext } from './contexts/ContextProvider';
import { useEffect, useState } from 'react';
import axiosClient from './axios-client';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import DashboardLayout from './components/DashboardLayout';

// Auth Views
import Login from './views/Login';

// Admin Views
import AdminDashboard from './views/admin/AdminDashboard';
import UserManagement from './views/admin/userManagment/Management';
import UserDetails from './views/admin/userManagment/userDetails';
import SchoolSchedule from './views/admin/shedule/SchoolSchedule';
import ClassroomModules from './views/admin/addClassroom/Modules';
import Attendance from './views/admin/userManagment/Attendance';

// Teacher Views
import TeacherDashboard from './views/teacher/TeacherDashboard';


// Student Views
import StudentDashboard from './views/student/StudentDashboard';


export default function App() {
  const { user, setUser } = useStateContext();
  const [initializing, setInitializing] = useState(true);
  
  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('ACCESS_TOKEN');
    const storedUser = localStorage.getItem('USER');
    
    // If we have a token but no user or user with missing role
    if (token && (!user || !user.role)) {
      console.log('Token exists, trying to recover user state...');
      
      // Try to use stored user first
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          // Make sure role is present
          if (!parsedUser.role) {
            const storedRole = localStorage.getItem('USER_ROLE');
            if (storedRole) {
              parsedUser.role = storedRole;
              console.log(`Added missing role from localStorage: ${storedRole}`);
            }
          }
          
          console.log('Restored user from localStorage:', parsedUser);
          setUser(parsedUser);
          
          // Still verify with backend in the background
          verifyWithBackend(token);
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          verifyWithBackend(token);
        }
      } else {
        // No stored user, must verify with backend
        verifyWithBackend(token);
      }
    } else {
      // Either no token or user already set properly
      setInitializing(false);
    }
  }, []);
  
  const verifyWithBackend = async (token) => {
    try {
      console.log('Verifying user with backend...');
      const { data } = await axiosClient.get('/user');
      console.log('Backend returned user:', data);
      
      // Ensure role is present
      if (!data.role) {
        const storedRole = localStorage.getItem('USER_ROLE');
        if (storedRole) {
          data.role = storedRole;
          console.log(`Added missing role from localStorage: ${storedRole}`);
        } else {
          data.role = 'student'; // Default fallback
          console.log('No role found, defaulting to student');
        }
      }
      
      setUser(data);
    } catch (err) {
      console.error('Failed to verify user:', err);
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('USER');
      localStorage.removeItem('USER_ROLE');
      setUser(null);
    } finally {
      setInitializing(false);
    }
  };

  // Show minimal UI during initialization
  if (initializing) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        user ? <Navigate to={`/${user.role}/dashboard`} /> : <Login />
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        
        {/* User Management */}
        <Route path="users" element={<UserManagement />} />
        <Route path="users/:id" element={<UserDetails />} />
        
        {/* Schedule Management */}
        <Route path="schedule" element={<SchoolSchedule />} />
        
        {/* Classroom Management */}
        <Route path="classrooms" element={<ClassroomModules />} />
        
        {/* Attendance Management */}
        <Route path="attendance" element={<Attendance />} />
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher" element={
        <ProtectedRoute role="teacher">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute role="student">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
      </Route>

      {/* Root Redirect */}
      <Route path="/" element={
        user ? <Navigate to={`/${user.role}/dashboard`} /> : <Navigate to="/login" />
      } />

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
