
import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const sitesRouter = router({
  getUserSites: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from('sites')
      .select('*')
      .eq('user_id', ctx.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }),

  checkSubdomain: protectedProcedure
    .input(z.object({ subdomain: z.string() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('sites')
        .select('id')
        .eq('subdomain', input.subdomain)
        .maybeSingle();

      if (error) throw error;
      return !data;
    }),
});
