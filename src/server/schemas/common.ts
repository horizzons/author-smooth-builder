
import { z } from 'zod';

// Common ID schema used across multiple endpoints
export const idSchema = z.object({
  id: z.string().uuid(),
});

// Common pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

// Common date range schema
export const dateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Common schemas for site-related operations
export const subdomainSchema = z.object({
  subdomain: z.string().min(3).max(63).regex(/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/),
});

export const createSiteSchema = z.object({
  name: z.string().min(1).max(100),
  subdomain: z.string().min(3).max(63).regex(/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/),
  templateId: z.string().uuid().optional(),
});

export const updateSiteSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  templateId: z.string().uuid().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

// Schemas for profile-related operations
export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  avatarUrl: z.string().url().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

// Schemas for template-related operations
export const templateFilterSchema = z.object({
  category: z.string().optional(),
  isPremium: z.boolean().optional(),
});
