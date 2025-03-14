
import { router, protectedProcedure } from '../trpc';
import { createSiteSchema, idSchema, subdomainSchema, updateSiteSchema } from '../schemas';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const sitesRouter = router({
  getUserSites: protectedProcedure.query(async ({ ctx }) => {
    try {
      const { data, error } = await ctx.supabase
        .from('sites')
        .select('*')
        .eq('user_id', ctx.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to fetch user sites',
        cause: error,
      });
    }
  }),

  checkSubdomain: protectedProcedure
    .input(subdomainSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { data, error } = await ctx.supabase
          .from('sites')
          .select('id')
          .eq('subdomain', input.subdomain)
          .maybeSingle();

        if (error) throw error;
        return !data;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to check subdomain availability',
          cause: error,
        });
      }
    }),

  getSiteById: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { data, error } = await ctx.supabase
          .from('sites')
          .select('*')
          .eq('id', input.id)
          .eq('user_id', ctx.user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Site not found',
          });
        }
        
        return data;
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to fetch site',
          cause: error,
        });
      }
    }),

  createSite: protectedProcedure
    .input(createSiteSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if subdomain is available
        const { data: existingSite } = await ctx.supabase
          .from('sites')
          .select('id')
          .eq('subdomain', input.subdomain)
          .maybeSingle();
          
        if (existingSite) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Subdomain is already taken',
          });
        }
        
        const { data, error } = await ctx.supabase
          .from('sites')
          .insert({
            name: input.name,
            subdomain: input.subdomain,
            template_id: input.templateId,
            user_id: ctx.user.id,
          })
          .select()
          .maybeSingle();

        if (error) throw error;
        return data;
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to create site',
          cause: error,
        });
      }
    }),

  updateSite: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      ...updateSiteSchema.shape,
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...updateData } = input;
        
        // Check if site exists and belongs to user
        const { data: existingSite } = await ctx.supabase
          .from('sites')
          .select('id')
          .eq('id', id)
          .eq('user_id', ctx.user.id)
          .maybeSingle();
          
        if (!existingSite) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Site not found or you do not have permission to update it',
          });
        }
        
        const { data, error } = await ctx.supabase
          .from('sites')
          .update({
            name: updateData.name,
            template_id: updateData.templateId,
          })
          .eq('id', id)
          .select()
          .maybeSingle();

        if (error) throw error;
        return data;
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to update site',
          cause: error,
        });
      }
    }),

  deleteSite: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if site exists and belongs to user
        const { data: existingSite } = await ctx.supabase
          .from('sites')
          .select('id')
          .eq('id', input.id)
          .eq('user_id', ctx.user.id)
          .maybeSingle();
          
        if (!existingSite) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Site not found or you do not have permission to delete it',
          });
        }
        
        const { error } = await ctx.supabase
          .from('sites')
          .delete()
          .eq('id', input.id);

        if (error) throw error;
        return { success: true };
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to delete site',
          cause: error,
        });
      }
    }),
});
