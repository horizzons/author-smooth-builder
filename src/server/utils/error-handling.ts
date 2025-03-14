
import { TRPCError } from '@trpc/server';
import { ApiErrorType } from '@/lib/api/types';

/**
 * Standardizes error handling for tRPC procedures
 * @param error The error to handle
 * @param defaultMessage Default message to use if none is provided
 */
export function handleTRPCError(error: unknown, defaultMessage: string = 'An unexpected error occurred'): never {
  console.error('TRPC Error:', error);
  
  // If it's already a TRPCError, just throw it
  if (error instanceof TRPCError) {
    throw error;
  }
  
  // Handle generic Error objects
  if (error instanceof Error) {
    // Handle specific error codes from Supabase
    if ('code' in error && typeof error.code === 'string') {
      const code = error.code;
      
      if (code === 'PGRST116') {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Resource not found',
          cause: error,
        });
      }
      
      if (code.startsWith('PGRST')) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message || 'Invalid request',
          cause: error,
        });
      }
      
      if (code.startsWith('23')) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Database constraint violation',
          cause: error,
        });
      }
      
      if (code === '42501') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Insufficient privileges',
          cause: error,
        });
      }
      
      if (code === 'ECONNABORTED') {
        throw new TRPCError({
          code: 'TIMEOUT',
          message: 'Request timeout',
          cause: error,
        });
      }
    }
    
    // Handle by message patterns
    const message = error.message.toLowerCase();
    
    if (message.includes('not found') || message.includes('does not exist')) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: error.message,
        cause: error,
      });
    }
    
    if (message.includes('duplicate') || message.includes('already exists')) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: error.message,
        cause: error,
      });
    }
    
    if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: error.message,
        cause: error,
      });
    }
    
    // Default to internal server error
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: error.message || defaultMessage,
      cause: error,
    });
  }
  
  // For totally unknown errors
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: defaultMessage,
    cause: error,
  });
}
