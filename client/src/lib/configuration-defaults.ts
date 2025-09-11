import { type Configuration } from "@shared/schema";

export const defaultConfiguration: Configuration = {
  // Global Core Settings (LibreChat v0.8.0-rc3 defaults)
  configVer: "1.2.8",
  cache: true,
  fileStrategy: "local",
  secureImageLinks: false,
  imageOutputType: "url",
  enableConversations: true,
  enableRegistration: true,

  // UI/Visibility Settings (LibreChat defaults)
  showModelSelect: true,
  showParameters: true,
  showSidePanel: true,
  showPresets: true,
  showPrompts: true,
  showBookmarks: true,
  showMultiConvo: false,  // Default false in LibreChat
  showAgents: true,
  showWebSearch: true,
  showFileSearch: true,
  showFileCitations: true,
  showRunCode: true,

  // Model Specifications (LibreChat defaults)
  modelSpecs: false,
  enforceModelSpecs: false,
  defaultModel: "gpt-4.1",  // Current OpenAI flagship model (January 2025)
  addedEndpoints: true,

  // Endpoint Defaults (LibreChat defaults)
  endpointDefaults: {
    streaming: true,
    titling: true,
    titleModel: "gpt-4.1-mini",  // Current cost-effective model (January 2025)
  },

  // Agent Configuration (LibreChat v0.8.0-rc3 open system - no restrictions)
  agentDefaultRecursionLimit: 5,   // Safe default for recursion
  agentMaxRecursionLimit: 10,      // Conservative limit for safety
  agentAllowedProviders: [],       // Empty = open system (all providers allowed)
  agentAllowedCapabilities: [],    // Empty = open system (MCP tools enabled)
  agentCitationsTotalLimit: 10,    // Citations configuration
  agentCitationsPerFileLimit: 3,   
  agentCitationsThreshold: 0.7,

  // File Configuration (LibreChat defaults)
  filesMaxSizeMB: 20,  // More generous default
  filesAllowedMimeTypes: ["text/plain", "application/pdf", "image/jpeg", "image/png", "image/webp"],
  filesMaxFilesPerRequest: 10,  // LibreChat default
  filesClientResizeImages: true,

  // Rate Limits (LibreChat defaults)
  rateLimitsPerUser: 100,
  rateLimitsPerIP: 100,     // LibreChat default
  rateLimitsUploads: 50,    // LibreChat default: 50 per hour
  rateLimitsImports: 50,    // LibreChat default: 50 per hour
  rateLimitsTTS: 50,        // LibreChat default: 50 per minute
  rateLimitsSTT: 50,        // LibreChat default: 50 per minute

  // Authentication (LibreChat defaults)
  authAllowedDomains: [],
  authSocialLogins: ["github", "google", "discord", "openid", "facebook"],  // LibreChat defaults
  authLoginOrder: ["email", "github", "google"],

  // Memory System (LibreChat defaults - disabled by default)
  memoryEnabled: false,
  memoryPersonalization: false,
  memoryWindowSize: 4000,
  memoryMaxTokens: 10000,
  memoryAgent: "openAI",

  // Actions/Tools (LibreChat defaults)
  actionsAllowedDomains: [],

  // Temporary Chats (LibreChat default: 7 days)
  temporaryChatsRetentionHours: 168,  // 7 days

  // OCR Configuration (LibreChat defaults)
  ocrProvider: "mistral",       // Default provider
  ocrModel: "",         // No default model

  // Search Configuration (LibreChat defaults)
  searchProvider: "Serper",        // Default provider
  searchScraper: "Serper",        // Default scraper
  searchReranker: "Jina",       // Default reranker
  searchSafeSearch: true,
  searchTimeout: 10000,

  // MCP Servers (Empty by default)
  mcpServers: [],

  // Security Configuration (LibreChat defaults)
  host: "localhost",        // LibreChat default: localhost
  port: 3080,              // LibreChat default: 3080
  jwtSecret: "",
  jwtRefreshSecret: "",
  credsKey: "",
  credsIV: "",

  // Database Configuration (LibreChat defaults)
  mongoRootUsername: "",     // No defaults for security
  mongoRootPassword: "",     // No defaults for security
  mongoDbName: "LibreChat",

  // Session Configuration (LibreChat defaults)
  sessionExpiry: 900000,     // 15 minutes
  refreshTokenExpiry: 604800000,  // 7 days
  debugLogging: false,

  // API Keys (Empty by default for security)
  openaiApiKey: "",
};
