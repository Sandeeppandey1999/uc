import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthenticationService from '../../services/AuthenticationService';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const location = useLocation();
  const isAuthenticated = AuthenticationService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0) {
    const hasRequiredRole = AuthenticationService.hasAnyRole(requiredRoles);
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
