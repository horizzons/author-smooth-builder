
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
    console.log('ProtectedRoute rendering with session state:', {
      isLoading: session.isLoading,
      hasUser: !!session.user,
      location: location.pathname,
      timestamp: new Date().toISOString(),
    });
    
    if (session.error) {
      console.error('Authentication error:', session.error);
    }
  }, [session, location]);

  if (session.isLoading) {
    console.log('Auth session is still loading');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!session.user) {
    console.log('No authenticated user found, redirecting to /auth');
    // Save the location the user was trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
