
import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';
import superjson from 'superjson';
import { ApiErrorType } from '@/lib/api/types';
import { ZodError } from 'zod';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    let errorType = ApiErrorType.UNKNOWN;
    
    if (error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN') {
      errorType = ApiErrorType.AUTH;
    } else if (error.code === 'BAD_REQUEST' || error instanceof ZodError) {
      errorType = ApiErrorType.VALIDATION;
    } else if (error.code === 'TIMEOUT') {
      errorType = ApiErrorType.TIMEOUT;
    } else if (error.code === 'INTERNAL_SERVER_ERROR') {
      errorType = ApiErrorType.SERVER;
    } else if (error.code === 'NOT_FOUND') {
      errorType = ApiErrorType.NOT_FOUND;
    } else if (error.code === 'CONFLICT') {
      errorType = ApiErrorType.CONFLICT;
    } else if (error.code === 'PARSE_ERROR') {
      errorType = ApiErrorType.VALIDATION;
    }
    
    // Format the error message
    let errorMessage = error.message;
    
    // Handle Zod validation errors specifically
    if (error.code === 'BAD_REQUEST' && error.cause instanceof ZodError) {
      errorMessage = error.cause.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
    }
    
    return {
      ...shape,
      data: {
        ...shape.data,
        type: errorType,
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        zodErrors: error.cause instanceof ZodError ? error.cause.format() : undefined,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

// Auth middleware
const isAuthenticated = middleware(async ({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Admin middleware
const isAdmin = middleware(async ({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  
  // Check if user is admin - we need to modify this since 'role' doesn't exist
  // For now, let's use a hardcoded list of admin emails or IDs
  // In a real application, you would use a dedicated user_roles table
  const ADMIN_EMAILS = ['admin@example.com']; // Replace with actual admin emails
  const isUserAdmin = ADMIN_EMAILS.includes(ctx.user.email);
  
  if (!isUserAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have permission to access this resource',
    });
  }
  
  return next({
    ctx: {
      user: ctx.user,
      isAdmin: true,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthenticated);
export const adminProcedure = t.procedure.use(isAdmin);
