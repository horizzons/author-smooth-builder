
import { inferAsyncReturnType } from '@trpc/server';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/auth';

export async function createContext({ req, res }: { req: Request; res: Response }) {
  let user: User | null = null;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      user = {
        id: session.user.id,
        email: session.user.email || '',
      };
    }
  } catch (error) {
    console.error('Error getting user session:', error);
  }

  return {
    user,
    supabase,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
