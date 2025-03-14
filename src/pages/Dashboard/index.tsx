
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusIcon, PenSquare } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/editor">
          <Button className="gap-2">
            <PenSquare className="h-4 w-4" />
            Open Editor
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold">My First Website</h2>
            <p className="text-muted-foreground mt-2">Created 2 days ago</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline">View</Button>
              <Button size="sm" asChild>
                <Link to="/editor">Edit</Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg border-dashed flex items-center justify-center p-6 min-h-[180px]">
          <Button variant="outline" className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Create New Website
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
