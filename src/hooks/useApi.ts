
import { useState, useCallback } from 'react';
import { ApiResponse, ApiError, ApiErrorType } from '@/lib/api/types';
import { useToast } from '@/hooks/use-toast';

interface UseApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  loadingDelay?: number;
}

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
}

/**
 * Custom hook for making API calls with loading and error states
 */
export const useApi = <T>(options: UseApiOptions = {}) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });
  
  const { toast } = useToast();
  
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
    loadingDelay = 0,
  } = options;

  /**
   * Execute an API call with loading state
   */
  const execute = useCallback(
    async <R>(
      apiCall: () => Promise<ApiResponse<R>>,
      customOptions?: Partial<UseApiOptions>
    ): Promise<ApiResponse<R>> => {
      const mergedOptions = { ...options, ...customOptions };
      
      // Set loading state (with optional delay)
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      try {
        // Execute the API call
        const response = await apiCall();
        
        // Handle errors returned from the API
        if (response.error) {
          const apiError = response.error instanceof ApiError
            ? response.error
            : new ApiError(
                response.error.message || 'Unknown error',
                ApiErrorType.UNKNOWN
              );
          
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: apiError,
          }));
          
          // Show error toast if enabled
          if (mergedOptions.showErrorToast) {
            toast({
              title: 'Error',
              description: apiError.message,
              variant: 'destructive',
            });
          }
          
          return response;
        }
        
        // Update state with the response data
        setState((prev) => ({
          ...prev,
          data: response.data as unknown as T,
          isLoading: false,
          error: null,
        }));
        
        // Show success toast if enabled
        if (mergedOptions.showSuccessToast) {
          toast({
            title: 'Success',
            description: mergedOptions.successMessage,
          });
        }
        
        return response;
      } catch (error: any) {
        // Handle unexpected errors
        const apiError = error instanceof ApiError
          ? error
          : new ApiError(
              error.message || 'An unexpected error occurred',
              ApiErrorType.UNKNOWN
            );
        
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: apiError,
        }));
        
        // Show error toast if enabled
        if (mergedOptions.showErrorToast) {
          toast({
            title: 'Error',
            description: apiError.message,
            variant: 'destructive',
          });
        }
        
        return { data: null, error: apiError };
      }
    },
    [options, toast]
  );

  /**
   * Reset the state
   */
  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};
