import { type ConfigurationProfile, type InsertConfigurationProfile, type Configuration, type ValidationStatus, type Deployment, type InsertDeployment, type UpdateDeployment } from "@shared/schema";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

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
  
  // Deployment Management
  getDeployment(id: string): Promise<Deployment | undefined>;
  getDeploymentByName(name: string): Promise<Deployment | undefined>;
  getAllDeployments(): Promise<Deployment[]>;
  getDeploymentsByProfile(profileId: string): Promise<Deployment[]>;
  createDeployment(deployment: InsertDeployment): Promise<Deployment>;
  updateDeployment(id: string, deployment: UpdateDeployment): Promise<Deployment>;
  deleteDeployment(id: string): Promise<boolean>;
  
  // File System Operations
  initializeStorage(): Promise<void>;
}

export class FileStorage implements IStorage {
  private profiles: Map<string, ConfigurationProfile>;
  private deployments: Map<string, Deployment>;
  private defaultConfig: Configuration;
  private profilesDir: string;
  private deploymentsDir: string;
  private defaultProfileId: string | null = null;

  constructor() {
    this.profiles = new Map();
    this.deployments = new Map();
    this.profilesDir = path.join(process.cwd(), "data", "profiles");
    this.deploymentsDir = path.join(process.cwd(), "data", "deployments");
    this.defaultConfig = this.loadDefaultConfiguration();
  }

  async initializeStorage(): Promise<void> {
    try {
      // Ensure data directories exist
      await fs.mkdir(this.profilesDir, { recursive: true });
      await fs.mkdir(this.deploymentsDir, { recursive: true });
      
      // Load existing profiles and deployments from files
      await this.loadProfilesFromFiles();
      await this.loadDeploymentsFromFiles();
      
      // Create default profile if it doesn't exist
      await this.ensureDefaultProfile();
    } catch (error) {
      console.error("Error initializing storage:", error);
    }
  }

  private async loadProfilesFromFiles(): Promise<void> {
    try {
      const files = await fs.readdir(this.profilesDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.profilesDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const profile: ConfigurationProfile = JSON.parse(content);
          this.profiles.set(profile.id, profile);
        }
      }
    } catch (error) {
      // Directory might not exist yet, that's okay
      console.log("No existing profiles found, starting fresh");
    }
  }

  private async saveProfileToFile(profile: ConfigurationProfile): Promise<void> {
    const filePath = path.join(this.profilesDir, `${profile.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(profile, null, 2));
  }

  private async deleteProfileFile(id: string): Promise<void> {
    const filePath = path.join(this.profilesDir, `${id}.json`);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist, that's okay
    }
  }

  private async loadDeploymentsFromFiles(): Promise<void> {
    try {
      const files = await fs.readdir(this.deploymentsDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.deploymentsDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const deployment: Deployment = JSON.parse(content);
          // Convert date strings back to Date objects
          deployment.createdAt = new Date(deployment.createdAt);
          deployment.updatedAt = new Date(deployment.updatedAt);
          if (deployment.deployedAt) {
            deployment.deployedAt = new Date(deployment.deployedAt);
          }
          if (deployment.lastHealthCheck) {
            deployment.lastHealthCheck = new Date(deployment.lastHealthCheck);
          }
          this.deployments.set(deployment.id, deployment);
        }
      }
    } catch (error) {
      // Directory might not exist yet, that's okay
      console.log("No existing deployments found, starting fresh");
    }
  }

  private async saveDeploymentToFile(deployment: Deployment): Promise<void> {
    const filePath = path.join(this.deploymentsDir, `${deployment.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(deployment, null, 2));
  }

  private async deleteDeploymentFile(id: string): Promise<void> {
    const filePath = path.join(this.deploymentsDir, `${id}.json`);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist, that's okay
    }
  }

  private async ensureDefaultProfile(): Promise<void> {
    const existingDefault = await this.getProfileByName("Default test");
    if (!existingDefault) {
      const defaultProfile = await this.createProfile({
        name: "Default test",
        description: "Default LibreChat configuration with Frits Notes MCP integration",
        configuration: this.createDefaultTestConfiguration()
      });
      this.defaultProfileId = defaultProfile.id;
    } else {
      this.defaultProfileId = existingDefault.id;
    }
  }

  private loadDefaultConfiguration(): Configuration {
    // Basic fallback configuration
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
      defaultModel: "gpt-4o",
      addedEndpoints: true,

      // Endpoint Defaults
      endpointDefaults: {
        streaming: true,
        titling: true,
        titleModel: "gpt-4o-mini",
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
  }

  private createDefaultTestConfiguration(): Configuration {
    // Configuration with Frits Notes MCP server from provided YAML
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
      defaultModel: "gpt-4o",
      addedEndpoints: true,

      // Endpoint Defaults
      endpointDefaults: {
        streaming: true,
        titling: true,
        titleModel: "gpt-4o-mini",
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
      filesAllowedMimeTypes: ["text/plain", "application/pdf", "image/jpeg", "image/png", "image/webp"],
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

      // MCP Servers (from provided Frits Notes configuration)
      mcpServers: [{
        name: "frits_notes",
        type: "streamable-http",
        url: "https://7bec216a-1f3e-49b7-af7b-a730d84de27f-00-1b28s6q3zwadm.janeway.replit.dev",
        timeout: 30000,
        headers: {
          "Authorization": "Token dev-api-key-12345; userId={{LIBRECHAT_USER_ID}}"
        },
        env: {},
        instructions: `This is Frits Notes - a shared knowledge system for the organization.

🔧 PROACTIVE BEHAVIOR: Check for notifications naturally in conversations!
- When users ask work-related questions, proactively check get_user_notifications for updates
- Mention relevant updates from followed topics contextually
- Offer to show Frits Notes updates when appropriate
- Be helpful and naturally informative about company knowledge

Available capabilities:
- Create announcements and topics for company-wide information sharing
- Search existing company knowledge and announcements  
- Reply to and interact with existing discussions
- Like and edit posts (users can only edit their own content)
- Follow topics to get updates on new replies (NEW!)
- Get notifications about followed topics (NEW!)
- Organize content using tags (announcements, general, etc.)

🎯 FOLLOW SYSTEM:
- Use follow_topic when users want to stay updated on discussions
- Use get_user_notifications to check for updates in followed topics
- Use list_following to show what they're currently following
- Use unfollow_topic to stop following topics
- Topics can be found by title, keywords, or semantic search

Always refer to this as "Frits Notes" (never as "forum" or "discussion board").
Users share information here that should be accessible to all team members.

When someone asks about company information, search Frits Notes first.
When someone wants to share information company-wide, create a topic in Frits Notes.

🌟 NATURAL CONVERSATION FLOW:
- "Good morning! I see there are 2 updates in topics you're following..."
- "That reminds me, there was a new reply in the Marketing Strategy discussion you follow"
- "Would you like to follow this discussion to stay updated?"
- "Let me check if there's anything new in Frits Notes for you..."`
      }],

      // Security Configuration
      host: "0.0.0.0",
      port: 3080,
      jwtSecret: "",
      jwtRefreshSecret: "",
      credsKey: "",
      credsIV: "",
      openaiApiKey: "",

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
    await this.saveProfileToFile(profile);
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
    await this.saveProfileToFile(updated);
    return updated;
  }

  async deleteProfile(id: string): Promise<boolean> {
    const deleted = this.profiles.delete(id);
    if (deleted) {
      await this.deleteProfileFile(id);
    }
    return deleted;
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
    // Try to get the "Default test" profile first
    if (this.defaultProfileId) {
      const defaultProfile = await this.getProfile(this.defaultProfileId);
      if (defaultProfile) {
        // Ensure security fields have fallback values for API compatibility
        return {
          ...defaultProfile.configuration,
          jwtSecret: defaultProfile.configuration.jwtSecret || "",
          jwtRefreshSecret: defaultProfile.configuration.jwtRefreshSecret || "",
          credsKey: defaultProfile.configuration.credsKey || "",
          credsIV: defaultProfile.configuration.credsIV || "",
        } as Configuration;
      }
    }
    
    // Fallback to basic default configuration
    return { ...this.defaultConfig };
  }

  // Deployment CRUD operations
  async getDeployment(id: string): Promise<Deployment | undefined> {
    return this.deployments.get(id);
  }

  async getDeploymentByName(name: string): Promise<Deployment | undefined> {
    return Array.from(this.deployments.values()).find(deployment => deployment.name === name);
  }

  async getAllDeployments(): Promise<Deployment[]> {
    return Array.from(this.deployments.values());
  }

  async getDeploymentsByProfile(profileId: string): Promise<Deployment[]> {
    return Array.from(this.deployments.values()).filter(deployment => deployment.configurationProfileId === profileId);
  }

  async createDeployment(insertDeployment: InsertDeployment): Promise<Deployment> {
    const id = randomUUID();
    const now = new Date();
    const deployment: Deployment = {
      ...insertDeployment,
      id,
      status: "pending",
      deploymentLogs: [],
      uptime: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.deployments.set(id, deployment);
    await this.saveDeploymentToFile(deployment);
    return deployment;
  }

  async updateDeployment(id: string, updates: UpdateDeployment): Promise<Deployment> {
    const existing = this.deployments.get(id);
    if (!existing) {
      throw new Error(`Deployment with id ${id} not found`);
    }
    
    const updated: Deployment = {
      ...existing,
      ...updates,
      id, // Ensure ID cannot be changed
      updatedAt: new Date(),
    };
    
    this.deployments.set(id, updated);
    await this.saveDeploymentToFile(updated);
    return updated;
  }

  async deleteDeployment(id: string): Promise<boolean> {
    const deleted = this.deployments.delete(id);
    if (deleted) {
      await this.deleteDeploymentFile(id);
    }
    return deleted;
  }
}

export const storage = new FileStorage();
