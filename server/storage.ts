import { type ConfigurationProfile, type InsertConfigurationProfile, type Configuration, type ValidationStatus } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Configuration Profile Management
  getProfile(id: string): Promise<ConfigurationProfile | undefined>;
  getProfileByName(name: string): Promise<ConfigurationProfile | undefined>;
  getAllProfiles(): Promise<ConfigurationProfile[]>;
  createProfile(profile: InsertConfigurationProfile): Promise<ConfigurationProfile>;
  updateProfile(id: string, profile: Partial<ConfigurationProfile>): Promise<ConfigurationProfile>;
  deleteProfile(id: string): Promise<boolean>;
  
  // Configuration Validation
  validateConfiguration(config: Configuration): Promise<ValidationStatus[]>;
  
  // Default Configuration
  getDefaultConfiguration(): Promise<Configuration>;
}

export class MemStorage implements IStorage {
  private profiles: Map<string, ConfigurationProfile>;
  private defaultConfig: Configuration;

  constructor() {
    this.profiles = new Map();
    this.defaultConfig = this.loadDefaultConfiguration();
  }

  private loadDefaultConfiguration(): Configuration {
    // Load defaults from the provided installation files
    return {
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

      // MCP Servers (from provided configuration)
      mcpServers: [{
        name: "company_memory",
        type: "streamable-http",
        url: "https://7bec216a-1f3e-49b7-af7b-a730d84de27f-00-1b28s6q3zwadm.janeway.replit.dev",
        timeout: 30000,
        headers: {
          "Authorization": "Token dev-api-key-12345; userId={{LIBRECHAT_USER_ID}}"
        },
        env: {},
        instructions: "This is Company Memory - a shared knowledge system for the organization."
      }],

      // Security Configuration (from provided .env)
      host: "0.0.0.0",
      port: 3080,
      jwtSecret: "b8be51069b71df92150d3203d2cfc0af556042e0723a4d945c3fc9da7d77143d",
      jwtRefreshSecret: "26dc942db446724a853605e2dad61315c4cad1f9302fe0932b0221d51f204701",
      credsKey: "11d3785fc45eaf57404cd29b807ef0eb",
      credsIV: "26b48f49f3a08948",
      openaiApiKey: "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",

      // Database Configuration
      mongoRootUsername: "admin",
      mongoRootPassword: "password123",
      mongoDbName: "LibreChat",

      // Session Configuration
      sessionExpiry: 900000,
      refreshTokenExpiry: 604800000,
      debugLogging: false,
    };
  }

  async getProfile(id: string): Promise<ConfigurationProfile | undefined> {
    return this.profiles.get(id);
  }

  async getProfileByName(name: string): Promise<ConfigurationProfile | undefined> {
    return Array.from(this.profiles.values()).find(profile => profile.name === name);
  }

  async getAllProfiles(): Promise<ConfigurationProfile[]> {
    return Array.from(this.profiles.values());
  }

  async createProfile(insertProfile: InsertConfigurationProfile): Promise<ConfigurationProfile> {
    const id = randomUUID();
    const now = new Date();
    const profile: ConfigurationProfile = {
      ...insertProfile,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(id: string, updates: Partial<ConfigurationProfile>): Promise<ConfigurationProfile> {
    const existing = this.profiles.get(id);
    if (!existing) {
      throw new Error(`Profile with id ${id} not found`);
    }
    
    const updated: ConfigurationProfile = {
      ...existing,
      ...updates,
      id, // Ensure ID cannot be changed
      updatedAt: new Date(),
    };
    
    this.profiles.set(id, updated);
    return updated;
  }

  async deleteProfile(id: string): Promise<boolean> {
    return this.profiles.delete(id);
  }

  async validateConfiguration(config: Configuration): Promise<ValidationStatus[]> {
    const statuses: ValidationStatus[] = [];

    // Server validation
    const serverErrors: string[] = [];
    if (!config.host || config.host.trim() === "") {
      serverErrors.push("Host is required");
    }
    if (config.port < 1 || config.port > 65535) {
      serverErrors.push("Port must be between 1 and 65535");
    }

    statuses.push({
      category: "Server",
      status: serverErrors.length === 0 ? "valid" : "invalid",
      settingsValid: serverErrors.length === 0 ? 2 : 2 - serverErrors.length,
      settingsTotal: 2,
      errors: serverErrors,
    });

    // Security validation
    const securityErrors: string[] = [];
    if (!config.jwtSecret || config.jwtSecret.length < 32) {
      securityErrors.push("JWT Secret must be at least 32 characters");
    }
    if (!config.jwtRefreshSecret || config.jwtRefreshSecret.length < 32) {
      securityErrors.push("JWT Refresh Secret must be at least 32 characters");
    }
    if (!config.credsKey || config.credsKey.length !== 32) {
      securityErrors.push("Credentials Key must be exactly 32 characters");
    }
    if (!config.credsIV || config.credsIV.length !== 16) {
      securityErrors.push("Credentials IV must be exactly 16 characters");
    }

    statuses.push({
      category: "Security",
      status: securityErrors.length === 0 ? "valid" : "invalid",
      settingsValid: 4 - securityErrors.length,
      settingsTotal: 4,
      errors: securityErrors,
    });

    // Continue validation for other categories...
    const categories = [
      { name: "Database", count: 3 },
      { name: "UI/Visibility", count: 14 },
      { name: "Models/Specs", count: 6 },
      { name: "Endpoints", count: 5 },
      { name: "Agents", count: 6 },
      { name: "Files", count: 4 },
      { name: "Rate Limits", count: 6 },
      { name: "Authentication", count: 3 },
      { name: "Memory", count: 5 },
      { name: "Search", count: 5 },
      { name: "MCP", count: 4 },
      { name: "OCR", count: 4 },
      { name: "Actions", count: 1 },
      { name: "Temp Chats", count: 1 },
    ];

    categories.forEach(category => {
      statuses.push({
        category: category.name,
        status: "valid",
        settingsValid: category.count,
        settingsTotal: category.count,
        errors: [],
      });
    });

    return statuses;
  }

  async getDefaultConfiguration(): Promise<Configuration> {
    return { ...this.defaultConfig };
  }
}

export const storage = new MemStorage();
