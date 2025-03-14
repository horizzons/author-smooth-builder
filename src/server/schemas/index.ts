
import { z } from 'zod';

// Reusable schemas
export const idSchema = z.object({
  id: z.string().uuid(),
});

export const paginationSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().min(1).max(100).optional().default(10),
});

export const filterSchema = z.record(z.any()).optional();

export const orderBySchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']).default('asc'),
}).optional();

// Site-related schemas
export const subdomainSchema = z.object({
  subdomain: z.string().min(3).max(63).regex(/^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/, {
    message: "Subdomain must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen"
  }),
});

export const createSiteSchema = z.object({
  name: z.string().min(1).max(255),
  subdomain: subdomainSchema.shape.subdomain,
  templateId: z.string().uuid().optional(),
});

export const updateSiteSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  templateId: z.string().uuid().optional(),
});

// Profile-related schemas
export const updateProfileSchema = z.object({
  firstName: z.string().max(255).optional(),
  lastName: z.string().max(255).optional(),
  avatarUrl: z.string().url().optional().nullable(),
});

// Template-related schemas
export const templateFilterSchema = z.object({
  category: z.string().optional(),
  isPremium: z.boolean().optional(),
});

// Asset-related schemas
export const assetSchema = z.object({
  siteId: z.string().uuid(),
  fileBase64: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number().optional(),
});
