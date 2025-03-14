
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
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
      mutations: {
        retry: false,
      },
    },
  }));
  
  const [trpcClient] = useState(() => {
    console.log('Initializing TRPC client');
    
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: `${window.location.origin}/api/trpc`,
          fetch: async (url, options) => {
            console.log('TRPC request to:', url);
            try {
              const response = await fetch(url, options);
              if (!response.ok) {
                console.error('TRPC response not OK:', response.status, response.statusText);
              }
              return response;
            } catch (error) {
              console.error('TRPC fetch error:', error);
              throw error;
            }
          },
        }),
      ],
      transformer: superjson,
    });
  });

  console.log('Rendering TRPC providers');
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
