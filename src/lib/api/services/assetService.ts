
import { BaseService } from './baseService';
import { ApiResponse } from '../types';
import { supabase, withTimeout, errorInterceptor } from '../client';
import { Database } from '@/integrations/supabase/types';

// Explicitly use the Row type from Database for clarity
type AssetRow = Database['public']['Tables']['assets']['Row'];

class AssetsService extends BaseService<'assets'> {
  constructor() {
    super('assets');
  }

  /**
   * Get assets for a specific site
   * @param siteId Site ID
   */
  async getSiteAssets(siteId: string): Promise<ApiResponse<AssetRow[]>> {
    try {
      const result = await withTimeout<AssetRow[]>(
        supabase
          .from(this.tableName)
          .select('*')
          .eq('site_id', siteId)
          .order('created_at', { ascending: false })
      );

      if (result.error) throw result.error;

      return { data: result.data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Upload a file as an asset for a site
   * @param siteId Site ID
   * @param file File to upload
   */
  async uploadAsset(siteId: string, file: File): Promise<ApiResponse<AssetRow>> {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${siteId}/${Date.now()}-${file.name}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('site_assets')
        .upload(filePath, file, { upsert: false });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('site_assets')
        .getPublicUrl(filePath);
      
      const assetUrl = urlData.publicUrl;
      
      // Save asset info to the database
      const result = await withTimeout<AssetRow>(
        supabase
          .from(this.tableName)
          .insert({
            name: file.name,
            site_id: siteId,
            type: file.type,
            url: assetUrl,
            size: file.size
          })
          .select()
          .maybeSingle()
      );

      if (result.error) throw result.error;

      return { data: result.data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Delete an asset
   * @param assetId Asset ID
   */
  async deleteAsset(assetId: string): Promise<ApiResponse<void>> {
    try {
      // Get the asset to get the URL
      const assetResult = await withTimeout<AssetRow>(
        supabase
          .from(this.tableName)
          .select('*')
          .eq('id', assetId)
          .maybeSingle()
      );
      
      if (assetResult.error) throw assetResult.error;
      if (!assetResult.data) throw new Error('Asset not found');
      
      // Extract the file path from the URL
      const urlParts = assetResult.data.url.split('/');
      const filePath = `${assetResult.data.site_id}/${urlParts[urlParts.length - 1]}`;
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('site_assets')
        .remove([filePath]);
        
      if (storageError) throw storageError;
      
      // Delete from database
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', assetId);
      
      if (error) throw error;

      return { data: undefined, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }
}

export const assetsService = new AssetsService();
