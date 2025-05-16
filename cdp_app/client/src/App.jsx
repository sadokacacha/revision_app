import { Routes, Route, Navigate } from 'react-router-dom';
import { useStateContext } from './contexts/ContextsProvider';
import ProtectedRoute from './contexts/ProtectedRoute';
import { csrfAxios } from './axios-client';

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
import TeacherSchedule from './views/teacher/Schedule';
import TeacherAttendance from './views/teacher/Attendance';
import TeacherPayments from './views/teacher/Payments';

// Student Views
import StudentDashboard from './views/student/StudentDashboard';
import StudentSchedule from './views/student/Schedule';
import StudentAttendance from './views/student/Attendance';
import StudentPayments from './views/student/Payments';
import { useEffect } from 'react';

export default function App() {
  const { user } = useStateContext();

  useEffect(() => {
    csrfAxios.get('/sanctum/csrf-cookie').catch(console.error);
  }, []);

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
        <Route path="schedule" element={<TeacherSchedule />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="payments" element={<TeacherPayments />} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute role="student">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="schedule" element={<StudentSchedule />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="payments" element={<StudentPayments />} />
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
