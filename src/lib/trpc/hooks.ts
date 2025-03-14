
import React, { useState } from 'react';
import { trpc, isTRPCClientError, getTRPCErrorType, getTRPCErrorMessage } from './client';
import { useToast } from '@/hooks/use-toast';
import { TRPCClientError } from '@trpc/client';
import { ApiError, ApiErrorType } from '@/lib/api/types';

interface UseTrpcOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
}

/**
 * Custom hook for handling tRPC mutations with integrated toast notifications
 */
export function useTrpcMutation<TData, TInput>(
  mutationFn: (input: TInput) => Promise<TData>,
  options: UseTrpcOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { toast } = useToast();
  
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
  } = options;
  
  const execute = async (input: TInput): Promise<{ data: TData | null; error: ApiError | null }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await mutationFn(input);
      
      setIsLoading(false);
      
      if (showSuccessToast) {
        toast({
          title: 'Success',
          description: successMessage,
        });
      }
      
      return { data, error: null };
    } catch (err: unknown) {
      setIsLoading(false);
      
      let apiError: ApiError;
      
      if (isTRPCClientError(err)) {
        const errorType = getTRPCErrorType(err);
        const errorMessage = getTRPCErrorMessage(err);
        
        apiError = new ApiError(errorMessage, errorType);
      } else if (err instanceof Error) {
        apiError = new ApiError(err.message, ApiErrorType.UNKNOWN);
      } else {
        apiError = new ApiError('An unknown error occurred', ApiErrorType.UNKNOWN);
      }
      
      setError(apiError);
      
      if (showErrorToast) {
        toast({
          title: 'Error',
          description: apiError.message,
          variant: 'destructive',
        });
      }
      
      return { data: null, error: apiError };
    }
  };
  
  return {
    execute,
    isLoading,
    error,
    reset: () => {
      setIsLoading(false);
      setError(null);
    },
  };
}

/**
 * Returns loading and error states for any trpc query
 */
export function useTrpcQueryState<TData, TError>(query: {
  data?: TData | undefined;
  error: TError | null;
  isLoading: boolean;
  isError: boolean;
}) {
  const { toast } = useToast();
  
  // Show error toast if query fails
  React.useEffect(() => {
    if (query.isError && query.error) {
      const errorMessage = isTRPCClientError(query.error) 
        ? getTRPCErrorMessage(query.error)
        : 'An error occurred while fetching data';
        
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [query.isError, query.error, toast]);
  
  return {
    isLoading: query.isLoading,
    error: query.error,
    errorMessage: query.error ? (
      isTRPCClientError(query.error) ? getTRPCErrorMessage(query.error) : 'Unknown error'
    ) : null,
  };
}
