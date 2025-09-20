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

  // UI/Visibility Settings (frits.ai optimized defaults)
  showModelSelect: true,
  showParameters: true,
  showSidePanel: true,
  showPresets: false,  // Disabled for cleaner interface
  showPrompts: true,
  showBookmarks: true,
  showMultiConvo: false,
  showAgents: true,
  showWebSearch: true,
  showFileSearch: true,
  showFileCitations: true,
  showRunCode: true,

  // Model Specifications (frits.ai defaults)
  modelSpecs: false,
  enforceModelSpecs: false,
  defaultModel: "gpt-4",  // Stable, reliable model choice
  addedEndpoints: true,

  // Endpoint Defaults (frits.ai defaults)
  endpointDefaults: {
    streaming: true,
    titling: true,
    titleModel: "gpt-3.5-turbo",  // Cost-effective for titling
  },

  // Agent Configuration (frits.ai optimized for OpenAI + core capabilities)
  agentDefaultRecursionLimit: 5,
  agentMaxRecursionLimit: 10,
  agentAllowedProviders: ["openAI"],  // Focus on OpenAI for consistency
  agentAllowedCapabilities: ["execute_code", "web_search", "file_search"],  // Core capabilities
  agentCitationsTotalLimit: 10,
  agentCitationsPerFileLimit: 3,   
  agentCitationsThreshold: 0.7,

  // File Configuration (frits.ai defaults)
  filesMaxSizeMB: 10,  // Balanced file size limit
  filesAllowedMimeTypes: ["text/plain", "application/pdf", "image/jpeg", "image/png", "image/webp"],
  filesMaxFilesPerRequest: 5,  // Conservative file count
  filesClientResizeImages: true,

  // Rate Limits (frits.ai defaults)
  rateLimitsPerUser: 100,
  rateLimitsPerIP: 500,     // Higher IP limits for better UX
  rateLimitsUploads: 50,
  rateLimitsImports: 10,    // Conservative import limits
  rateLimitsTTS: 100,       // Generous TTS limits
  rateLimitsSTT: 100,       // Generous STT limits

  // Authentication (frits.ai defaults - email focused)
  authAllowedDomains: [],
  authSocialLogins: [],  // Email-only authentication for simplicity
  authLoginOrder: ["email"],

  // Memory System (LibreChat defaults - disabled by default)
  memoryEnabled: false,
  memoryPersonalization: false,
  memoryWindowSize: 4000,
  memoryMaxTokens: 10000,
  memoryAgent: "openAI",

  // Actions/Tools (LibreChat defaults)
  actionsAllowedDomains: [],

  // Temporary Chats (frits.ai default: 30 days)
  temporaryChatsRetentionHours: 720,  // 30 days

  // OCR Configuration (frits.ai defaults)
  ocrProvider: "mistral",
  ocrModel: "mistral-7b",  // Default Mistral OCR model
  ocrApiBase: "",          // Empty by default for security
  ocrApiKey: "",           // Empty by default for security

  // Search Configuration (LibreChat defaults)
  searchProvider: "Serper",        // Default provider
  searchScraper: "Serper",        // Default scraper
  searchReranker: "Jina",       // Default reranker
  searchSafeSearch: true,
  searchTimeout: 10000,

  // Search Service API Keys (Empty by default for security)
  serperApiKey: "",
  searxngApiKey: "",
  searxngInstanceUrl: "",
  firecrawlApiKey: "",
  jinaApiKey: "",
  cohereApiKey: "",

  // MCP Servers (Empty by default)
  mcpServers: [],

  // Security Configuration (frits.ai defaults)
  host: "0.0.0.0",         // Allow external connections
  port: 3080,
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
  
  // Database URIs (Empty by default for security)
  mongoUri: "",
  redisUri: "",
  
  // CDN Configuration (Empty by default)
  cdnProvider: "",
  
  // Custom Welcome Message (frits.ai branding)
  customWelcome: "Welcome to frits.ai -- Select an agent to get started",
};
