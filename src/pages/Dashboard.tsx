
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PenSquare, Plus, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    console.log('Dashboard component mounted');
    // Show welcome toast when dashboard loads
    toast({
      title: "Welcome to your dashboard",
      description: "Manage your author websites from here.",
      duration: 5000,
    });
  }, [toast]);

  return (
    <div className="container py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">My Websites</h1>
        <Button asChild size="default" className="w-full sm:w-auto">
          <Link to="/editor" className="flex items-center gap-2">
            <PenSquare className="h-4 w-4" />
            Open Editor
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">My First Website</h2>
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Published</div>
            </div>
            <p className="text-muted-foreground mb-2">Created 2 days ago</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
              <Globe className="h-3 w-3" /> mysite.authorcraft.com
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">View</Button>
              <Button size="sm" asChild>
                <Link to="/editor">Edit</Link>
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="border rounded-lg border-dashed flex items-center justify-center p-6 min-h-[200px] hover:bg-muted/20 transition-colors">
          <Button variant="outline" asChild className="gap-2 flex items-center h-auto py-4 px-6">
            <Link to="/editor" className="flex flex-col items-center">
              <Plus className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Create New Website</span>
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
