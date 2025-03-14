
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PenSquare, Plus } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl font-bold">My Websites</h1>
        <Button asChild>
          <Link to="/editor" className="flex items-center gap-2">
            <PenSquare className="h-4 w-4" />
            Open Editor
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Sample website cards */}
        <Card className="animate-slideUp space-y-4 p-6">
          <h3 className="font-serif text-xl font-semibold">My Author Site</h3>
          <p className="text-muted-foreground">Personal website showcasing my books and blog.</p>
          <div className="flex justify-end">
            <Button variant="outline" asChild>
              <Link to="/editor">Edit Site</Link>
            </Button>
          </div>
        </Card>
        
        <Card className="border rounded-lg border-dashed flex items-center justify-center p-6 min-h-[180px]">
          <Button variant="outline" asChild>
            <Link to="/editor" className="gap-2 flex items-center">
              <Plus className="h-4 w-4" />
              Create New Website
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
