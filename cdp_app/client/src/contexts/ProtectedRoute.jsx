import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ role, children }) {
  const token = localStorage.getItem('ACCESS_TOKEN');
  const userRole = localStorage.getItem('USER_ROLE');

  if (!token)     return <Navigate to="/login" />;
  if (userRole !== role) return <Navigate to={`/${userRole}/dashboard`} />;

  return children;
}
