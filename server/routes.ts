import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { configurationSchema, insertConfigurationProfileSchema, packageGenerationSchema, insertDeploymentSchema, updateDeploymentSchema, deploymentRequestSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get default configuration
  app.get("/api/configuration/default", async (req, res) => {
    try {
      const defaultConfig = await storage.getDefaultConfiguration();
      res.json(defaultConfig);
    } catch (error) {
      console.error("Error getting default configuration:", error);
      res.status(500).json({ error: "Failed to get default configuration" });
    }
  });

  // Validate configuration
  app.post("/api/configuration/validate", async (req, res) => {
    try {
      const result = configurationSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Invalid configuration", 
          details: validationError.message 
        });
      }

      const validationStatus = await storage.validateConfiguration(result.data);
      res.json(validationStatus);
    } catch (error) {
      console.error("Error validating configuration:", error);
      res.status(500).json({ error: "Failed to validate configuration" });
    }
  });

  // Get all configuration profiles
  app.get("/api/profiles", async (req, res) => {
    try {
      const profiles = await storage.getAllProfiles();
      res.json(profiles);
    } catch (error) {
      console.error("Error getting profiles:", error);
      res.status(500).json({ error: "Failed to get profiles" });
    }
  });

  // Get specific profile
  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error getting profile:", error);
      res.status(500).json({ error: "Failed to get profile" });
    }
  });

  // Create new profile
  app.post("/api/profiles", async (req, res) => {
    try {
      const result = insertConfigurationProfileSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Invalid profile data", 
          details: validationError.message 
        });
      }

      const profile = await storage.createProfile(result.data);
      res.status(201).json(profile);
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  // Update profile
  app.put("/api/profiles/:id", async (req, res) => {
    try {
      const updates = req.body;
      const profile = await storage.updateProfile(req.params.id, updates);
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ error: "Profile not found" });
      } else {
        res.status(500).json({ error: "Failed to update profile" });
      }
    }
  });

  // Delete profile
  app.delete("/api/profiles/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProfile(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting profile:", error);
      res.status(500).json({ error: "Failed to delete profile" });
    }
  });

  // Generate installation package
  app.post("/api/package/generate", async (req, res) => {
    try {
      console.log("🔍 [PACKAGE DEBUG] Raw request body keys:", Object.keys(req.body));
      console.log("🔍 [PACKAGE DEBUG] Configuration keys:", req.body.configuration ? Object.keys(req.body.configuration) : 'NO CONFIG');
      
      const result = packageGenerationSchema.safeParse(req.body);
      if (!result.success) {
        console.error("❌ [PACKAGE DEBUG] Validation failed:", result.error.issues);
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Invalid package generation request", 
          details: validationError.message 
        });
      }

      const { configuration, includeFiles } = result.data;
      console.log("✅ [PACKAGE DEBUG] Validated configuration received:");
      console.log("   - configVer:", configuration.configVer);
      console.log("   - mcpServers count:", configuration.mcpServers?.length || 0);
      console.log("   - mcpServers data:", JSON.stringify(configuration.mcpServers, null, 2));
      console.log("   - UI settings:", {
        showModelSelect: configuration.showModelSelect,
        showAgents: configuration.showAgents,
        defaultModel: configuration.defaultModel
      });
      
      const packageFiles: { [key: string]: string } = {};

      // Generate .env file
      if (includeFiles.includes("env")) {
        packageFiles[".env"] = generateEnvFile(configuration);
      }

      // Generate librechat-config.yaml file
      if (includeFiles.includes("yaml")) {
        packageFiles["librechat-config.yaml"] = generateYamlFile(configuration);
      }

      // Generate docker-compose.yml file
      if (includeFiles.includes("docker-compose")) {
        packageFiles["docker-compose.yml"] = generateDockerComposeFile(configuration);
      }

      // Generate install.sh script
      if (includeFiles.includes("install-script")) {
        packageFiles["install.sh"] = generateInstallScript(configuration);
      }

      // Generate README.md
      if (includeFiles.includes("readme")) {
        packageFiles["README.md"] = generateReadmeFile(configuration);
      }

      // Always include a profile file for easy re-import
      packageFiles["profile.json"] = generateProfileFile(configuration);

      console.log("📦 [PACKAGE DEBUG] Generated files:", Object.keys(packageFiles));
      res.json({ files: packageFiles });
    } catch (error) {
      console.error("❌ [PACKAGE DEBUG] Error generating package:", error);
      res.status(500).json({ error: "Failed to generate package" });
    }
  });

  // =============================================================================
  // DEPLOYMENT ROUTES
  // =============================================================================

  // Get all deployments
  app.get("/api/deployments", async (req, res) => {
    try {
      const deployments = await storage.getAllDeployments();
      res.json(deployments);
    } catch (error) {
      console.error("Error getting deployments:", error);
      res.status(500).json({ error: "Failed to get deployments" });
    }
  });

  // Get specific deployment
  app.get("/api/deployments/:id", async (req, res) => {
    try {
      const deployment = await storage.getDeployment(req.params.id);
      if (!deployment) {
        return res.status(404).json({ error: "Deployment not found" });
      }
      res.json(deployment);
    } catch (error) {
      console.error("Error getting deployment:", error);
      res.status(500).json({ error: "Failed to get deployment" });
    }
  });

  // Get deployments by profile
  app.get("/api/deployments/profile/:profileId", async (req, res) => {
    try {
      const deployments = await storage.getDeploymentsByProfile(req.params.profileId);
      res.json(deployments);
    } catch (error) {
      console.error("Error getting deployments by profile:", error);
      res.status(500).json({ error: "Failed to get deployments by profile" });
    }
  });

  // Create new deployment (initiate deployment to cloud platform)
  app.post("/api/deployments", async (req, res) => {
    try {
      const result = deploymentRequestSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Invalid deployment request", 
          details: validationError.message 
        });
      }

      const { configurationProfileId, environmentOverrides, ...deploymentData } = result.data;

      // Get the configuration profile
      const profile = await storage.getProfile(configurationProfileId);
      if (!profile) {
        return res.status(404).json({ error: "Configuration profile not found" });
      }

      // Create deployment record
      const deployment = await storage.createDeployment({
        ...deploymentData,
        configurationProfileId,
        configuration: {
          ...profile.configuration,
          // Apply any environment overrides
          ...(environmentOverrides || {})
        }
      });

      // Start the actual deployment process (non-blocking)
      initiateCloudDeployment(deployment.id).catch(error => {
        console.error(`Deployment ${deployment.id} failed:`, error);
        storage.updateDeployment(deployment.id, { 
          status: "failed",
          deploymentLogs: [...(deployment.deploymentLogs || []), `Deployment failed: ${error.message}`]
        });
      });

      res.status(201).json(deployment);
    } catch (error) {
      console.error("Error creating deployment:", error);
      res.status(500).json({ error: "Failed to create deployment" });
    }
  });

  // Update deployment
  app.put("/api/deployments/:id", async (req, res) => {
    try {
      const result = updateDeploymentSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Invalid deployment update", 
          details: validationError.message 
        });
      }

      const deployment = await storage.updateDeployment(req.params.id, result.data);
      res.json(deployment);
    } catch (error) {
      console.error("Error updating deployment:", error);
      if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ error: "Deployment not found" });
      } else {
        res.status(500).json({ error: "Failed to update deployment" });
      }
    }
  });

  // Delete deployment (also cleanup cloud resources)
  app.delete("/api/deployments/:id", async (req, res) => {
    try {
      const deployment = await storage.getDeployment(req.params.id);
      if (!deployment) {
        return res.status(404).json({ error: "Deployment not found" });
      }

      // Cleanup cloud resources if deployment is running
      if (deployment.status === "running" && deployment.platformProjectId) {
        try {
          await cleanupCloudDeployment(deployment);
        } catch (cleanupError) {
          console.error("Error cleaning up cloud resources:", cleanupError);
          // Continue with deletion even if cleanup fails
        }
      }

      const deleted = await storage.deleteDeployment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Deployment not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting deployment:", error);
      res.status(500).json({ error: "Failed to delete deployment" });
    }
  });

  // Get deployment logs
  app.get("/api/deployments/:id/logs", async (req, res) => {
    try {
      const deployment = await storage.getDeployment(req.params.id);
      if (!deployment) {
        return res.status(404).json({ error: "Deployment not found" });
      }
      res.json({ logs: deployment.deploymentLogs });
    } catch (error) {
      console.error("Error getting deployment logs:", error);
      res.status(500).json({ error: "Failed to get deployment logs" });
    }
  });

  // Health check endpoint for deployed instances
  app.post("/api/deployments/:id/health-check", async (req, res) => {
    try {
      const deployment = await storage.getDeployment(req.params.id);
      if (!deployment) {
        return res.status(404).json({ error: "Deployment not found" });
      }

      if (deployment.publicUrl) {
        try {
          const healthCheck = await performHealthCheck(deployment.publicUrl);
          await storage.updateDeployment(req.params.id, {
            lastHealthCheck: new Date(),
            uptime: healthCheck.uptime || deployment.uptime
          });
          res.json(healthCheck);
        } catch (healthError) {
          res.status(503).json({ 
            healthy: false, 
            error: healthError instanceof Error ? healthError.message : 'Health check failed' 
          });
        }
      } else {
        res.status(400).json({ error: "No public URL available for health check" });
      }
    } catch (error) {
      console.error("Error performing health check:", error);
      res.status(500).json({ error: "Failed to perform health check" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for file generation
function generateEnvFile(config: any): string {
  const currentDate = new Date().toISOString().split('T')[0];
  
  return `# =============================================================================
# LibreChat Environment Configuration
# Generated on ${currentDate}
# =============================================================================

# =============================================================================
# REQUIRED: Security Configuration
# Generate secure random values for production use
# =============================================================================
JWT_SECRET=${config.jwtSecret || 'REPLACE_WITH_32_CHAR_RANDOM_STRING'}
JWT_REFRESH_SECRET=${config.jwtRefreshSecret || 'REPLACE_WITH_32_CHAR_RANDOM_STRING'}
CREDS_KEY=${config.credsKey || 'REPLACE_WITH_32_CHAR_RANDOM_KEY'}
CREDS_IV=${config.credsIV || 'REPLACE_16_CHARS'}

# =============================================================================
# Application Configuration
# =============================================================================
HOST=${config.host}
PORT=${config.port}
ALLOW_REGISTRATION=${config.enableRegistration}
SESSION_EXPIRY=${config.sessionExpiry}
REFRESH_TOKEN_EXPIRY=${config.refreshTokenExpiry}
DEBUG_LOGGING=${config.debugLogging}

# =============================================================================
# Database Configuration
# =============================================================================
MONGO_ROOT_USERNAME=${config.mongoRootUsername}
MONGO_ROOT_PASSWORD=${config.mongoRootPassword}
MONGO_DB_NAME=${config.mongoDbName}

# =============================================================================
# API Keys
# =============================================================================
${config.openaiApiKey ? `OPENAI_API_KEY=${config.openaiApiKey}` : '# OPENAI_API_KEY=your_openai_api_key_here'}

# =============================================================================
# Optional Configuration
# =============================================================================
${config.cdnProvider ? `CDN_PROVIDER=${config.cdnProvider}` : '# CDN_PROVIDER='}
`;
}

function generateYamlFile(config: any): string {
  return `# =============================================================================
# LibreChat Configuration for v${config.configVer}
# =============================================================================

version: 1.2.8
cache: ${config.cache}

# MCP Servers Configuration
mcpServers:
${config.mcpServers.map((server: any) => `  ${server.name}:
    type: ${server.type}
    ${server.url ? `url: "${server.url}"` : ''}
    timeout: ${server.timeout}
    ${Object.keys(server.headers).length > 0 ? `headers:\n${Object.entries(server.headers).map(([k, v]) => `      ${k}: "${v}"`).join('\n')}` : ''}
    ${server.instructions ? `serverInstructions: |\n      ${server.instructions.split('\n').join('\n      ')}` : ''}`).join('\n')}

# Endpoints Configuration
endpoints:
  agents:
    disableBuilder: false
    recursionLimit: 50
    maxRecursionLimit: 100
    capabilities:
      - execute_code
      - file_search
      - actions
      - tools
      - artifacts
      - web_search
    maxCitations: 30
    maxCitationsPerFile: 7
    minRelevanceScore: 0.45
  openAI:
    title: "OpenAI"
    apiKey: "\${OPENAI_API_KEY}"
    models:
      default: 
        - "gpt-5"
        - "gpt-4.1"
        - "gpt-4.1-mini"
        - "o4-mini"
        - "gpt-4o"
        - "gpt-4o-mini"
        - "gpt-realtime"
      fetch: true
    dropParams:
      - "frequency_penalty"
      - "presence_penalty"
      - "stop"
      - "user"
    titleConvo: ${config.endpointDefaults.titling}
    titleModel: "${config.endpointDefaults.titleModel}"

# Interface Configuration
interface:
  agents: true
  temporaryChatRetention: ${config.temporaryChatsRetentionHours}

# File Configuration
fileConfig:
  endpoints:
    openAI:
      disabled: false
      fileLimit: ${config.filesMaxFilesPerRequest}
      fileSizeLimit: ${config.filesMaxSizeMB}
      totalSizeLimit: ${config.filesMaxSizeMB * config.filesMaxFilesPerRequest}
      supportedMimeTypes:
${config.filesAllowedMimeTypes.map((type: string) => `        - "${type}"`).join('\n')}



# Rate Limits
rateLimits:
  fileUploads:
    ipMax: ${config.rateLimitsPerIP}
    ipWindowInMinutes: 60
    userMax: ${config.rateLimitsUploads}
    userWindowInMinutes: 60
  conversationsImport:
    ipMax: ${config.rateLimitsPerIP}
    ipWindowInMinutes: 60
    userMax: ${config.rateLimitsImports}
    userWindowInMinutes: 60
  stt:
    ipMax: ${config.rateLimitsPerIP}
    ipWindowInMinutes: 1
    userMax: ${config.rateLimitsSTT}
    userWindowInMinutes: 1
  tts:
    ipMax: ${config.rateLimitsPerIP}
    ipWindowInMinutes: 1
    userMax: ${config.rateLimitsTTS}
    userWindowInMinutes: 1

# Memory Configuration
${config.memoryEnabled ? `memory:
  disabled: false
  validKeys:
    - "user_preferences"
    - "conversation_context"
    - "learned_facts"
    - "personal_information"
  tokenLimit: ${config.memoryMaxTokens}
  personalize: ${config.memoryPersonalization}
  messageWindowSize: ${config.memoryWindowSize}
  agent:
    provider: "${config.memoryAgent}"
    model: "gpt-4"
    instructions: |
      Store memory using only the specified validKeys.
      For user_preferences: save explicitly stated preferences.
      For conversation_context: save important facts or ongoing projects.
      For learned_facts: save objective information about the user.
      For personal_information: save only what the user explicitly shares.
    model_parameters:
      temperature: 0.2
      max_tokens: 2000` : '# Memory system is disabled'}

# Search Configuration
search:
  provider: "${config.searchProvider}"
  scraper: "${config.searchScraper}"
  reranker: "${config.searchReranker}"
  safeSearch: ${config.searchSafeSearch}
  timeout: ${config.searchTimeout}

# OCR Configuration
${config.ocrProvider ? `ocr:
  strategy: "${config.ocrProvider === 'mistral' ? 'mistral_ocr' : config.ocrProvider === 'custom' ? 'custom_ocr' : 'mistral_ocr'}"${config.ocrProvider === 'mistral' ? `
  mistralModel: "${config.ocrModel}"` : ''}
  ${config.ocrApiBase ? `baseURL: "${config.ocrApiBase}"` : ''}
  ${config.ocrApiKey ? `apiKey: "${config.ocrApiKey}"` : ''}` : '# OCR is not configured'}

# Actions Configuration
${config.actionsAllowedDomains.length > 0 ? `actions:
  allowedDomains:
${config.actionsAllowedDomains.map((domain: string) => `    - "${domain}"`).join('\n')}` : '# Actions are not configured'}

`;
}

function generateDockerComposeFile(config: any): string {
  return `version: '3.8'

services:
  # MongoDB Database
  mongodb:
    container_name: librechat-mongodb
    image: mongo:7.0
    restart: unless-stopped
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: \${MONGO_ROOT_USERNAME:-${config.mongoRootUsername}}
      MONGO_INITDB_ROOT_PASSWORD: \${MONGO_ROOT_PASSWORD:-${config.mongoRootPassword}}
      MONGO_INITDB_DATABASE: \${MONGO_DB_NAME:-${config.mongoDbName}}
    networks:
      - librechat-network
    ports:
      - "27017:27017"

  # Redis Cache
  redis:
    container_name: librechat-redis
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - librechat-network
    command: redis-server --appendonly yes

  # LibreChat Application
  librechat:
    container_name: librechat-app
    image: ghcr.io/danny-avila/librechat-dev:latest
    restart: unless-stopped
    depends_on:
      - mongodb
      - redis
    ports:
      - "\${LIBRECHAT_PORT:-${config.port}}:3080"
    environment:
      # Database Configuration
      MONGO_URI: mongodb://\${MONGO_ROOT_USERNAME:-${config.mongoRootUsername}}:\${MONGO_ROOT_PASSWORD:-${config.mongoRootPassword}}@mongodb:27017/\${MONGO_DB_NAME:-${config.mongoDbName}}?authSource=admin
      
      # Redis Configuration
      REDIS_URI: redis://redis:6379
      
      # Application Configuration
      HOST: ${config.host}
      PORT: 3080
      NODE_ENV: production
      
      # Security
      JWT_SECRET: \${JWT_SECRET}
      JWT_REFRESH_SECRET: \${JWT_REFRESH_SECRET}
      CREDS_KEY: \${CREDS_KEY}
      CREDS_IV: \${CREDS_IV}
      
      # OpenAI API Key
      OPENAI_API_KEY: \${OPENAI_API_KEY}
      
      # Session Configuration
      SESSION_EXPIRY: \${SESSION_EXPIRY:-${config.sessionExpiry}}
      REFRESH_TOKEN_EXPIRY: \${REFRESH_TOKEN_EXPIRY:-${config.refreshTokenExpiry}}
      
      # Registration
      ALLOW_REGISTRATION: \${ALLOW_REGISTRATION:-${config.enableRegistration}}
      
      # Logging
      DEBUG_LOGGING: \${DEBUG_LOGGING:-${config.debugLogging}}
      
      # File uploads
      CDN_PROVIDER: \${CDN_PROVIDER:-}
      
      # MCP Configuration
      MCP_ENABLED: "true"
      
    volumes:
      - ./librechat-config.yaml:/app/librechat.yaml:ro
      - librechat_uploads:/app/client/public/images
      - librechat_logs:/app/api/logs
    networks:
      - librechat-network

volumes:
  mongodb_data:
    driver: local
  redis_data:
    driver: local
  librechat_uploads:
    driver: local
  librechat_logs:
    driver: local

networks:
  librechat-network:
    driver: bridge
`;
}

function generateInstallScript(config: any): string {
  return `#!/bin/bash

# =============================================================================
# LibreChat Installation Script
# Generated Configuration for v${config.configVer}
# =============================================================================

set -e

echo "🚀 Starting LibreChat installation..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs uploads

# Set permissions
chmod 755 logs uploads

# Pull Docker images
echo "📦 Pulling Docker images..."
docker-compose pull

# Start services
echo "🔄 Starting LibreChat services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service health..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ LibreChat is running successfully!"
    echo ""
    echo "🌐 Access your LibreChat instance at:"
    echo "   http://localhost:${config.port}"
    echo ""
    echo "📊 Service status:"
    docker-compose ps
    echo ""
    echo "📝 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
    echo "🔄 To restart: docker-compose restart"
else
    echo "❌ Some services failed to start. Check logs:"
    docker-compose logs
    exit 1
fi

echo ""
echo "🎉 Installation complete! Enjoy using LibreChat!"
`;
}

function generateReadmeFile(config: any): string {
  return `# LibreChat Configuration

This package contains a complete LibreChat v0.8.0-rc3 installation with your custom configuration (using configuration schema v${config.configVer}).

## 📋 Package Contents

- \`.env\` - Environment variables configuration
- \`librechat-config.yaml\` - Main LibreChat configuration file
- \`docker-compose.yml\` - Docker services orchestration
- \`install.sh\` - Automated installation script
- \`profile.json\` - Configuration profile for easy re-import
- \`README.md\` - This documentation file

## 🚀 Quick Start

1. **Prerequisites**
   - Docker and Docker Compose installed
   - At least 4GB RAM and 10GB disk space
   - Open ports: ${config.port}, 27017 (MongoDB)

2. **Installation**
   \`\`\`bash
   chmod +x install.sh
   ./install.sh
   \`\`\`

3. **Access**
   - Open your browser to: http://localhost:${config.port}
   - Register an account (${config.enableRegistration ? 'enabled' : 'disabled'})

## ⚙️ Configuration Summary

### Core Settings
- **LibreChat Version**: v0.8.0-rc3
- **Configuration Schema**: v${config.configVer}
- **Host**: ${config.host}:${config.port}
- **Registration**: ${config.enableRegistration ? 'Enabled' : 'Disabled'}
- **Debug Logging**: ${config.debugLogging ? 'Enabled' : 'Disabled'}

### AI Models
- **Default Model**: ${config.defaultModel}
- **Model Selection UI**: ${config.showModelSelect ? 'Visible' : 'Hidden'}
- **Parameters UI**: ${config.showParameters ? 'Visible' : 'Hidden'}

### Features Enabled
${config.showAgents ? '- ✅ AI Agents' : '- ❌ AI Agents'}
${config.showWebSearch ? '- ✅ Web Search' : '- ❌ Web Search'}
${config.showFileSearch ? '- ✅ File Search' : '- ❌ File Search'}
${config.showPresets ? '- ✅ Presets' : '- ❌ Presets'}
${config.showPrompts ? '- ✅ Custom Prompts' : '- ❌ Custom Prompts'}
${config.showBookmarks ? '- ✅ Bookmarks' : '- ❌ Bookmarks'}
${config.memoryEnabled ? '- ✅ Memory System' : '- ❌ Memory System'}

### File Upload Settings
- **Max File Size**: ${config.filesMaxSizeMB}MB
- **Max Files per Request**: ${config.filesMaxFilesPerRequest}
- **Allowed Types**: ${config.filesAllowedMimeTypes.join(', ')}

### Rate Limits
- **Per User**: ${config.rateLimitsPerUser} requests
- **Per IP**: ${config.rateLimitsPerIP} requests
- **Uploads**: ${config.rateLimitsUploads} per window
- **TTS**: ${config.rateLimitsTTS} per window
- **STT**: ${config.rateLimitsSTT} per window

### MCP Servers
${config.mcpServers.length > 0 ? config.mcpServers.map((server: any) => `- **${server.name}**: ${server.type} (${server.url || 'stdio'})`).join('\n') : 'No MCP servers configured'}

## 🔧 Manual Configuration

### Environment Variables (.env)
Key security and application settings are stored in the \`.env\` file:
- JWT secrets for authentication
- Database credentials
- API keys
- Session timeouts

### LibreChat YAML (librechat-config.yaml)
The main configuration file controls:
- AI model endpoints
- UI feature visibility
- Agent capabilities
- File handling rules
- Rate limiting policies

### Profile File (profile.json)
A complete configuration profile that can be re-imported into the LibreChat Configuration Interface:
- Full configuration backup
- Easy re-loading for future modifications
- Compatible with the Profile → Import Profile feature

## 🐳 Docker Commands

### Basic Operations
\`\`\`bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f librechat
\`\`\`

### Maintenance
\`\`\`bash
# Update images
docker-compose pull
docker-compose up -d

# Backup database
docker-compose exec mongodb mongodump --out /backup

# Clean up unused images
docker system prune -f
\`\`\`

## 🔐 Security Notes

1. **Change Default Passwords**: Update MongoDB credentials in \`.env\`
2. **Secure API Keys**: Protect your OpenAI and other API keys
3. **JWT Secrets**: Use strong, unique JWT secrets (provided in config)
4. **Network Access**: Configure firewall rules for production use
5. **HTTPS**: Use a reverse proxy with SSL/TLS in production

## 🌐 Production Deployment

For production use, consider:

1. **Reverse Proxy**: Use Nginx or Caddy for HTTPS termination
2. **Domain Setup**: Configure proper domain name and SSL certificates
3. **Monitoring**: Set up log aggregation and monitoring
4. **Backups**: Regular database and configuration backups
5. **Updates**: Keep LibreChat and dependencies updated

## 📚 Additional Resources

- **LibreChat Documentation**: https://docs.librechat.ai
- **GitHub Repository**: https://github.com/danny-avila/LibreChat
- **Community Support**: https://discord.gg/uDyZ5Tzhct
- **Configuration Guide**: https://docs.librechat.ai/install/configuration

## 🆘 Troubleshooting

### Common Issues

1. **Port Already in Use**
   \`\`\`bash
   # Change port in .env file
   PORT=3081
   \`\`\`

2. **Database Connection Issues**
   \`\`\`bash
   # Check MongoDB logs
   docker-compose logs mongodb
   \`\`\`

3. **Permission Errors**
   \`\`\`bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   \`\`\`

### Getting Help

If you encounter issues:
1. Check the logs: \`docker-compose logs\`
2. Verify your configuration files
3. Check the LibreChat documentation
4. Ask for help in the community Discord

---

**Generated on**: ${new Date().toISOString().split('T')[0]}
**LibreChat Version**: v0.8.0-rc3
**Configuration Schema**: v${config.configVer}
**Support**: https://docs.librechat.ai
`;
}

function generateProfileFile(config: any): string {
  const currentDate = new Date().toISOString();
  const profileName = `LibreChat-v${config.configVer}-${currentDate.split('T')[0]}`;
  
  const profile = {
    name: profileName,
    version: "1.0.0",
    createdAt: currentDate,
    description: `Generated LibreChat configuration profile for v${config.configVer}`,
    configuration: config
  };
  
  return JSON.stringify(profile, null, 2);
}

// =============================================================================
// RAILWAY INTEGRATION FUNCTIONS
// =============================================================================

interface HealthCheckResult {
  healthy: boolean;
  uptime?: number;
  response?: string;
  error?: string;
}

// Initiate deployment to Railway platform
async function initiateCloudDeployment(deploymentId: string): Promise<void> {
  try {
    // Update status to building
    await storage.updateDeployment(deploymentId, { 
      status: "building",
      deploymentLogs: ["Starting deployment process..."]
    });

    const deployment = await storage.getDeployment(deploymentId);
    if (!deployment) {
      throw new Error("Deployment not found");
    }

    // Generate Railway deployment configuration
    const railwayConfig = generateRailwayConfig(deployment);
    
    // For now, simulate the deployment process
    // In a real implementation, this would:
    // 1. Create a Railway project
    // 2. Upload the LibreChat Docker configuration
    // 3. Set environment variables
    // 4. Deploy the service
    // 5. Get the public URL
    
    await simulateRailwayDeployment(deployment);
    
  } catch (error: any) {
    console.error(`Deployment ${deploymentId} failed:`, error);
    await storage.updateDeployment(deploymentId, { 
      status: "failed",
      deploymentLogs: [`Deployment failed: ${error.message}`]
    });
    throw error;
  }
}

// Simulate Railway deployment for demo purposes
async function simulateRailwayDeployment(deployment: any): Promise<void> {
  // Simulate building phase
  await storage.updateDeployment(deployment.id, { 
    status: "building",
    deploymentLogs: [
      "Starting deployment process...",
      "Building Docker image...",
      "Configuring environment variables..."
    ]
  });

  // Simulate delay for building
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Simulate deploying phase
  await storage.updateDeployment(deployment.id, { 
    status: "deploying",
    deploymentLogs: [
      "Starting deployment process...",
      "Building Docker image...",
      "Configuring environment variables...",
      "Deploying to Railway...",
      "Allocating resources..."
    ]
  });

  // Simulate delay for deployment
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Generate mock Railway URLs
  const projectId = `librechat-${deployment.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
  const publicUrl = `https://${projectId}.railway.app`;
  
  // Mark as successfully deployed
  await storage.updateDeployment(deployment.id, { 
    status: "running",
    platformProjectId: projectId,
    platformServiceId: `service-${projectId}`,
    platformDeploymentId: `deploy-${projectId}`,
    publicUrl: publicUrl,
    adminUrl: `${publicUrl}/admin`,
    deployedAt: new Date(),
    deploymentLogs: [
      "Starting deployment process...",
      "Building Docker image...",
      "Configuring environment variables...",
      "Deploying to Railway...",
      "Allocating resources...",
      "✅ Deployment successful!",
      `🌐 Public URL: ${publicUrl}`,
      `🔑 Admin access: ${publicUrl}/admin`
    ]
  });
}

// Generate Railway-specific configuration
function generateRailwayConfig(deployment: any): any {
  return {
    name: deployment.name,
    image: "ghcr.io/danny-avila/librechat-dev:latest",
    environment: {
      // Database
      MONGO_URI: "mongodb://mongo:27017/LibreChat",
      REDIS_URI: "redis://redis:6379",
      
      // Application
      HOST: deployment.configuration.host,
      PORT: "3080",
      NODE_ENV: "production",
      
      // Security (would be generated securely in real implementation)
      JWT_SECRET: deployment.configuration.jwtSecret || generateSecureSecret(32),
      JWT_REFRESH_SECRET: deployment.configuration.jwtRefreshSecret || generateSecureSecret(32),
      CREDS_KEY: deployment.configuration.credsKey || generateSecureSecret(32),
      CREDS_IV: deployment.configuration.credsIV || generateSecureSecret(16),
      
      // API Keys
      OPENAI_API_KEY: deployment.configuration.openaiApiKey || "",
      
      // Features
      ALLOW_REGISTRATION: deployment.configuration.enableRegistration.toString(),
      DEBUG_LOGGING: deployment.configuration.debugLogging.toString(),
    },
    services: [
      {
        name: "mongodb",
        image: "mongo:7.0",
        environment: {
          MONGO_INITDB_ROOT_USERNAME: deployment.configuration.mongoRootUsername,
          MONGO_INITDB_ROOT_PASSWORD: deployment.configuration.mongoRootPassword,
          MONGO_INITDB_DATABASE: deployment.configuration.mongoDbName
        }
      },
      {
        name: "redis",
        image: "redis:7-alpine"
      }
    ]
  };
}

// Generate secure random secrets
function generateSecureSecret(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Cleanup cloud deployment resources
async function cleanupCloudDeployment(deployment: any): Promise<void> {
  try {
    console.log(`Cleaning up Railway deployment: ${deployment.platformProjectId}`);
    
    // In a real implementation, this would:
    // 1. Delete the Railway project
    // 2. Clean up associated resources
    // 3. Remove any DNS records
    
    // For simulation, just update the status
    await storage.updateDeployment(deployment.id, { 
      status: "stopped",
      deploymentLogs: [
        ...deployment.deploymentLogs,
        "🛑 Deployment stopped",
        "Cleaning up resources..."
      ]
    });
    
  } catch (error: any) {
    console.error(`Failed to cleanup deployment ${deployment.id}:`, error);
    throw error;
  }
}

// Perform health check on deployed instance
async function performHealthCheck(url: string): Promise<HealthCheckResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, { 
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      return {
        healthy: true,
        response: `HTTP ${response.status} ${response.statusText}`,
        uptime: Date.now() // Simplified uptime calculation
      };
    } else {
      return {
        healthy: false,
        error: `HTTP ${response.status} ${response.statusText}`
      };
    }
  } catch (error: any) {
    return {
      healthy: false,
      error: error.message || 'Failed to reach deployment'
    };
  }
}
