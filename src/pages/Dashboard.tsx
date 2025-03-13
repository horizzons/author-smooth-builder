import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-4xl font-bold">My Websites</h1>
        <Button asChild>
          <Link to="/editor">
            <Plus className="mr-2 h-4 w-4" />
            Create New Site
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
      </div>
    </div>
  );
};

export default Dashboard;
