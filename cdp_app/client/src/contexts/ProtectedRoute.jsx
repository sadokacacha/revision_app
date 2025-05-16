// src/contexts/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStateContext } from './ContextsProvider';

export default function ProtectedRoute({ role, children }) {
  const { user } = useStateContext();
  if (!user)                return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}/dashboard`} replace />;
  return children;
}
