
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
      const result = await withTimeout(
        supabase
          .from(this.tableName as 'templates')
          .select('*')
          .eq('category', category)
      );

      if (result.error) throw result.error;

      return { data: result.data, error: null };
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
      const result = await withTimeout(
        supabase
          .from(this.tableName as 'templates')
          .select('*')
          .eq('is_premium', false)
      );

      if (result.error) throw result.error;

      return { data: result.data, error: null };
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
      const result = await withTimeout(
        supabase
          .from(this.tableName as 'templates')
          .select('*')
          .eq('is_premium', true)
      );

      if (result.error) throw result.error;

      return { data: result.data, error: null };
    } catch (error: any) {
      errorInterceptor(error);
      return { data: null, error };
    }
  }
}

export const templatesService = new TemplatesService();
