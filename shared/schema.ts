import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// LibreChat RC4 Configuration Schema
// Pure RC4 implementation - no legacy support
export const configurationSchema = z.object({
  // RC4 Version
  version: z.string().default("1.2.9"),
  
  // Global Core Settings
  cache: z.boolean().default(true),
  // Global Core Settings
  cache: z.boolean().default(true),
  fileStrategy: z.enum(["local", "firebase", "s3", "azure_blob"]).default("local"),
  secureImageLinks: z.boolean().default(false),
  imageOutputType: z.enum(["url", "base64"]).default("url"),
  
  // Tools Configuration (RC4)
  filteredTools: z.array(z.string()).optional(),
  includedTools: z.array(z.string()).optional(),
  
  // Tools Configuration
  filteredTools: z.array(z.string()).optional(),
  includedTools: z.array(z.string()).optional(),

  // Interface Configuration (RC4 structure)
  interface: z.object({
    privacyPolicy: z.object({
      externalUrl: z.string().optional(),
      openNewTab: z.boolean().default(true),
    }).optional(),
    termsOfService: z.object({
      externalUrl: z.string().optional(),
      openNewTab: z.boolean().default(true),
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
    webSearch: z.boolean().default(true),
    fileSearch: z.boolean().default(true),
    runCode: z.boolean().default(true),
    temporaryChatRetention: z.number().min(1).max(8760).default(720),
  }).optional(),

  // Model Specifications  
  modelSpecs: z.boolean().default(false),
  enforceModelSpecs: z.boolean().default(false),
  
  // Shared Endpoint Settings (RC4)
  endpointDefaults: z.object({
    streaming: z.boolean().default(true),
    streamRate: z.number().optional(),
    titling: z.boolean().default(true),
    titleModel: z.string().default("gpt-3.5-turbo"),
    titleMethod: z.enum(["completion", "functions"]).optional(),
    titlePrompt: z.string().optional(),
    titlePromptTemplate: z.string().optional(),
    titleEndpoint: z.string().optional(),
  }).optional(),

  // RC4 Endpoints Configuration
  endpoints: z.object({
    // Agents endpoint configuration
    agents: z.object({
      recursionLimit: z.number().min(1).max(50).default(25),
      maxRecursionLimit: z.number().min(1).max(100).default(100),
      disableBuilder: z.boolean().default(false),
      allowedProviders: z.array(z.string()).default([]),
      capabilities: z.array(z.enum([
        "execute_code", 
        "file_search", 
        "actions", 
        "tools", 
        "artifacts", 
        "ocr", 
        "chain", 
        "web_search"
      ])).default([
        "execute_code", 
        "file_search", 
        "actions", 
        "tools", 
        "artifacts", 
        "ocr", 
        "chain", 
        "web_search"
      ]),
      // File citation configuration for file_search capability
      maxCitations: z.number().min(1).max(50).default(30),
      maxCitationsPerFile: z.number().min(1).max(10).default(7),
      minRelevanceScore: z.number().min(0).max(1).default(0.45),
    }).optional(),
    // Generic provider configurations (RC4 streamlined framework)
    openAI: z.record(z.any()).optional(),
    azureOpenAI: z.record(z.any()).optional(),
    anthropic: z.record(z.any()).optional(),
    google: z.record(z.any()).optional(),
    bedrock: z.record(z.any()).optional(),
    custom: z.array(z.record(z.any())).optional(),
  }).optional(),

  // File Configuration (RC4 structure)
  fileConfig: z.object({
    serverFileSizeLimit: z.number().min(1).max(1000).default(10),
    avatarSizeLimit: z.number().min(1).max(100).default(2),
    endpoints: z.record(z.object({
      fileLimit: z.number().optional(),
      fileSizeLimit: z.number().optional(),
      totalSizeLimit: z.number().optional(),
      supportedMimeTypes: z.array(z.string()).optional(),
    })).optional(),
    // Client-side image resizing (RC4 feature)
    clientImageResize: z.object({
      enabled: z.boolean().default(true),
      maxWidth: z.number().default(1920),
      maxHeight: z.number().default(1080),
      quality: z.number().min(0.1).max(1).default(0.8),
      compressFormat: z.enum(["jpeg", "webp"]).default("jpeg"),
    }).optional(),
  }).optional(),

  // RC4 Registration Configuration
  registration: z.object({
    socialLogins: z.array(z.string()).default([]),
    allowedDomains: z.array(z.string()).default([]),
  }).optional(),
  
  // MCP Servers (Unified RC3/RC4 support via union)
  mcpServers: z.union([
    // RC3 format: array of server objects
    z.array(z.object({
      name: z.string(),
      type: z.enum(["stdio", "websocket", "SSE", "streamable-http"]),
      url: z.string().optional(),
      timeout: z.number().default(30000),
      headers: z.record(z.string()).default({}),
      env: z.record(z.string()).default({}),
      instructions: z.string().optional(),
    })),
    // RC4 format: record of server configurations
    z.record(z.object({
      command: z.array(z.string()).optional(),
      env: z.record(z.string()).default({}),
      args: z.array(z.string()).optional(),
      disabled: z.boolean().default(false),
      timeout: z.number().default(30000),
      oauth2: z.object({
        authorizationUrl: z.string(),
        tokenUrl: z.string(),
        clientId: z.string(),
        clientSecret: z.string().optional(),
        scope: z.string().optional(),
        redirectUri: z.string().optional(),
      }).optional(),
      customUserVars: z.array(z.object({
        key: z.string(),
        required: z.boolean().default(false),
        description: z.string().optional(),
        defaultValue: z.string().optional(),
      })).optional(),
      instructions: z.string().optional(),
    }))
  ]).default([]),
  
  // RC3 Security Configuration (Environment Variables - backward compatibility)
  host: z.string().default("0.0.0.0"),
  port: z.number().min(1).max(65535).default(3080),
  jwtSecret: z.string().min(32),
  jwtRefreshSecret: z.string().min(32),
  credsKey: z.string().length(32),
  credsIV: z.string().length(16),
  openaiApiKey: z.string().optional(),
  
  // RC3 Database Configuration (backward compatibility)
  mongoUri: z.string().optional(),
  redisUri: z.string().optional(),
  mongoRootUsername: z.string().default("admin"),
  mongoRootPassword: z.string().optional(), // No default for security
  mongoDbName: z.string().default("LibreChat"),
  
  // RC3 Session Configuration (backward compatibility)
  sessionExpiry: z.number().default(900000),
  refreshTokenExpiry: z.number().default(604800000),
  debugLogging: z.boolean().default(false),
  cdnProvider: z.string().optional(),
  
  // RC3 Simple Rate Limits (backward compatibility)
  rateLimitsPerUser: z.number().min(1).max(10000).default(100),
  rateLimitsPerIP: z.number().min(1).max(10000).default(500),
  rateLimitsUploads: z.number().min(1).max(1000).default(50),
  rateLimitsImports: z.number().min(1).max(1000).default(10),
  rateLimitsTTS: z.number().min(1).max(1000).default(100),
  rateLimitsSTT: z.number().min(1).max(1000).default(100),
  
  // RC4 Enhanced Rate Limits (optional, more granular)
  rateLimits: z.object({
    fileUploads: z.object({
      ipMax: z.number().min(1).max(10000).default(100),
      ipWindowInMinutes: z.number().min(1).max(1440).default(60),
      userMax: z.number().min(1).max(1000).default(50),
      userWindowInMinutes: z.number().min(1).max(1440).default(60),
    }).optional(),
    conversationsImport: z.object({
      ipMax: z.number().min(1).max(10000).default(100),
      ipWindowInMinutes: z.number().min(1).max(1440).default(60),
      userMax: z.number().min(1).max(1000).default(50),
      userWindowInMinutes: z.number().min(1).max(1440).default(60),
    }).optional(),
    stt: z.object({
      ipMax: z.number().min(1).max(10000).default(100),
      ipWindowInMinutes: z.number().min(1).max(60).default(1),
      userMax: z.number().min(1).max(1000).default(50),
      userWindowInMinutes: z.number().min(1).max(60).default(1),
    }).optional(),
    tts: z.object({
      ipMax: z.number().min(1).max(10000).default(100),
      ipWindowInMinutes: z.number().min(1).max(60).default(1),
      userMax: z.number().min(1).max(1000).default(50),
      userWindowInMinutes: z.number().min(1).max(60).default(1),
    }).optional(),
    // Additional RC4 rate limit categories
    messages: z.object({
      ipMax: z.number().min(1).max(10000).default(1000),
      ipWindowInMinutes: z.number().min(1).max(1440).default(60),
      userMax: z.number().min(1).max(1000).default(500),
      userWindowInMinutes: z.number().min(1).max(1440).default(60),
    }).optional(),
    auth: z.object({
      ipMax: z.number().min(1).max(100).default(10),
      ipWindowInMinutes: z.number().min(1).max(60).default(15),
      userMax: z.number().min(1).max(50).default(5),
      userWindowInMinutes: z.number().min(1).max(60).default(15),
    }).optional(),
  }).optional(),

  // Registration Configuration (RC4 structure)
  registration: z.object({
    socialLogins: z.array(z.enum([
      "discord", "facebook", "github", "google", "openid"
    ])).default([]),
    allowedDomains: z.array(z.string()).default([]),
  }).optional(),

  // Memory System (Note: Moved to interface.temporaryChatRetention)
  // Actions/Tools - moved to endpoints configuration

  // OCR Configuration (RC4 structure)
  ocr: z.object({
    apiKey: z.string().optional(),
    baseURL: z.string().optional(),
    strategy: z.enum(["mistral_ocr", "custom_ocr", "azure_mistral_ocr", "vertexai_mistral_ocr"]).default("mistral_ocr"),
    mistralModel: z.string().default("mistral-7b"),
  }).optional(),

  // Web Search Configuration (RC4 structure)
  webSearch: z.object({
    serperApiKey: z.string().optional(),
    searxngInstanceUrl: z.string().optional(),
    searxngApiKey: z.string().optional(),
    firecrawlApiKey: z.string().optional(),
    firecrawlApiUrl: z.string().optional(),
    jinaApiKey: z.string().optional(),
    cohereApiKey: z.string().optional(),
    searchProvider: z.enum(["serper", "searxng"]).default("serper"),
    scraperType: z.enum(["firecrawl", "serper"]).default("serper"),
    rerankerType: z.enum(["jina", "cohere"]).default("jina"),
    scraperTimeout: z.number().min(1000).max(60000).default(10000),
    safeSearch: z.boolean().default(true),
  }).optional(),

  // MCP Servers (RC4 Enhanced Structure)
  // (Duplicate mcpServers removed - using unified union definition above)

  // New RC4 Features
  
  // Subdirectory Hosting Support
  hosting: z.object({
    subDirectory: z.object({
      enabled: z.boolean().default(false),
      path: z.string().optional(),
      baseUrl: z.string().optional(),
    }).optional(),
  }).optional(),
  
  // Environment Variables (RC4 additions)
  environment: z.object({
    redisPingInterval: z.number().min(1000).max(300000).default(30000),
    minPasswordLength: z.number().min(6).max(128).default(8),
    host: z.string().default("0.0.0.0"),
    port: z.number().min(1).max(65535).default(3080),
    jwtSecret: z.string().min(32),
    jwtRefreshSecret: z.string().min(32),
    credsKey: z.string().length(32),
    credsIV: z.string().length(16),
    mongoUri: z.string().optional(),
    redisUri: z.string().optional(),
    sessionExpiry: z.number().default(900000),
    refreshTokenExpiry: z.number().default(604800000),
    debugLogging: z.boolean().default(false),
  }).optional(),
});

export type Configuration = z.infer<typeof configurationSchema>;

// Profile configuration schema (secure - no sensitive fields exposed to client)
// Security: Completely omit sensitive fields from profiles to prevent client exposure
export const profileConfigurationSchema = configurationSchema.omit({
  // Core security fields - never expose to client
  jwtSecret: true,
  jwtRefreshSecret: true,
  credsKey: true,
  credsIV: true,
  mongoRootPassword: true,
  // API keys - never expose to client
  openaiApiKey: true,
  serperApiKey: true,
  searxngApiKey: true,
  firecrawlApiKey: true,
  jinaApiKey: true,
  cohereApiKey: true,
  // Environment secrets - handled separately on server-side
  environment: true,
});

// Server-only configuration schema (includes all sensitive fields)
export const serverConfigurationSchema = configurationSchema;

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

// Package generation configuration schema (secure - no sensitive fields exposed)
// Security: Completely omit sensitive fields from packages to prevent exposure
export const packageConfigurationSchema = configurationSchema.omit({
  // Core security fields - never include in packages
  jwtSecret: true,
  jwtRefreshSecret: true,
  credsKey: true,
  credsIV: true,
  mongoRootPassword: true,
  // API keys - never include in packages
  openaiApiKey: true,
  serperApiKey: true,
  searxngApiKey: true,
  firecrawlApiKey: true,
  jinaApiKey: true,
  cohereApiKey: true,
  // Environment secrets - handled separately on server-side
  environment: true,
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
