
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FeaturePlaceholder = () => {
  return (
    <div className="container py-16 px-4 mx-auto max-w-7xl">
      <h1 className="text-4xl font-bold mb-6">Features</h1>
      <p className="text-lg text-muted-foreground mb-8">
        This page is under construction. Check back soon for more information about our features.
      </p>
      <Button asChild>
        <Link to="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
};

export default FeaturePlaceholder;
