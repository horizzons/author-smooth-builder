
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();

  // Log the current route for debugging
  useEffect(() => {
    console.log('ProtectedRoute rendering:', {
      path: location.pathname,
      bypassingAuth: true,
      timestamp: new Date().toISOString(),
    });
  }, [location.pathname]);

  // Authentication is disabled - render children directly without any checks
  return <>{children}</>;
};

export default ProtectedRoute;
