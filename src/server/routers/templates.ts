import { router, publicProcedure } from '../trpc';
import { idSchema, templateFilterSchema } from '../schemas';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const templatesRouter = router({
  // Get all templates
  getTemplates: publicProcedure
    .input(templateFilterSchema.optional())
    .query(async ({ ctx, input }) => {
      try {
        let query = ctx.supabase
          .from('templates')
          .select('*')
          .order('name');
          
        // Apply filters if provided
        if (input?.category) {
          query = query.eq('category', input.category);
        }
        
        if (input?.isPremium !== undefined) {
          query = query.eq('is_premium', input.isPremium);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to fetch templates',
          cause: error,
        });
      }
    }),

  // Get template by ID
  getTemplateById: publicProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { data, error } = await ctx.supabase
          .from('templates')
          .select('*')
          .eq('id', input.id)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Template not found',
          });
        }
        
        return data;
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to fetch template',
          cause: error,
        });
      }
    }),

  // Get templates by category
  getTemplatesByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { data, error } = await ctx.supabase
          .from('templates')
          .select('*')
          .eq('category', input.category)
          .order('name');

        if (error) throw error;
        return data;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to fetch templates by category',
          cause: error,
        });
      }
    }),
});
