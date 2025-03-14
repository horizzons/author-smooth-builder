
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/utils/trpc';
import superjson from 'superjson';

interface TRPCProvidersProps {
  children: React.ReactNode;
}

export function TRPCProviders({ children }: TRPCProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      mutations: {
        retry: 0,
      },
    },
  }));
  
  const [trpcClient] = useState(() => {
    // Add debugging logs
    console.log('Initializing TRPC client');
    
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: `${window.location.origin}/api/trpc`,
          // For debugging, log the URL
          fetch: async (url, options) => {
            console.log('TRPC request to:', url);
            try {
              return await fetch(url, options);
            } catch (error) {
              console.error('TRPC fetch error:', error);
              throw error;
            }
          },
          headers: () => {
            // get auth token from localStorage or similar
            const token = localStorage.getItem('authToken');
            return {
              ...token ? { Authorization: `Bearer ${token}` } : {},
              'Content-Type': 'application/json',
            };
          },
        }),
      ],
      transformer: superjson,
    });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
