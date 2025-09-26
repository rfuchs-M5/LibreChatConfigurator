import { CONFIG_VERSION } from "./schema";

export type VersionCompatibility = "compatible" | "outdated" | "unknown";

export interface VersionValidationResult {
  status: VersionCompatibility;
  importedVersion?: string;
  currentVersion: string;
  message: string;
}

/**
 * Validates if an imported configuration version is compatible with the current version
 * @param importedVersion - The version from the imported configuration
 * @returns VersionValidationResult with compatibility status and details
 */
export function validateConfigVersion(importedVersion?: string): VersionValidationResult {
  const currentVersion = CONFIG_VERSION;

  if (!importedVersion) {
    return {
      status: "unknown",
      currentVersion,
      message: "Configuration file has no version information. This file may be from an older version of the LibreChat Configuration Tool."
    };
  }

  if (importedVersion === currentVersion) {
    return {
      status: "compatible",
      importedVersion,
      currentVersion,
      message: "Configuration file is compatible with this version of the tool."
    };
  }

  // For now, treat any version mismatch as outdated
  // In the future, we can implement semver comparison for more intelligent compatibility checking
  return {
    status: "outdated",
    importedVersion,
    currentVersion,
    message: `Configuration file is from version ${importedVersion}, but this tool uses version ${currentVersion}. The configuration may not be fully compatible.`
  };
}

/**
 * Creates a standardized configuration object with version metadata
 * @param configuration - The configuration object to wrap
 * @returns Configuration object with version and generation metadata
 */
export function createVersionedConfiguration<T extends Record<string, any>>(configuration: T) {
  return {
    configVersion: CONFIG_VERSION,
    generatedDate: new Date().toISOString(),
    ...configuration
  };
}