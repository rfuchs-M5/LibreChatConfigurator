import { type Configuration } from "@shared/schema";

export const defaultConfiguration: Configuration = {
  // LibreChat v0.8.0-RC4 Core Settings
  version: "0.8.0-rc4",
  cache: true,
  fileStrategy: "local",
  secureImageLinks: false,
  imageOutputType: "png",
  temporaryChatRetention: 720, // 30 days
  
  // Basic Server Configuration
  host: "0.0.0.0",
  port: 3080,
  debugLogging: false,
  
  // Security (empty for security)
  jwtSecret: "",
  jwtRefreshSecret: "",
  credsKey: "",
  credsIV: "",
  
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
};
