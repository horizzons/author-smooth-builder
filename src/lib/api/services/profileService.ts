
import { BaseService } from './baseService';
import { ApiResponse, ProfileWithUser } from '../types';
import { supabase, withTimeout, errorInterceptor } from '../client';
import { Database } from '@/integrations/supabase/types';
import { User } from '@/types/auth';

// Explicitly use the Row and Update types from Database for clarity
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

class ProfilesService extends BaseService<'profiles'> {
  constructor() {
    super('profiles');
  }

  /**
   * Get the current user's profile
   */
  async getCurrentProfile(): Promise<ApiResponse<ProfileWithUser>> {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user.id) {
        throw new Error('User not authenticated');
      }
      
      const userId = session.session.user.id;
      
      const result = await withTimeout<ProfileRow>(
        supabase
          .from(this.tableName)
          .select('*')
          .eq('id', userId)
          .maybeSingle()
      );

      if (result.error) throw result.error;

      // Transform to match ProfileWithUser type
      const profile: ProfileWithUser = {
        ...result.data,
        user: session.session.user ? {
          id: session.session.user.id,
          email: session.session.user.email || '',
          firstName: result.data.first_name || undefined,
          lastName: result.data.last_name || undefined,
          avatarUrl: result.data.avatar_url || undefined,
        } : null
      };

      return { data: profile, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Update the current user's profile
   * @param profile Profile data to update
   */
  async updateProfile(profileData: { 
    firstName?: string; 
    lastName?: string; 
    avatarUrl?: string; 
  }): Promise<ApiResponse<ProfileWithUser>> {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user.id) {
        throw new Error('User not authenticated');
      }
      
      // Transform to match database column names
      const dbProfile: ProfileUpdate = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        avatar_url: profileData.avatarUrl,
      };
      
      const result = await withTimeout<ProfileRow>(
        supabase
          .from(this.tableName)
          .update(dbProfile)
          .eq('id', session.session.user.id)
          .select()
          .maybeSingle()
      );

      if (result.error) throw result.error;

      // Transform to match ProfileWithUser type
      const updatedProfile: ProfileWithUser = {
        ...result.data,
        user: session.session.user ? {
          id: session.session.user.id,
          email: session.session.user.email || '',
          firstName: result.data.first_name || undefined,
          lastName: result.data.last_name || undefined,
          avatarUrl: result.data.avatar_url || undefined,
        } : null
      };

      return { data: updatedProfile, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Upload a profile avatar
   * @param file File to upload
   */
  async uploadAvatar(file: File): Promise<ApiResponse<string>> {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session?.user.id) {
        throw new Error('User not authenticated');
      }
      
      const userId = session.session.user.id;
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/avatar.${fileExt}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('site_assets')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('site_assets')
        .getPublicUrl(filePath);
      
      const avatarUrl = urlData.publicUrl;
      
      // Update the profile with the new avatar URL
      await this.updateProfile({ avatarUrl });
      
      return { data: avatarUrl, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }
}

export const profilesService = new ProfilesService();
