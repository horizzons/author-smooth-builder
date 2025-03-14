
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
    }
    
    return {
      ...shape,
      data: {
        ...shape.data,
        type: errorType,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
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
  
  // Check if user is admin here - this is a placeholder
  // You would implement proper role checking based on your database schema
  const isUserAdmin = false; // Replace with actual admin check
  
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
