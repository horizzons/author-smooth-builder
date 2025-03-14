
import { BaseService } from './baseService';
import { TemplateService, ApiResponse } from '../types';
import { supabase, withTimeout, errorInterceptor } from '../client';

class TemplatesService extends BaseService<TemplateService> {
  constructor() {
    super('templates');
  }

  /**
   * Get templates by category
   * @param category Template category
   */
  async getTemplatesByCategory(category: string): Promise<ApiResponse<TemplateService[]>> {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from(this.tableName)
          .select('*')
          .eq('category', category)
      );

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Get free templates
   */
  async getFreeTemplates(): Promise<ApiResponse<TemplateService[]>> {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from(this.tableName)
          .select('*')
          .eq('is_premium', false)
      );

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }

  /**
   * Get premium templates
   */
  async getPremiumTemplates(): Promise<ApiResponse<TemplateService[]>> {
    try {
      const { data, error } = await withTimeout(
        supabase
          .from(this.tableName)
          .select('*')
          .eq('is_premium', true)
      );

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }
}

export const templatesService = new TemplatesService();
