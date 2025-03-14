import { router, protectedProcedure } from '../trpc';
import { updateProfileSchema } from '../schemas';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const profilesRouter = router({
  // Get the current user's profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    try {
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
    } catch (error: any) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message || 'Failed to fetch profile',
        cause: error,
      });
    }
  }),

  // Update the user's profile
  updateProfile: protectedProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      try {
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
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to update profile',
          cause: error,
        });
      }
    }),
    
  // Upload avatar
  uploadAvatar: protectedProcedure
    .input(z.object({
      fileBase64: z.string(),
      fileType: z.string(),
      fileName: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const fileExt = input.fileName.split('.').pop();
        const filePath = `${ctx.user.id}/avatar.${fileExt}`;
        
        // Convert base64 to blob
        const base64Data = input.fileBase64.split(',')[1];
        const blob = Buffer.from(base64Data, 'base64');
        
        // Upload the file
        const { error: uploadError } = await ctx.supabase.storage
          .from('site_assets')
          .upload(filePath, blob, {
            contentType: input.fileType,
            upsert: true
          });
        
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = ctx.supabase.storage
          .from('site_assets')
          .getPublicUrl(filePath);
        
        const avatarUrl = urlData.publicUrl;
        
        // Update the profile with the new avatar URL
        const { data, error } = await ctx.supabase
          .from('profiles')
          .update({
            avatar_url: avatarUrl,
          })
          .eq('id', ctx.user.id)
          .select()
          .maybeSingle();
          
        if (error) throw error;
        
        return {
          avatarUrl,
          profile: {
            id: data?.id || ctx.user.id,
            firstName: data?.first_name || null,
            lastName: data?.last_name || null,
            avatarUrl: data?.avatar_url || null,
          }
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to upload avatar',
          cause: error,
        });
      }
    }),
});
