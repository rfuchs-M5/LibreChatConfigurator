// LibreChat v0.8.0-RC4 Official Default Configuration Values
// Extracted from official LibreChat .env.example and documentation

import { Configuration } from "@shared/schema";

/**
 * Essential default configuration based on LibreChat's official .env.example.
 * These are the core defaults that LibreChat uses when no configuration is provided.
 * Only includes values that are explicitly set in the official .env.example file.
 */
export const libreChatDefaults: Partial<Configuration> = {
  // Configuration metadata
  configVer: "1.2.8", // RC4 version
  cache: true, // Enable caching by default
  
  // Server Configuration - From .env.example
  host: "localhost",
  port: 3080,
  domainClient: "http://localhost:3080",
  domainServer: "http://localhost:3080", 
  noIndex: true, // Prevent search engine indexing by default
  debugLogging: true, // Debug logging enabled in .env.example
  debugConsole: false, // Debug console disabled by default
  consoleJSON: false, // JSON console logging disabled
  
  // Database Configuration - From .env.example
  mongoUri: "mongodb://127.0.0.1:27017/LibreChat", // Default local MongoDB
  
  // Authentication Settings - From .env.example defaults
  allowRegistration: true, // Allow new user registration
  allowEmailLogin: true, // Allow email/password login  
  allowSocialLogin: false, // Disable social login by default (requires setup)
  allowSocialRegistration: false, // Disable social registration by default
  allowPasswordReset: false, // Disable password reset by default (requires email setup)
  
  // Security Configuration - These MUST be generated, no defaults for security
  jwtSecret: undefined, // MUST be generated - no default for security
  jwtRefreshSecret: undefined, // MUST be generated - no default for security
  credsKey: undefined, // MUST be generated - no default for security  
  credsIV: undefined, // MUST be generated - no default for security
  minPasswordLength: 8, // LibreChat default from .env.example
  sessionExpiry: 900000, // 15 minutes in milliseconds (900 * 1000)
  refreshTokenExpiry: 604800000, // 7 days in milliseconds (7 * 24 * 60 * 60 * 1000)
  
  // API Provider Keys - User must configure (all empty in .env.example)
  openaiApiKey: "user_provided", // Placeholder as shown in .env.example
  anthropicApiKey: "user_provided", // Placeholder as shown in .env.example
  googleApiKey: "user_provided", // Placeholder as shown in .env.example
  assistantsApiKey: "user_provided", // Placeholder as shown in .env.example
  
  // File Upload Configuration - Conservative defaults
  enableFileUpload: true, // Enable file uploads
  enableFileSearch: true, // Enable file search
  enableCodeInterpreter: true, // Enable code interpreter  
  enableImageGeneration: true, // Enable image generation
  enableArtifacts: true, // Enable artifacts
  
  // Feature Toggles - Basic LibreChat functionality enabled
  appTitle: "LibreChat", // Default application title from .env.example
  allowSharedLinks: true, // Shared links enabled in .env.example
  allowSharedLinksPublic: true, // Public shared links enabled in .env.example
  
  // Advanced Features - Disabled by default (require additional setup)
  enablePlugins: false, // Disable plugins by default
  enableWebSearch: false, // Disable web search by default
  enableOCR: false, // Disable OCR by default (requires setup)
  enableStt: false, // Disable speech-to-text by default
  enableTts: false, // Disable text-to-speech by default
  
  // Model Configuration - Use defaults (no specific models listed in .env.example)
  titleConvo: false, // Disable conversation titles by default
  openaiSummarize: true, // Enable summarization
  openaiForcePrompt: true, // Force prompt format
  
  // UI/Visibility Configuration - Show helpful information
  hideUiVisibilityMessage: false, // Show UI visibility messages
  showBirthdayIcon: true, // Show birthday celebrations
  showGoogleDriveIcon: false, // Hide Google Drive (requires setup)
};

/**
 * Get a clean copy of LibreChat defaults to prevent mutations.
 */
export function getLibreChatDefaults(): Partial<Configuration> {
  return JSON.parse(JSON.stringify(libreChatDefaults));
}

/**
 * Reset configuration to LibreChat defaults.
 * Merges the provided configuration with LibreChat defaults.
 */
export function resetToDefaults(currentConfig: Partial<Configuration> = {}): Configuration {
  const defaults = getLibreChatDefaults();
  
  // Create a complete configuration by merging defaults with any existing values
  // This ensures all required fields are present while preserving user-specific settings
  const resetConfig: Configuration = {
    // Start with all current configuration
    ...currentConfig,
    // Override with LibreChat defaults
    ...defaults,
    // Ensure required fields are present with sensible defaults
    configVer: defaults.configVer || "1.2.8",
    cache: defaults.cache ?? true,
    host: defaults.host || "localhost", 
    port: defaults.port || 3080,
    debugLogging: defaults.debugLogging ?? false,
  } as Configuration;
  
  return resetConfig;
}

/**
 * Reset only specific configuration sections to defaults.
 */
export function resetConfigurationSection<K extends keyof Configuration>(
  currentConfig: Configuration,
  section: K,
  defaultValue: Configuration[K]
): Configuration {
  return {
    ...currentConfig,
    [section]: defaultValue
  };
}

/**
 * Check if a configuration value is at its default setting.
 */
export function isDefaultValue<K extends keyof Configuration>(
  field: K, 
  value: Configuration[K]
): boolean {
  const defaultValue = libreChatDefaults[field];
  return JSON.stringify(value) === JSON.stringify(defaultValue);
}