
import React from 'react';
import { useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  // Log the current route for debugging
  console.log('ProtectedRoute rendering:', {
    path: location.pathname,
    bypassingAuth: true,
    timestamp: new Date().toISOString(),
  });

  // Authentication is temporarily disabled - render children directly
  return <>{children}</>;
};

export default ProtectedRoute;
