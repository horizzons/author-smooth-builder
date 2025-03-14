
import React, { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { useTrpcMutation, useTrpcQueryState } from '@/hooks/useTrpc';
import { ErrorMessage } from '@/components/ui/error-boundary';
import { Skeleton } from '@/components/ui/skeleton';

export function SitesList() {
  // Update to use getUserSites instead of getAll
  const sitesQuery = trpc.sites.getUserSites.useQuery();
  const { isLoading, error, errorMessage } = useTrpcQueryState(sitesQuery);
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }
  
  if (error) {
    return <ErrorMessage message={errorMessage || 'Failed to load sites'} />;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Sites</h2>
      {sitesQuery.data?.length === 0 ? (
        <p className="text-gray-500">You don't have any sites yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {sitesQuery.data?.map((site) => (
            <li key={site.id} className="py-4">
              <h3 className="font-medium">{site.name}</h3>
              <p className="text-sm text-gray-500">{site.subdomain}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CreateSiteForm() {
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  
  // Example of using our custom mutation hook
  const utils = trpc.useContext();
  
  // Fix: Use the correct approach for tRPC mutations
  const createSiteMutation = useTrpcMutation(
    (input) => {
      const mutation = trpc.sites.createSite.useMutation();
      return mutation.mutateAsync(input);
    },
    {
      showSuccessToast: true,
      successMessage: 'Site created successfully!',
    }
  );
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await createSiteMutation.execute({
      name,
      subdomain,
    });
    
    if (!error) {
      // Reset form
      setName('');
      setSubdomain('');
      
      // Invalidate query cache to refresh the sites list
      // Update to use getUserSites instead of getAll
      utils.sites.getUserSites.invalidate();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Site Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">
          Subdomain
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="subdomain"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            className="block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
          <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
            .yoursite.com
          </span>
        </div>
      </div>
      
      {createSiteMutation.error && (
        <ErrorMessage message={createSiteMutation.error.message} />
      )}
      
      <Button type="submit" disabled={createSiteMutation.isLoading}>
        {createSiteMutation.isLoading ? 'Creating...' : 'Create Site'}
      </Button>
    </form>
  );
}
