import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './contexts/ProtectedRoute';

import Login from './views/Login';
import DashboardLayout from './components/DashboardLayout';
import AdminDashboard   from './views/admin/AdminDashboard';
import TeacherDashboard from './views/teacher/TeacherDashboard';
import StudentDashboard from './views/student/StudentDashboard';

import UserManagement from './views/admin/UserManagement';
import AddUser        from './views/admin/AddUser';
import ViewUser       from './views/admin/ViewUser';
import SchoolSchedule from './views/admin/SchoolSchedule';
import ClassroomList  from './views/admin/ClassroomList';
import ClassroomForm  from './views/admin/ClassroomForm';
import SubjectList    from './views/admin/SubjectList';
import SubjectForm    from './views/admin/SubjectForm';
import Attendance     from './views/admin/Attendance';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />

        <Route path="users"       element={<UserManagement />} />
        <Route path="users/new"   element={<AddUser />} />
        <Route path="users/:id"   element={<ViewUser />} />

        <Route path="schedule"    element={<SchoolSchedule />} />

        <Route path="classrooms"  element={<ClassroomList />} />
        <Route path="classrooms/new" element={<ClassroomForm />} />
        <Route path="classrooms/:id" element={<ClassroomForm edit />} />

        <Route path="subjects"    element={<SubjectList />} />
        <Route path="subjects/new" element={<SubjectForm />} />
        <Route path="subjects/:id" element={<SubjectForm edit />} />

        <Route path="attendance"  element={<Attendance />} />
      </Route>

      <Route path="/teacher" element={
        <ProtectedRoute role="teacher">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<TeacherDashboard />} />
      </Route>

      <Route path="/student" element={
        <ProtectedRoute role="student">
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<StudentDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
