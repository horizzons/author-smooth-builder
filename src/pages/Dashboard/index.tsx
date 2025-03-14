
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Site = {
  id: string;
  name: string;
  subdomain: string;
  created_at: string;
};

const Dashboard: React.FC = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('sites')
          .select('id, name, subdomain, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setSites(data || []);
      } catch (error: any) {
        console.error('Error fetching sites:', error);
        toast({
          variant: "destructive",
          title: "Failed to load sites",
          description: error.message || "An unexpected error occurred",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session.user) {
      fetchSites();
    }
  }, [session.user, toast]);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="p-4 rounded-full bg-primary/10 mb-4">
        <PlusCircle className="w-8 h-8 text-primary" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">Create your first site</h3>
      <p className="mb-6 text-muted-foreground">Get started by creating your author website.</p>
      <Button asChild>
        <Link to="/sites/new">Create New Site</Link>
      </Button>
    </div>
  );

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/sites/new">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Site
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="animate-pulse bg-muted h-32" />
              <CardContent className="p-4">
                <div className="h-4 mb-2 rounded animate-pulse bg-muted w-3/4"></div>
                <div className="h-3 rounded animate-pulse bg-muted w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sites.length === 0 ? (
        <Card className="border-dashed">{renderEmptyState()}</Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Card key={site.id}>
              <CardHeader>
                <CardTitle>{site.name}</CardTitle>
                <CardDescription>
                  {site.subdomain}.authorcraft.app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created on {new Date(site.created_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link to={`/sites/${site.id}`}>View</Link>
                </Button>
                <Button asChild>
                  <Link to={`/sites/${site.id}/editor`}>Edit</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
