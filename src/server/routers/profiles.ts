
import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const profilesRouter = router({
  // Get the current user's profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from('profiles')
      .select('*')
      .eq('id', ctx.user.id)
      .maybeSingle();

    if (error) throw error;
    
    return {
      id: data?.id || ctx.user.id,
      firstName: data?.first_name || null,
      lastName: data?.last_name || null,
      avatarUrl: data?.avatar_url || null,
      user: {
        id: ctx.user.id,
        email: ctx.user.email,
      }
    };
  }),

  // Update the user's profile
  updateProfile: protectedProcedure
    .input(z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      avatarUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('profiles')
        .update({
          first_name: input.firstName,
          last_name: input.lastName,
          avatar_url: input.avatarUrl,
        })
        .eq('id', ctx.user.id)
        .select()
        .maybeSingle();
        
      if (error) throw error;
      
      return {
        id: data?.id || ctx.user.id,
        firstName: data?.first_name || null,
        lastName: data?.last_name || null,
        avatarUrl: data?.avatar_url || null,
        user: {
          id: ctx.user.id,
          email: ctx.user.email,
        }
      };
    }),
});
