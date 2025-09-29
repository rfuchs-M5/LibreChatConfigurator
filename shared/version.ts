/**
 * CENTRAL VERSION MANAGEMENT - SINGLE SOURCE OF TRUTH
 * 
 * ⚠️ IMPORTANT: When making ANY changes to the application, increment this version:
 * - Major features: increment first decimal (1.0 -> 2.0)
 * - Minor features/updates: increment second decimal (1.0 -> 1.1)  
 * - Bug fixes/small changes: increment third decimal (1.0.0 -> 1.0.1)
 * 
 * This version is automatically used in:
 * - Top header display (client/src/pages/home.tsx)
 * - JSON configuration exports (client/src/pages/home.tsx - handleSaveProfile)
 * - Any other places that need version information
 * 
 * REMINDER LOCATIONS TO UPDATE VERSION:
 * - After adding new features
 * - After bug fixes
 * - After UI/UX improvements
 * - After schema changes
 * - After integration updates
 */

export const APP_VERSION = "0.8.0-rc4.2.0";

export const VERSION_INFO = {
  version: APP_VERSION,
  librechatTarget: "0.8.0-rc4",
  lastUpdated: "2025-09-29",
  changelog: "Added Perplexity search integration, backend detection system, centralized version management, and About dialog"
} as const;

// Helper function to get just the version string
export const getVersion = () => APP_VERSION;

// Helper function to get full version info
export const getVersionInfo = () => VERSION_INFO;