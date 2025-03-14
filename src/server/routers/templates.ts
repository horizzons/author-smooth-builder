
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const templatesRouter = router({
  // Get all templates
  getTemplates: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from('templates')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  }),

  // Get template by ID
  getTemplateById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('templates')
        .select('*')
        .eq('id', input.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }),

  // Get templates by category
  getTemplatesByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('templates')
        .select('*')
        .eq('category', input.category)
        .order('name');

      if (error) throw error;
      return data;
    }),
});
