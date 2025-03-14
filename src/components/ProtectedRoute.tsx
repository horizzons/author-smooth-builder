
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session } = useAuth();
  const location = useLocation();

  // Add detailed debugging logs
  useEffect(() => {
    console.log('ProtectedRoute rendering:', {
      path: location.pathname,
      isLoading: session.isLoading,
      hasUser: Boolean(session.user),
      timestamp: new Date().toISOString(),
    });
  }, [session, location]);

  // If auth is still loading, show a loading spinner
  if (session.isLoading) {
    console.log('Auth session is still loading - showing spinner');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!session.user) {
    console.log('User not authenticated - redirecting to /auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  console.log('User authenticated - rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
