import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { configurationSchema, insertConfigurationProfileSchema, packageGenerationSchema } from "@shared/schema";
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
      const result = packageGenerationSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ 
          error: "Invalid package generation request", 
          details: validationError.message 
        });
      }

      const { configuration, includeFiles } = result.data;
      const packageFiles: { [key: string]: string } = {};

      // Generate .env file
      if (includeFiles.includes("env")) {
        packageFiles[".env"] = generateEnvFile(configuration);
      }

      // Generate librechat.yaml file
      if (includeFiles.includes("yaml")) {
        packageFiles["librechat.yaml"] = generateYamlFile(configuration);
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

      res.json({ files: packageFiles });
    } catch (error) {
      console.error("Error generating package:", error);
      res.status(500).json({ error: "Failed to generate package" });
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
# =============================================================================
JWT_SECRET=${config.jwtSecret}
JWT_REFRESH_SECRET=${config.jwtRefreshSecret}
CREDS_KEY=${config.credsKey}
CREDS_IV=${config.credsIV}

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

version: ${config.configVer}
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
  openAI:
    title: "OpenAI"
    apiKey: "\${OPENAI_API_KEY}"
    models:
      default: 
        - "${config.defaultModel}"
        - "gpt-4-turbo"
        - "gpt-3.5-turbo"
      fetch: true
    titleConvo: ${config.endpointDefaults.titling}
    titleModel: "${config.endpointDefaults.titleModel}"

# Interface Configuration
interface:
  ${config.customWelcome ? `customWelcome: "${config.customWelcome}"` : ''}
  privacyPolicy:
    externalUrl: 'https://librechat.ai/privacy-policy'
    openNewTab: true
  termsOfService:
    externalUrl: 'https://librechat.ai/tos' 
    openNewTab: true

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

# UI Configuration
ui:
  modelSelect: ${config.showModelSelect}
  parameters: ${config.showParameters}
  sidePanel: ${config.showSidePanel}
  presets: ${config.showPresets}
  prompts: ${config.showPrompts}
  bookmarks: ${config.showBookmarks}
  multiConvo: ${config.showMultiConvo}
  agents: ${config.showAgents}
  webSearch: ${config.showWebSearch}
  fileSearch: ${config.showFileSearch}
  fileCitations: ${config.showFileCitations}
  runCode: ${config.showRunCode}

# Agent Configuration
agents:
  defaultRecursionLimit: ${config.agentDefaultRecursionLimit}
  maxRecursionLimit: ${config.agentMaxRecursionLimit}
  allowedProviders:
${config.agentAllowedProviders.map((provider: string) => `    - "${provider}"`).join('\n')}
  allowedCapabilities:
${config.agentAllowedCapabilities.map((capability: string) => `    - "${capability}"`).join('\n')}
  citations:
    totalLimit: ${config.agentCitationsTotalLimit}
    perFileLimit: ${config.agentCitationsPerFileLimit}
    threshold: ${config.agentCitationsThreshold}

# Rate Limits
rateLimits:
  perUser: ${config.rateLimitsPerUser}
  perIP: ${config.rateLimitsPerIP}
  uploads: ${config.rateLimitsUploads}
  imports: ${config.rateLimitsImports}
  tts: ${config.rateLimitsTTS}
  stt: ${config.rateLimitsSTT}

# Memory Configuration
${config.memoryEnabled ? `memory:
  enabled: ${config.memoryEnabled}
  personalization: ${config.memoryPersonalization}
  windowSize: ${config.memoryWindowSize}
  maxTokens: ${config.memoryMaxTokens}
  agent: "${config.memoryAgent}"` : '# Memory system is disabled'}

# Search Configuration
search:
  provider: "${config.searchProvider}"
  scraper: "${config.searchScraper}"
  reranker: "${config.searchReranker}"
  safeSearch: ${config.searchSafeSearch}
  timeout: ${config.searchTimeout}

# OCR Configuration
${config.ocrProvider ? `ocr:
  provider: "${config.ocrProvider}"
  model: "${config.ocrModel}"
  ${config.ocrApiBase ? `apiBase: "${config.ocrApiBase}"` : ''}
  ${config.ocrApiKey ? `apiKey: "${config.ocrApiKey}"` : ''}` : '# OCR is not configured'}

# Actions Configuration
${config.actionsAllowedDomains.length > 0 ? `actions:
  allowedDomains:
${config.actionsAllowedDomains.map((domain: string) => `    - "${domain}"`).join('\n')}` : '# Actions are not configured'}

# Temporary Chats
temporaryChats:
  retentionHours: ${config.temporaryChatsRetentionHours}
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
      - ./librechat.yaml:/app/librechat.yaml:ro
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

This package contains a complete LibreChat v${config.configVer} installation with your custom configuration.

## 📋 Package Contents

- \`.env\` - Environment variables configuration
- \`librechat.yaml\` - Main LibreChat configuration file
- \`docker-compose.yml\` - Docker services orchestration
- \`install.sh\` - Automated installation script
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
- **Version**: ${config.configVer}
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

### LibreChat YAML (librechat.yaml)
The main configuration file controls:
- AI model endpoints
- UI feature visibility
- Agent capabilities
- File handling rules
- Rate limiting policies

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
**Configuration Version**: ${config.configVer}
**Support**: https://docs.librechat.ai
`;
}
