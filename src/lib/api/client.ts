
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SupabaseClient } from '@supabase/supabase-js';

// Define a generic type for Supabase query results
type SupabaseQueryResult<T = any> = {
  data: T | null;
  error: Error | null;
};

// API request timeout in milliseconds
const DEFAULT_TIMEOUT = 30000;

/**
 * Global request interceptor
 * @param config Request configuration
 */
const requestInterceptor = async (config: any) => {
  // You can modify the request config here
  console.log('API Request:', config);
  return config;
};

/**
 * Global response interceptor
 * @param response API response
 */
const responseInterceptor = async (response: any) => {
  // You can modify the response here
  console.log('API Response:', response);
  return response;
};

/**
 * Global error interceptor
 * @param error Error object
 */
const errorInterceptor = async (error: any) => {
  console.error('API Error:', error);
  
  // Determine the error message
  let errorMessage = 'An unexpected error occurred';
  
  if (error.message) {
    errorMessage = error.message;
  } else if (error.error_description) {
    errorMessage = error.error_description;
  }
  
  // Show toast notification for errors
  toast({
    title: 'Error',
    description: errorMessage,
    variant: 'destructive',
  });
  
  // Re-throw the error for further handling
  throw error;
};

/**
 * API timeout handler that works with Supabase queries
 * @param promise Promise or Supabase query to wrap with timeout
 * @param timeout Timeout in milliseconds
 */
const withTimeout = <T>(
  queryBuilder: any,
  timeout = DEFAULT_TIMEOUT
): Promise<SupabaseQueryResult<T>> => {
  // If the queryBuilder is a Supabase query, call .then() to convert it to a Promise
  const queryPromise = queryBuilder && typeof queryBuilder.then === 'function' 
    ? queryBuilder 
    : queryBuilder.then();
  
  const timeoutPromise = new Promise<SupabaseQueryResult<T>>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request timeout'));
    }, timeout);
  });
  
  return Promise.race([queryPromise, timeoutPromise]);
};

export { 
  supabase,
  requestInterceptor,
  responseInterceptor,
  errorInterceptor,
  withTimeout,
  type SupabaseQueryResult
};
