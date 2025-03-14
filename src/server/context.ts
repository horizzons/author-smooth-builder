
import { inferAsyncReturnType } from '@trpc/server';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/auth';
import { TRPCError } from '@trpc/server';

interface CreateContextOptions {
  req: Request;
  res: Response;
}

/**
 * Creates context for tRPC procedures
 */
export async function createContext({ req, res }: CreateContextOptions) {
  let user: User | null = null;

  try {
    // Get the session from Supabase
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting user session:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to authenticate user',
        cause: error,
      });
    }
    
    if (session?.user) {
      user = {
        id: session.user.id,
        email: session.user.email || '',
      };
      
      // Fetch additional user data if needed
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .maybeSingle();
          
        if (profile) {
          user.firstName = profile.first_name || undefined;
          user.lastName = profile.last_name || undefined;
          user.avatarUrl = profile.avatar_url || undefined;
        }
      } catch (profileError) {
        console.error('Error fetching user profile:', profileError);
      }
    }
  } catch (error) {
    console.error('Error in context creation:', error);
  }

  return {
    user,
    supabase,
    req,
    res,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
