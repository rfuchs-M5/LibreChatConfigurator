import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// LibreChat v0.8.0-RC4 Configuration Schema
// Based on librechat.yaml structure version 1.2.8

// Client Image Resize Configuration
const clientImageResizeSchema = z.object({
  enabled: z.boolean().default(true),
  maxWidth: z.number().min(100).max(4096).default(1920),
  maxHeight: z.number().min(100).max(4096).default(1080),
  quality: z.number().min(0.1).max(1.0).default(0.8),
  compressFormat: z.enum(["jpeg", "webp"]).default("jpeg"),
}).optional();

// File Configuration
const fileConfigSchema = z.object({
  endpoints: z.record(z.object({
    fileLimit: z.number().min(1).max(100).default(5),
    fileSizeLimit: z.number().min(1).max(1000).default(10), // MB
    totalSizeLimit: z.number().min(1).max(10000).default(50), // MB
    supportedMimeTypes: z.array(z.string()).optional(),
  })).optional(),
  serverFileSizeLimit: z.number().min(1).max(1000).default(20), // MB
  avatarSizeLimit: z.number().min(1).max(100).default(5), // MB
  clientImageResize: clientImageResizeSchema,
}).optional();

// Rate Limits Configuration
const rateLimitsSchema = z.object({
  fileUploads: z.object({
    ipMax: z.number().min(1).max(10000).default(100),
    ipWindowInMinutes: z.number().min(1).max(1440).default(60),
    userMax: z.number().min(1).max(10000).default(50),
    userWindowInMinutes: z.number().min(1).max(1440).default(60),
  }).optional(),
  conversationsImport: z.object({
    ipMax: z.number().min(1).max(10000).default(100),
    ipWindowInMinutes: z.number().min(1).max(1440).default(60),
    userMax: z.number().min(1).max(10000).default(50),
    userWindowInMinutes: z.number().min(1).max(1440).default(60),
  }).optional(),
  stt: z.object({
    ipMax: z.number().min(1).max(10000).default(100),
    ipWindowInMinutes: z.number().min(1).max(1440).default(1),
    userMax: z.number().min(1).max(10000).default(50),
    userWindowInMinutes: z.number().min(1).max(1440).default(1),
  }).optional(),
  tts: z.object({
    ipMax: z.number().min(1).max(10000).default(100),
    ipWindowInMinutes: z.number().min(1).max(1440).default(1),
    userMax: z.number().min(1).max(10000).default(50),
    userWindowInMinutes: z.number().min(1).max(1440).default(1),
  }).optional(),
}).optional();

// Interface Configuration
const interfaceSchema = z.object({
  customWelcome: z.string().optional(),
  fileSearch: z.boolean().default(true),
  uploadAsText: z.boolean().default(false), // RC4 "Upload as Text" feature
  privacyPolicy: z.object({
    externalUrl: z.string().url().optional(),
    openNewTab: z.boolean().default(true),
  }).optional(),
  termsOfService: z.object({
    externalUrl: z.string().url().optional(),
    openNewTab: z.boolean().default(true),
    modalAcceptance: z.boolean().default(false),
    modalTitle: z.string().optional(),
    modalContent: z.string().optional(),
  }).optional(),
  endpointsMenu: z.boolean().default(true),
  modelSelect: z.boolean().default(true),
  parameters: z.boolean().default(true),
  sidePanel: z.boolean().default(true),
  presets: z.boolean().default(true),
  prompts: z.boolean().default(true),
  bookmarks: z.boolean().default(true),
  multiConvo: z.boolean().default(false),
  agents: z.boolean().default(true),
  peoplePicker: z.object({
    users: z.boolean().default(true),
    groups: z.boolean().default(true),
    roles: z.boolean().default(true),
  }).optional(),
  marketplace: z.object({
    use: z.boolean().default(false),
  }).optional(),
  fileCitations: z.boolean().default(true),
}).optional();

// Registration Configuration
const registrationSchema = z.object({
  socialLogins: z.array(z.enum([
    "github", "google", "discord", "openid", 
    "facebook", "apple", "saml"
  ])).default([]),
  allowedDomains: z.array(z.string()).optional(),
}).optional();

// Actions Configuration
const actionsSchema = z.object({
  allowedDomains: z.array(z.string()).default([]),
}).optional();

// Web Search Configuration with expanded RC4 providers
const webSearchSchema = z.object({
  // API Keys
  serperApiKey: z.string().optional(),
  searxngInstanceUrl: z.string().optional(),
  searxngApiKey: z.string().optional(),
  firecrawlApiKey: z.string().optional(),
  firecrawlApiUrl: z.string().optional(),
  jinaApiKey: z.string().optional(),
  cohereApiKey: z.string().optional(),
  braveApiKey: z.string().optional(), // RC4 addition
  tavilyApiKey: z.string().optional(), // RC4 addition
  
  // Provider Configuration
  searchProvider: z.enum(["serper", "searxng", "brave", "tavily"]).default("serper"),
  scraperType: z.enum(["firecrawl", "serper", "brave"]).default("serper"),
  rerankerType: z.enum(["jina", "cohere"]).default("jina"),
  scraperTimeout: z.number().min(1000).max(60000).default(10000),
  safeSearch: z.boolean().default(true),
}).optional();

// OCR Configuration
const ocrSchema = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().optional(),
  strategy: z.enum(["mistral_ocr", "custom_ocr"]).default("mistral_ocr"),
  mistralModel: z.string().default("pixtral-12b-2409"),
}).optional();

// Speech-to-Text (STT) Configuration
const sttSchema = z.object({
  provider: z.enum(["openai", "azure", "google", "deepgram", "assemblyai", "local"]).default("openai"),
  model: z.string().default("whisper-1"),
  apiKey: z.string().optional(),
  baseURL: z.string().optional(),
  language: z.string().optional(),
  streaming: z.boolean().default(false),
  punctuation: z.boolean().default(true),
  profanityFilter: z.boolean().default(false),
}).optional();

// Text-to-Speech (TTS) Configuration
const ttsSchema = z.object({
  provider: z.enum(["openai", "azure", "google", "elevenlabs", "aws", "local"]).default("openai"),
  model: z.string().default("tts-1"),
  voice: z.string().default("alloy"),
  apiKey: z.string().optional(),
  baseURL: z.string().optional(),
  speed: z.number().min(0.25).max(4.0).default(1.0),
  quality: z.enum(["standard", "hd"]).default("standard"),
  streaming: z.boolean().default(false),
}).optional();

// MCP Servers Configuration
const mcpServerSchema = z.object({
  type: z.enum(["stdio", "websocket", "sse", "streamable-http"]).optional(),
  command: z.string().optional(),
  args: z.array(z.string()).optional(),
  url: z.string().optional(),
  timeout: z.number().min(1000).max(600000).default(30000),
  initTimeout: z.number().min(1000).max(600000).default(10000),
  headers: z.record(z.string()).optional(),
  serverInstructions: z.union([z.boolean(), z.string()]).optional(),
  iconPath: z.string().optional(),
  chatMenu: z.boolean().optional(),
  customUserVars: z.record(z.object({
    title: z.string(),
    description: z.string().optional(),
    required: z.boolean().default(false),
    type: z.enum(["text", "password", "number"]).default("text"),
  })).optional(),
});

const mcpServersSchema = z.union([
  z.record(mcpServerSchema),
  z.array(mcpServerSchema.extend({
    name: z.string()
  }))
]).optional();

// Base Provider Configuration Schema for RC4 Unified Endpoints
const baseProviderSchema = z.object({
  disabled: z.boolean().default(false),
  apiKey: z.string().optional(),
  baseURL: z.string().optional(),
  models: z.object({
    default: z.array(z.string()).default([]),
    fetch: z.boolean().default(false),
    userIdQuery: z.boolean().default(false),
  }).optional(),
  titleConvo: z.boolean().default(true),
  titleModel: z.string().optional(),
  titleMethod: z.enum(["completion", "functions"]).default("completion"),
  summarize: z.boolean().default(false),
  summaryModel: z.string().optional(),
  forcePrompt: z.boolean().default(false),
  modelDisplayLabel: z.string().optional(),
  addParams: z.record(z.any()).default({}),
  dropParams: z.array(z.string()).default([]),
  headers: z.record(z.string()).default({}),
  iconURL: z.string().optional(),
  order: z.number().optional(),
});

// OpenAI Provider Configuration
const openAISchema = baseProviderSchema.extend({
  endpoints: z.object({
    completions: z.string().default("/v1/chat/completions"),
    models: z.string().default("/v1/models"),
  }).optional(),
  maxOutputTokens: z.number().min(1).max(100000).optional(),
  addModelMapping: z.record(z.string()).optional(),
});

// Azure OpenAI Provider Configuration
const azureSchema = baseProviderSchema.extend({
  deploymentName: z.string().optional(),
  apiVersion: z.string().default("2023-12-01-preview"),
  instanceName: z.string().optional(),
  addModelMapping: z.record(z.string()).optional(),
  additionalOptions: z.record(z.any()).optional(),
});

// Google Provider Configuration
const googleSchema = baseProviderSchema.extend({
  serviceKey: z.string().optional(),
  location: z.string().default("us-central1"),
  projectId: z.string().optional(),
  additionalOptions: z.record(z.any()).optional(),
});

// Anthropic Provider Configuration
const anthropicSchema = baseProviderSchema.extend({
  maxOutputTokens: z.number().min(1).max(8192).optional(),
  addModelMapping: z.record(z.string()).optional(),
});

// AWS Bedrock Provider Configuration
const bedrockSchema = baseProviderSchema.extend({
  region: z.string().default("us-east-1"),
  accessKeyId: z.string().optional(),
  secretAccessKey: z.string().optional(),
  sessionToken: z.string().optional(),
  profile: z.string().optional(),
  addModelMapping: z.record(z.string()).optional(),
});

// Generic Provider Schema for other providers
const genericProviderSchema = baseProviderSchema.extend({
  name: z.string().optional(),
  additionalOptions: z.record(z.any()).optional(),
});

// Custom Endpoint Configuration (for backwards compatibility)
const customEndpointSchema = z.object({
  name: z.string(),
  apiKey: z.string().optional(),
  baseURL: z.string().url(),
  models: z.object({
    default: z.array(z.string()),
    fetch: z.boolean().default(false),
  }),
  titleConvo: z.boolean().default(true),
  titleModel: z.string().optional(),
  titleMethod: z.enum(["completion", "functions"]).default("completion"),
  summarize: z.boolean().default(false),
  summaryModel: z.string().optional(),
  forcePrompt: z.boolean().default(false),
  modelDisplayLabel: z.string().optional(),
  addParams: z.record(z.any()).optional(),
  dropParams: z.array(z.string()).optional(),
  headers: z.record(z.string()).optional(),
});

// Assistants Configuration
const assistantsSchema = z.object({
  disableBuilder: z.boolean().default(false),
  pollIntervalMs: z.number().min(500).max(10000).default(3000),
  timeoutMs: z.number().min(30000).max(600000).default(180000),
  supportedIds: z.array(z.string()).optional(),
  excludedIds: z.array(z.string()).optional(),
  privateAssistants: z.boolean().default(false),
  retrievalModels: z.array(z.string()).optional(),
  capabilities: z.array(z.enum([
    "code_interpreter", "retrieval", "actions", "tools", "image_vision"
  ])).default(["code_interpreter", "retrieval", "actions", "tools", "image_vision"]),
}).optional();

// Agents Configuration
const agentsSchema = z.object({
  recursionLimit: z.number().min(1).max(100).default(25),
  maxRecursionLimit: z.number().min(1).max(200).default(25),
  disableBuilder: z.boolean().default(false),
  maxCitations: z.number().min(1).max(100).default(30),
  maxCitationsPerFile: z.number().min(1).max(20).default(7),
  minRelevanceScore: z.number().min(0).max(1).default(0.45),
  capabilities: z.array(z.enum([
    "execute_code", "file_search", "actions", "tools"
  ])).default(["execute_code", "file_search", "actions", "tools"]),
}).optional();

// Unified Endpoints Configuration for RC4
const endpointsSchema = z.object({
  // Standard AI Providers (RC4 Unified Endpoints Framework)
  openAI: openAISchema.optional(),
  azureOpenAI: azureSchema.optional(),
  anthropic: anthropicSchema.optional(),
  google: googleSchema.optional(),
  groq: genericProviderSchema.optional(),
  openRouter: genericProviderSchema.optional(),
  mistral: genericProviderSchema.optional(),
  xAI: genericProviderSchema.optional(),
  perplexity: genericProviderSchema.optional(),
  deepseek: genericProviderSchema.optional(),
  bedrock: bedrockSchema.optional(),
  cohere: genericProviderSchema.optional(),
  ollama: genericProviderSchema.optional(),
  localAI: genericProviderSchema.optional(),
  
  // Special Endpoints
  assistants: assistantsSchema,
  agents: agentsSchema,
  
  // Custom endpoints array for backwards compatibility
  custom: z.array(customEndpointSchema).optional(),
}).optional();

// Main Configuration Schema for LibreChat RC4
export const configurationSchema = z.object({
  // Required version for RC4
  version: z.string().default("1.2.8"),
  
  // Core settings
  cache: z.boolean().default(true),
  fileStrategy: z.union([
    z.string(),
    z.object({
      avatar: z.enum(["local", "s3", "firebase", "azure_blob"]).optional(),
      image: z.enum(["local", "s3", "firebase", "azure_blob"]).optional(),
      document: z.enum(["local", "s3", "firebase", "azure_blob"]).optional(),
    })
  ]).default("local"),
  secureImageLinks: z.boolean().default(false),
  imageOutputType: z.enum(["png", "webp", "jpeg", "url"]).default("png"),
  filteredTools: z.array(z.string()).optional(),
  includedTools: z.array(z.string()).optional(),
  
  // Temporary chat retention (in hours)
  temporaryChatRetention: z.number().min(1).max(8760).default(720),
  
  // Configuration objects
  interface: interfaceSchema,
  fileConfig: fileConfigSchema,
  rateLimits: rateLimitsSchema,
  registration: registrationSchema,
  actions: actionsSchema,
  webSearch: webSearchSchema,
  ocr: ocrSchema,
  stt: sttSchema,
  tts: ttsSchema,
  mcpServers: mcpServersSchema,
  endpoints: endpointsSchema,
  
  // Subdirectory hosting support (RC4 feature)
  basePath: z.string().optional(),
  appUrl: z.string().optional(),
  publicSubPath: z.string().optional(),
  
  // Environment Variables (for .env generation)
  // Security
  jwtSecret: z.string().min(32).optional(),
  jwtRefreshSecret: z.string().min(32).optional(),
  credsKey: z.string().length(32).optional(),
  credsIV: z.string().length(16).optional(),
  
  // Redis Configuration
  redisPingInterval: z.number().min(1000).max(300000).default(30000),
  
  // Minimum Password Length
  minPasswordLength: z.number().min(6).max(128).default(8),
  
  // API Keys
  openaiApiKey: z.string().optional(),
  anthropicApiKey: z.string().optional(),
  googleApiKey: z.string().optional(),
  groqApiKey: z.string().optional(),
  mistralApiKey: z.string().optional(),
  
  // Database Configuration
  mongoUri: z.string().optional(),
  redisUri: z.string().optional(),
  
  // Server Configuration
  host: z.string().default("0.0.0.0"),
  port: z.number().min(1).max(65535).default(3080),
  debugLogging: z.boolean().default(false),
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
