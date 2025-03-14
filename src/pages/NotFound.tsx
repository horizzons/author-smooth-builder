
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <div className="mb-6 flex justify-center">
          <AlertTriangle className="h-24 w-24 text-yellow-500" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-foreground">Page Not Found</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          We couldn't find the page you're looking for. The page might have been moved, deleted, or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" size="lg">
            <Link to="/" className="w-full sm:w-auto">Go to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/dashboard" className="w-full sm:w-auto">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
