
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers';
import { inferRouterOutputs, inferRouterInputs } from '@trpc/server';
import { TRPCClientError } from '@trpc/client';
import { ApiErrorType } from '@/lib/api/types';

export const trpc = createTRPCReact<AppRouter>();

// Utility type to infer the output types of the router
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;

// Error handling utilities for tRPC client
export const isTRPCClientError = (error: unknown): error is TRPCClientError<AppRouter> => {
  return error instanceof TRPCClientError;
};

export const getTRPCErrorType = (error: unknown): ApiErrorType => {
  if (!isTRPCClientError(error)) {
    return ApiErrorType.UNKNOWN;
  }
  
  // Check if error.data exists and has a type property
  const errorData = error.data as Record<string, unknown> | undefined;
  if (errorData && typeof errorData.type === 'string') {
    return errorData.type as ApiErrorType;
  }
  
  // Fallback error type detection
  if (error.message.includes('UNAUTHORIZED') || error.message.includes('FORBIDDEN')) {
    return ApiErrorType.AUTH;
  }
  
  if (error.message.includes('TIMEOUT') || error.message.includes('Request timed out')) {
    return ApiErrorType.TIMEOUT;
  }
  
  if (error.message.includes('Network') || error.message.includes('offline')) {
    return ApiErrorType.NETWORK;
  }
  
  if (error.message.includes('BAD_REQUEST') || error.message.includes('Invalid input')) {
    return ApiErrorType.VALIDATION;
  }
  
  if (error.message.includes('INTERNAL_SERVER_ERROR')) {
    return ApiErrorType.SERVER;
  }
  
  return ApiErrorType.UNKNOWN;
};

export const getTRPCErrorMessage = (error: unknown): string => {
  if (!isTRPCClientError(error)) {
    return 'An unexpected error occurred';
  }
  
  // Check if error.data exists and has a message property
  const errorData = error.data as Record<string, unknown> | undefined;
  if (errorData && typeof errorData.message === 'string') {
    return errorData.message;
  }
  
  return error.message || 'An unexpected error occurred';
};
