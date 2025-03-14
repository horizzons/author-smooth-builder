
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Authentication is completely bypassed for now
  console.log('ProtectedRoute: Authentication bypassed');
  return <>{children}</>;
};

export default ProtectedRoute;
