
import { router, protectedProcedure } from '../trpc';
import { idSchema } from '../schemas';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const assetsRouter = router({
  // Get assets for a site
  getSiteAssets: protectedProcedure
    .input(z.object({ siteId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        const { data, error } = await ctx.supabase
          .from('assets')
          .select('*')
          .eq('site_id', input.siteId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to fetch site assets',
          cause: error,
        });
      }
    }),

  // Get a single asset
  getAssetById: protectedProcedure
    .input(idSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { data, error } = await ctx.supabase
          .from('assets')
          .select('*')
          .eq('id', input.id)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Asset not found',
          });
        }
        
        return data;
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to fetch asset',
          cause: error,
        });
      }
    }),

  // Upload a new asset
  uploadAsset: protectedProcedure
    .input(z.object({
      siteId: z.string().uuid(),
      fileBase64: z.string(),
      fileName: z.string(),
      fileType: z.string(),
      fileSize: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if the site belongs to the user
        const { data: site, error: siteError } = await ctx.supabase
          .from('sites')
          .select('id')
          .eq('id', input.siteId)
          .eq('user_id', ctx.user.id)
          .maybeSingle();
          
        if (siteError) throw siteError;
        
        if (!site) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to upload assets to this site',
          });
        }
        
        // Create file path
        const filePath = `${input.siteId}/${Date.now()}-${input.fileName}`;
        
        // Convert base64 to blob
        const base64Data = input.fileBase64.split(',')[1];
        const blob = Buffer.from(base64Data, 'base64');
        
        // Upload the file
        const { error: uploadError, data: uploadData } = await ctx.supabase.storage
          .from('site_assets')
          .upload(filePath, blob, {
            contentType: input.fileType,
            upsert: false
          });
        
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = ctx.supabase.storage
          .from('site_assets')
          .getPublicUrl(filePath);
        
        const assetUrl = urlData.publicUrl;
        
        // Save asset info to the database
        const { data, error } = await ctx.supabase
          .from('assets')
          .insert({
            name: input.fileName,
            site_id: input.siteId,
            type: input.fileType,
            url: assetUrl,
            size: input.fileSize || 0
          })
          .select()
          .maybeSingle();
          
        if (error) throw error;
        
        return data;
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to upload asset',
          cause: error,
        });
      }
    }),

  // Delete an asset
  deleteAsset: protectedProcedure
    .input(idSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Get the asset to check permissions and get the file path
        const { data: asset, error: assetError } = await ctx.supabase
          .from('assets')
          .select('*, sites!inner(user_id)')
          .eq('id', input.id)
          .maybeSingle();
          
        if (assetError) throw assetError;
        
        if (!asset) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Asset not found',
          });
        }
        
        // Check if the user owns the site
        if (asset.sites.user_id !== ctx.user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to delete this asset',
          });
        }
        
        // Extract the file path from the URL
        const urlParts = asset.url.split('/');
        const filePath = `${asset.site_id}/${urlParts[urlParts.length - 1]}`;
        
        // Delete from storage
        const { error: storageError } = await ctx.supabase.storage
          .from('site_assets')
          .remove([filePath]);
          
        if (storageError) throw storageError;
        
        // Delete from database
        const { error } = await ctx.supabase
          .from('assets')
          .delete()
          .eq('id', input.id);

        if (error) throw error;
        
        return { success: true };
      } catch (error: any) {
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to delete asset',
          cause: error,
        });
      }
    }),
});
