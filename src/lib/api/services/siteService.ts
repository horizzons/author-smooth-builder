
import { BaseService } from './baseService';
import { SiteService as SiteServiceType, ApiResponse } from '../types';
import { supabase, withTimeout, errorInterceptor } from '../client';

class SitesService extends BaseService<SiteServiceType> {
  constructor() {
    super('sites');
  }

  /**
   * Get sites for the current user
   */
  async getUserSites(): Promise<ApiResponse<SiteServiceType[]>> {
    try {
      const result = await withTimeout<SiteServiceType[]>(
        supabase
          .from(this.tableName)
          .select('*')
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
   * Check if a subdomain is available
   * @param subdomain Subdomain to check
   */
  async checkSubdomainAvailability(subdomain: string): Promise<ApiResponse<boolean>> {
    try {
      const result = await withTimeout<any>(
        supabase
          .from(this.tableName)
          .select('id')
          .eq('subdomain', subdomain)
          .maybeSingle()
      );

      if (result.error) throw result.error;

      return { data: !result.data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }
}

export const sitesService = new SitesService();
