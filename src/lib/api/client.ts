
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
 * API timeout handler
 * @param promise Promise to wrap with timeout
 * @param timeout Timeout in milliseconds
 */
const withTimeout = (promise: Promise<any>, timeout = DEFAULT_TIMEOUT) => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request timeout'));
    }, timeout);
  });
  
  return Promise.race([promise, timeoutPromise]);
};

export { 
  supabase,
  requestInterceptor,
  responseInterceptor,
  errorInterceptor,
  withTimeout
};
