import { Navigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children, role }) {
  const { user } = useStateContext();
  const [storedRole, setStoredRole] = useState(localStorage.getItem('USER_ROLE'));
  
  // Log what's happening for debugging
  useEffect(() => {
    console.log('ProtectedRoute mounted/updated:', { 
      requiredRole: role, 
      userFromContext: user ? JSON.stringify(user) : 'No user',
      storedRole: storedRole,
      hasAccess: (user && user.role === role) || (!user && storedRole === role)
    });
    
    // Check localStorage as a backup
    const token = localStorage.getItem('ACCESS_TOKEN');
    const roleFromStorage = localStorage.getItem('USER_ROLE');
    
    if (roleFromStorage !== storedRole) {
      setStoredRole(roleFromStorage);
    }
  }, [user, role, storedRole]);
  
  // If user exists in context, use that for role checking
  if (user) {
    console.log(`Checking access with context user role: ${user.role} against required: ${role}`);
    
    // If role doesn't match, redirect to their dashboard
    if (role && user.role !== role) {
      console.log(`User role (${user.role}) doesn't match required role (${role}), redirecting`);
      return <Navigate to={`/${user.role}/dashboard`} replace />;
    }
    
    // User exists and role matches, allow access
    return children;
  } 
  
  // No user in context, but we might have auth in localStorage
  const token = localStorage.getItem('ACCESS_TOKEN');
  const roleFromStorage = localStorage.getItem('USER_ROLE');
  
  if (token && roleFromStorage) {
    console.log(`No user in context, but found token and role (${roleFromStorage}) in localStorage`);
    
    // If this route requires a different role, redirect appropriately
    if (role && roleFromStorage !== role) {
      console.log(`Stored role (${roleFromStorage}) doesn't match required (${role}), redirecting`);
      return <Navigate to={`/${roleFromStorage}/dashboard`} replace />;
    }
    
    // We have authentication and the role matches, so allow access
    return children;
  }
  
  // No authentication found, redirect to login
  console.log('No authenticated user, redirecting to login');
  return <Navigate to="/login" replace />;
} 