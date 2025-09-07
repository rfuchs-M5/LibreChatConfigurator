import { type Configuration } from "@shared/schema";

export const defaultConfiguration: Configuration = {
  // Global Core Settings
  configVer: "1.2.8",
  cache: true,
  fileStrategy: "local",
  secureImageLinks: false,
  imageOutputType: "url",
  enableConversations: true,
  enableRegistration: true,

  // UI/Visibility Settings
  showModelSelect: true,
  showParameters: true,
  showSidePanel: true,
  showPresets: true,
  showPrompts: true,
  showBookmarks: true,
  showMultiConvo: false,
  showAgents: true,
  showWebSearch: true,
  showFileSearch: true,
  showFileCitations: true,
  showRunCode: true,

  // Model Specifications
  modelSpecs: false,
  enforceModelSpecs: false,
  defaultModel: "gpt-4",
  addedEndpoints: true,

  // Endpoint Defaults
  endpointDefaults: {
    streaming: true,
    titling: true,
    titleModel: "gpt-3.5-turbo",
  },

  // Agent Configuration
  agentDefaultRecursionLimit: 5,
  agentMaxRecursionLimit: 10,
  agentAllowedProviders: ["openAI"],
  agentAllowedCapabilities: ["execute_code", "web_search", "file_search"],
  agentCitationsTotalLimit: 10,
  agentCitationsPerFileLimit: 3,
  agentCitationsThreshold: 0.7,

  // File Configuration
  filesMaxSizeMB: 10,
  filesAllowedMimeTypes: ["text/plain", "application/pdf", "image/jpeg", "image/png"],
  filesMaxFilesPerRequest: 5,
  filesClientResizeImages: true,

  // Rate Limits
  rateLimitsPerUser: 100,
  rateLimitsPerIP: 500,
  rateLimitsUploads: 50,
  rateLimitsImports: 10,
  rateLimitsTTS: 100,
  rateLimitsSTT: 100,

  // Authentication
  authAllowedDomains: [],
  authSocialLogins: [],
  authLoginOrder: ["email"],

  // Memory System
  memoryEnabled: false,
  memoryPersonalization: false,
  memoryWindowSize: 4000,
  memoryMaxTokens: 10000,
  memoryAgent: "openAI",

  // Actions/Tools
  actionsAllowedDomains: [],

  // Temporary Chats
  temporaryChatsRetentionHours: 720,

  // OCR Configuration
  ocrProvider: "mistral",
  ocrModel: "mistral-7b",

  // Search Configuration
  searchProvider: "Serper",
  searchScraper: "Serper",
  searchReranker: "Jina",
  searchSafeSearch: true,
  searchTimeout: 10000,

  // MCP Servers
  mcpServers: [],

  // Security Configuration
  host: "0.0.0.0",
  port: 3080,
  jwtSecret: "",
  jwtRefreshSecret: "",
  credsKey: "",
  credsIV: "",

  // Database Configuration
  mongoRootUsername: "admin",
  mongoRootPassword: "password123",
  mongoDbName: "LibreChat",

  // Session Configuration
  sessionExpiry: 900000,
  refreshTokenExpiry: 604800000,
  debugLogging: false,
};
