import { type Configuration } from "@shared/schema";

export const defaultConfiguration: Configuration = {
  // LibreChat RC4 Core Settings
  version: "0.8.0-rc4",
  cache: true,
  fileStrategy: "local",
  secureImageLinks: false,
  imageOutputType: "png",
  temporaryChatRetention: 720,
  
  // Required RC4 Fields
  titleConvo: true,
  redisPingInterval: 30000,
  minPasswordLength: 8,
  allowRegistration: true,
  allowEmailLogin: true,
  allowSocialLogin: false,
  allowSocialRegistration: false,
  allowPasswordReset: true,
  
  // Basic Server Configuration
  host: "0.0.0.0",
  port: 3080,
  debugLogging: false,
  
  // Security (empty for security)
  jwtSecret: "",
  jwtRefreshSecret: "",
  credsKey: "",
  credsIV: "",
  sessionExpiry: 900000,
  refreshTokenExpiry: 604800000,
  
  // Database (empty for security)
  mongoUri: "",
  redisUri: "",
  mongoDbName: "LibreChat",
  
  // API Keys (empty for security) 
  openaiApiKey: "",
  
  // UI Customization
  appTitle: "",
  customFooter: "",
  customWelcome: "",
  
  // Additional Required RC4 Fields
  azureStoragePublicAccess: false,
  redisUseAlternativeDNSLookup: false,
  search: false,
  meiliNoAnalytics: true,
  limitConcurrentMessages: false,
  banViolations: false,
  allowSharedLinks: false,
  allowSharedLinksPublic: false,
  summaryConvo: false,
};
