import { z } from "zod";

export const validationRules = {
  host: z.string().min(1, "Host is required"),
  port: z.number().min(1, "Port must be greater than 0").max(65535, "Port must be less than 65536"),
  jwtSecret: z.string().min(32, "JWT Secret must be at least 32 characters"),
  jwtRefreshSecret: z.string().min(32, "JWT Refresh Secret must be at least 32 characters"),
  credsKey: z.string().length(32, "Credentials Key must be exactly 32 characters"),
  credsIV: z.string().length(16, "Credentials IV must be exactly 16 characters"),
  openaiApiKey: z.string().optional().refine(
    (val) => !val || val.startsWith("sk-"),
    "OpenAI API Key must start with 'sk-'"
  ),
  agentDefaultRecursionLimit: z.number().min(1).max(50, "Must be between 1 and 50"),
  agentMaxRecursionLimit: z.number().min(1).max(100, "Must be between 1 and 100"),
  filesMaxSizeMB: z.number().min(1).max(1000, "Must be between 1 and 1000 MB"),
  filesMaxFilesPerRequest: z.number().min(1).max(20, "Must be between 1 and 20"),
  rateLimitsPerUser: z.number().min(1).max(10000, "Must be between 1 and 10000"),
  rateLimitsPerIP: z.number().min(1).max(10000, "Must be between 1 and 10000"),
  memoryWindowSize: z.number().min(1000).max(100000, "Must be between 1000 and 100000"),
  memoryMaxTokens: z.number().min(1000).max(50000, "Must be between 1000 and 50000"),
  searchTimeout: z.number().min(1000).max(60000, "Must be between 1000 and 60000 ms"),
  temporaryChatsRetentionHours: z.number().min(1).max(8760, "Must be between 1 and 8760 hours"),
};

export function validateSetting(key: string, value: any): string[] {
  const rule = validationRules[key as keyof typeof validationRules];
  if (!rule) return [];

  try {
    rule.parse(value);
    return [];
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map(err => err.message);
    }
    return ["Invalid value"];
  }
}
