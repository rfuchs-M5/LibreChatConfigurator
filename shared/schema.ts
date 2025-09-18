import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// Configuration categories and their settings
export const configurationSchema = z.object({
  // Global Core Settings
  configVer: z.string().default("0.8.0-rc3"),
  cache: z.boolean().default(true),
  fileStrategy: z.enum(["local", "S3", "Azure Blob", "Firebase"]).default("local"),
  secureImageLinks: z.boolean().default(false),
  imageOutputType: z.enum(["url", "base64"]).default("url"),
  enableConversations: z.boolean().default(true),
  enableRegistration: z.boolean().default(true),

  // UI/Visibility Settings
  showModelSelect: z.boolean().default(true),
  showParameters: z.boolean().default(true),
  showSidePanel: z.boolean().default(true),
  showPresets: z.boolean().default(true),
  showPrompts: z.boolean().default(true),
  showBookmarks: z.boolean().default(true),
  showMultiConvo: z.boolean().default(false),
  showAgents: z.boolean().default(true),
  showWebSearch: z.boolean().default(true),
  showFileSearch: z.boolean().default(true),
  showFileCitations: z.boolean().default(true),
  showRunCode: z.boolean().default(true),
  customWelcome: z.string().optional(),

  // Model Specifications
  modelSpecs: z.boolean().default(false),
  enforceModelSpecs: z.boolean().default(false),
  defaultModel: z.string().default("gpt-4"),
  addedEndpoints: z.boolean().default(true),

  // Endpoint Defaults
  endpointDefaults: z.object({
    streaming: z.boolean().default(true),
    titling: z.boolean().default(true),
    titleModel: z.string().default("gpt-3.5-turbo"),
  }).default({}),

  // Agent Configuration
  agentDefaultRecursionLimit: z.number().min(1).max(50).default(5),
  agentMaxRecursionLimit: z.number().min(1).max(100).default(10),
  agentAllowedProviders: z.array(z.string()).default(["openAI"]),
  agentAllowedCapabilities: z.array(z.string()).default([
    "execute_code", 
    "web_search", 
    "file_search"
  ]),
  agentCitationsTotalLimit: z.number().min(1).max(100).default(10),
  agentCitationsPerFileLimit: z.number().min(1).max(20).default(3),
  agentCitationsThreshold: z.number().min(0).max(1).default(0.7),

  // File Configuration
  filesMaxSizeMB: z.number().min(1).max(1000).default(10),
  filesAllowedMimeTypes: z.array(z.string()).default([
    "text/plain",
    "application/pdf", 
    "image/jpeg",
    "image/png"
  ]),
  filesMaxFilesPerRequest: z.number().min(1).max(20).default(5),
  filesClientResizeImages: z.boolean().default(true),

  // Rate Limits
  rateLimitsPerUser: z.number().min(1).max(10000).default(100),
  rateLimitsPerIP: z.number().min(1).max(10000).default(500),
  rateLimitsUploads: z.number().min(1).max(1000).default(50),
  rateLimitsImports: z.number().min(1).max(1000).default(10),
  rateLimitsTTS: z.number().min(1).max(1000).default(100),
  rateLimitsSTT: z.number().min(1).max(1000).default(100),

  // Authentication
  authAllowedDomains: z.array(z.string()).default([]),
  authSocialLogins: z.array(z.string()).default([]),
  authLoginOrder: z.array(z.string()).default(["email"]),

  // Memory System
  memoryEnabled: z.boolean().default(false),
  memoryPersonalization: z.boolean().default(false),
  memoryWindowSize: z.number().min(1000).max(100000).default(4000),
  memoryMaxTokens: z.number().min(1000).max(50000).default(10000),
  memoryAgent: z.string().default("openAI"),

  // Actions/Tools
  actionsAllowedDomains: z.array(z.string()).default([]),

  // Temporary Chats
  temporaryChatsRetentionHours: z.number().min(1).max(8760).default(720),

  // OCR Configuration
  ocrProvider: z.enum(["mistral", "custom"]).default("mistral"),
  ocrModel: z.string().default("mistral-7b"),
  ocrApiBase: z.string().optional(),
  ocrApiKey: z.string().optional(),

  // Search Configuration
  searchProvider: z.enum(["Serper", "SearXNG", "LinkUp"]).default("Serper"),
  searchScraper: z.enum(["Firecrawl", "Serper"]).default("Serper"),
  searchReranker: z.enum(["Jina", "Cohere"]).default("Jina"),
  searchSafeSearch: z.boolean().default(true),
  searchTimeout: z.number().min(1000).max(60000).default(10000),
  
  // Search API Keys
  serperApiKey: z.string().optional(),
  linkupApiKey: z.string().optional(),
  firecrawlApiKey: z.string().optional(),
  jinaApiKey: z.string().optional(),
  cohereApiKey: z.string().optional(),

  // MCP Servers
  mcpServers: z.array(z.object({
    name: z.string(),
    type: z.enum(["stdio", "websocket", "SSE", "streamable-http"]),
    url: z.string().optional(),
    timeout: z.number().default(30000),
    headers: z.record(z.string()).default({}),
    env: z.record(z.string()).default({}),
    instructions: z.string().optional(),
  })).default([]),

  // Security Configuration (Environment Variables)
  host: z.string().default("0.0.0.0"),
  port: z.number().min(1).max(65535).default(3080),
  jwtSecret: z.string().min(32),
  jwtRefreshSecret: z.string().min(32),
  credsKey: z.string().length(32),
  credsIV: z.string().length(16),
  openaiApiKey: z.string().optional(),

  // Database Configuration
  mongoUri: z.string().optional(),
  redisUri: z.string().optional(),
  mongoRootUsername: z.string().default("admin"),
  mongoRootPassword: z.string().default("password123"),
  mongoDbName: z.string().default("LibreChat"),

  // Session Configuration
  sessionExpiry: z.number().default(900000), // 15 minutes in ms
  refreshTokenExpiry: z.number().default(604800000), // 7 days in ms
  debugLogging: z.boolean().default(false),
  cdnProvider: z.string().optional(),
});

export type Configuration = z.infer<typeof configurationSchema>;

// Profile configuration schema (relaxed validation for sensitive fields)
export const profileConfigurationSchema = configurationSchema.omit({
  jwtSecret: true,
  jwtRefreshSecret: true,
  credsKey: true,
  credsIV: true,
}).extend({
  // Make these fields optional for profile storage since they're environment variables
  jwtSecret: z.string().optional(),
  jwtRefreshSecret: z.string().optional(),
  credsKey: z.string().optional(),
  credsIV: z.string().optional(),
});

export const configurationProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  configuration: profileConfigurationSchema,
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type ConfigurationProfile = z.infer<typeof configurationProfileSchema>;

export const insertConfigurationProfileSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  configuration: profileConfigurationSchema,
});

export type InsertConfigurationProfile = z.infer<typeof insertConfigurationProfileSchema>;

// Validation status for each category
export const validationStatusSchema = z.object({
  category: z.string(),
  status: z.enum(["valid", "invalid", "pending"]),
  settingsValid: z.number(),
  settingsTotal: z.number(),
  errors: z.array(z.string()).default([]),
});

export type ValidationStatus = z.infer<typeof validationStatusSchema>;

// Package generation configuration schema (relaxed validation for sensitive fields)
export const packageConfigurationSchema = configurationSchema.omit({
  jwtSecret: true,
  jwtRefreshSecret: true,
  credsKey: true,
  credsIV: true,
}).extend({
  // Make these fields optional for package generation since they're environment variables
  jwtSecret: z.string().optional(),
  jwtRefreshSecret: z.string().optional(),
  credsKey: z.string().optional(),
  credsIV: z.string().optional(),
});

// Package generation request
export const packageGenerationSchema = z.object({
  configuration: packageConfigurationSchema,
  includeFiles: z.array(z.enum([
    "env",
    "yaml", 
    "docker-compose",
    "install-script",
    "readme"
  ])).default(["env", "yaml", "docker-compose", "install-script", "readme"]),
});

export type PackageGenerationRequest = z.infer<typeof packageGenerationSchema>;

// Deployment schemas
export const deploymentStatusSchema = z.enum([
  "pending",     // Deployment initiated but not started
  "building",    // Building Docker image and preparing deployment
  "deploying",   // Actively deploying to cloud platform
  "running",     // Successfully deployed and running
  "failed",      // Deployment failed
  "stopped",     // Manually stopped or crashed
  "updating"     // Updating existing deployment
]);

export type DeploymentStatus = z.infer<typeof deploymentStatusSchema>;

export const deploymentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  
  // Configuration and profile references
  configurationProfileId: z.string(),
  configuration: packageConfigurationSchema,
  
  // Deployment details
  status: deploymentStatusSchema,
  platform: z.enum(["railway", "vercel", "digitalocean"]).default("railway"),
  
  // Cloud platform specific IDs
  platformProjectId: z.string().optional(),
  platformServiceId: z.string().optional(),
  platformDeploymentId: z.string().optional(),
  
  // URLs and access
  publicUrl: z.string().optional(),
  adminUrl: z.string().optional(),
  
  // Deployment metadata
  region: z.string().default("us-west-1"),
  resourcePlan: z.enum(["starter", "developer", "pro"]).default("starter"),
  
  // Status tracking
  deploymentLogs: z.array(z.string()).default([]),
  lastHealthCheck: z.date().optional(),
  uptime: z.number().default(0), // in seconds
  
  // Timestamps
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  deployedAt: z.date().optional(),
});

export type Deployment = z.infer<typeof deploymentSchema>;

export const insertDeploymentSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().optional(),
  configurationProfileId: z.string(),
  configuration: packageConfigurationSchema,
  platform: z.enum(["railway", "vercel", "digitalocean"]).default("railway"),
  region: z.string().default("us-west-1"),
  resourcePlan: z.enum(["starter", "developer", "pro"]).default("starter"),
});

export type InsertDeployment = z.infer<typeof insertDeploymentSchema>;

export const updateDeploymentSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().optional(),
  status: deploymentStatusSchema.optional(),
  platformProjectId: z.string().optional(),
  platformServiceId: z.string().optional(),
  platformDeploymentId: z.string().optional(),
  publicUrl: z.string().optional(),
  adminUrl: z.string().optional(),
  deploymentLogs: z.array(z.string()).optional(),
  lastHealthCheck: z.date().optional(),
  uptime: z.number().optional(),
  deployedAt: z.date().optional(),
});

export type UpdateDeployment = z.infer<typeof updateDeploymentSchema>;

// Deployment request for creating new deployments
export const deploymentRequestSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().optional(),
  configurationProfileId: z.string(),
  platform: z.enum(["railway", "vercel", "digitalocean"]).default("railway"),
  region: z.string().default("us-west-1"),
  resourcePlan: z.enum(["starter", "developer", "pro"]).default("starter"),
  
  // Environment overrides (optional)
  environmentOverrides: z.record(z.string()).optional(),
});

export type DeploymentRequest = z.infer<typeof deploymentRequestSchema>;
