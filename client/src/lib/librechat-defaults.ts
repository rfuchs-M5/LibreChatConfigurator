// LibreChat v0.8.0-RC4 Essential Default Configuration Values
// Based on official LibreChat .env.example core settings

import { Configuration } from "@shared/schema";

/**
 * Core LibreChat defaults based on .env.example file.
 * Only includes the essential fields that are explicitly set in LibreChat's official configuration.
 */
export const essentialDefaults: Partial<Configuration> = {
  // Core configuration metadata
  version: "1.2.8", // RC4 version
  cache: true, // Enable caching by default
  
  // Basic server settings from .env.example
  host: "localhost",
  port: 3080,
  debugLogging: true, // Enabled in .env.example
  debugConsole: false, // Disabled by default
  noIndex: true, // Prevent search engine indexing
  
  // Basic database configuration from .env.example
  mongoUri: "mongodb://127.0.0.1:27017/LibreChat",
  
  // Core authentication settings from .env.example 
  allowRegistration: true, // Allow new users
  allowEmailLogin: true, // Enable email/password auth
  allowSocialLogin: false, // Disabled by default (requires setup)
  minPasswordLength: 8, // Standard minimum
  
  // Basic application settings from .env.example
  appTitle: "LibreChat", // Default title
  allowSharedLinks: true, // Enabled in .env.example
  allowSharedLinksPublic: true, // Public sharing enabled
  
  // Model configuration defaults  
  titleConvo: false, // Disable auto titles
  openaiForcePrompt: true, // Force prompt format
};

/**
 * Create a minimal reset configuration that preserves user secrets but resets settings to defaults.
 */
export function createResetConfiguration(currentConfig: Partial<Configuration> = {}): Configuration {
  // Preserve critical security fields that users have configured
  const preservedSecrets = {
    jwtSecret: currentConfig.jwtSecret,
    jwtRefreshSecret: currentConfig.jwtRefreshSecret,
    credsKey: currentConfig.credsKey,
    credsIV: currentConfig.credsIV,
    
    // Preserve API keys that users have configured
    openaiApiKey: currentConfig.openaiApiKey,
    anthropicApiKey: currentConfig.anthropicApiKey,
    googleApiKey: currentConfig.googleApiKey,
  };

  // Create reset configuration with essentials + preserved secrets
  const resetConfig: Configuration = {
    // Start with essential defaults
    ...essentialDefaults,
    // Preserve user's secrets and API keys
    ...preservedSecrets,
    // Ensure required fields have values
    version: "1.2.8",
    cache: true,
    host: "localhost",
    port: 3080,
    debugLogging: false, // Safer default for reset
  } as Configuration;

  return resetConfig;
}

/**
 * Get the essential LibreChat defaults.
 */
export function getEssentialDefaults(): Partial<Configuration> {
  return { ...essentialDefaults };
}

/**
 * Check if a field is set to its default value.
 */
export function isAtDefaultValue<K extends keyof Configuration>(
  field: K,
  value: Configuration[K]
): boolean {
  const defaultValue = essentialDefaults[field];
  return JSON.stringify(value) === JSON.stringify(defaultValue);
}