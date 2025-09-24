import { useState } from "react";
import { ConfigurationTabs } from "@/components/configuration-tabs";
import { PreviewModal } from "@/components/preview-modal";
import { useConfiguration } from "@/hooks/use-configuration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { defaultConfiguration } from "@/lib/configuration-defaults";
import { Search, Download, Save, Upload, CheckCircle, Eye, Rocket, ChevronDown, FolderOpen, FileText, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"; 
import { Label } from "@/components/ui/label";
import { ConfigurationHistory } from "@/components/ConfigurationHistory";
import yaml from "js-yaml";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [configurationName, setConfigurationName] = useState("My LibreChat Configuration");
  const { configuration, updateConfiguration, saveProfile, generatePackage } = useConfiguration();
  const { toast } = useToast();

  const handleSaveProfile = async () => {
    try {
      console.log("💾 [PROFILE DEBUG] Saving profile with configuration:");
      console.log("   - Name:", configurationName);
      console.log("   - Config keys:", Object.keys(configuration));
      console.log("   - MCP servers count:", configuration.mcpServers?.length || 0);
      console.log("   - MCP servers:", configuration.mcpServers);
      console.log("   - UI settings:", {
        appTitle: configuration.appTitle,
        allowRegistration: configuration.allowRegistration,
        debugLogging: configuration.debugLogging
      });
      
      // Create profile data with configuration and name
      const profileData = {
        name: configurationName,
        description: `Configuration profile created on ${new Date().toLocaleDateString()}`,
        configuration: configuration,
        version: "0.8.0-rc4", // Updated to RC4
        createdAt: new Date().toISOString(),
        exportedFrom: "LibreChat Configuration Manager"
      };

      // Download as JSON file with Save As dialog
      const { downloadJSON } = await import("@/lib/download-utils");
      const filename = `${configurationName.replace(/[^a-zA-Z0-9-_\s]/g, '-')}-profile.json`;
      const success = await downloadJSON(profileData, filename);

      if (success) {
        toast({
          title: "Profile Saved",
          description: `Configuration "${configurationName}" downloaded successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save configuration profile.",
        variant: "destructive",
      });
    }
  };

  const parseEnvFile = (envContent: string) => {
    const envVars: Record<string, string> = {};
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
    return envVars;
  };

  const mapEnvToConfiguration = (envVars: Record<string, string>) => {
    const config: any = {};
    
    // Map environment variables to configuration
    if (envVars.HOST) config.host = envVars.HOST;
    if (envVars.PORT) config.port = parseInt(envVars.PORT) || 3080;
    if (envVars.ALLOW_REGISTRATION) config.enableRegistration = envVars.ALLOW_REGISTRATION === 'true';
    if (envVars.DEBUG_LOGGING) config.debugLogging = envVars.DEBUG_LOGGING === 'true';
    if (envVars.SESSION_EXPIRY) config.sessionExpiry = parseInt(envVars.SESSION_EXPIRY) || 900000;
    if (envVars.REFRESH_TOKEN_EXPIRY) config.refreshTokenExpiry = parseInt(envVars.REFRESH_TOKEN_EXPIRY) || 604800000;
    
    // Security settings
    if (envVars.JWT_SECRET) config.jwtSecret = envVars.JWT_SECRET;
    if (envVars.JWT_REFRESH_SECRET) config.jwtRefreshSecret = envVars.JWT_REFRESH_SECRET;
    if (envVars.CREDS_KEY) config.credsKey = envVars.CREDS_KEY;
    if (envVars.CREDS_IV) config.credsIV = envVars.CREDS_IV;
    
    // Database settings
    if (envVars.MONGO_ROOT_USERNAME) config.mongoRootUsername = envVars.MONGO_ROOT_USERNAME;
    if (envVars.MONGO_ROOT_PASSWORD) config.mongoRootPassword = envVars.MONGO_ROOT_PASSWORD;
    if (envVars.MONGO_DB_NAME) config.mongoDbName = envVars.MONGO_DB_NAME;
    
    // API Keys
    if (envVars.OPENAI_API_KEY) config.openaiApiKey = envVars.OPENAI_API_KEY;
    if (envVars.CDN_PROVIDER) config.cdnProvider = envVars.CDN_PROVIDER;
    
    return config;
  };

  const mapYamlToConfiguration = (yamlData: any) => {
    const config: any = {};
    
    // Basic settings
    if (yamlData.version) config.configVer = yamlData.version;
    if (yamlData.cache !== undefined) config.cache = yamlData.cache;
    
    // MCP Servers
    if (yamlData.mcpServers) {
      config.mcpServers = Object.entries(yamlData.mcpServers).map(([name, server]: [string, any]) => ({
        name,
        type: server.type || 'streamable-http',
        url: server.url || '',
        timeout: server.timeout || 30000,
        headers: server.headers || {},
        env: server.env || {},
        instructions: server.serverInstructions || server.instructions || ''
      }));
    }
    
    // UI Settings
    if (yamlData.ui) {
      if (yamlData.ui.modelSelect !== undefined) config.showModelSelect = yamlData.ui.modelSelect;
      if (yamlData.ui.parameters !== undefined) config.showParameters = yamlData.ui.parameters;
      if (yamlData.ui.sidePanel !== undefined) config.showSidePanel = yamlData.ui.sidePanel;
      if (yamlData.ui.presets !== undefined) config.showPresets = yamlData.ui.presets;
      if (yamlData.ui.prompts !== undefined) config.showPrompts = yamlData.ui.prompts;
      if (yamlData.ui.bookmarks !== undefined) config.showBookmarks = yamlData.ui.bookmarks;
      if (yamlData.ui.multiConvo !== undefined) config.showMultiConvo = yamlData.ui.multiConvo;
      if (yamlData.ui.agents !== undefined) config.showAgents = yamlData.ui.agents;
      if (yamlData.ui.webSearch !== undefined) config.showWebSearch = yamlData.ui.webSearch;
      if (yamlData.ui.fileSearch !== undefined) config.showFileSearch = yamlData.ui.fileSearch;
      if (yamlData.ui.fileCitations !== undefined) config.showFileCitations = yamlData.ui.fileCitations;
      if (yamlData.ui.runCode !== undefined) config.showRunCode = yamlData.ui.runCode;
    }
    
    // Agent Configuration
    if (yamlData.agents) {
      if (yamlData.agents.defaultRecursionLimit) config.agentDefaultRecursionLimit = yamlData.agents.defaultRecursionLimit;
      if (yamlData.agents.maxRecursionLimit) config.agentMaxRecursionLimit = yamlData.agents.maxRecursionLimit;
      if (yamlData.agents.allowedProviders) config.agentAllowedProviders = yamlData.agents.allowedProviders;
      if (yamlData.agents.allowedCapabilities) config.agentAllowedCapabilities = yamlData.agents.allowedCapabilities;
      if (yamlData.agents.citations) {
        if (yamlData.agents.citations.totalLimit) config.agentCitationsTotalLimit = yamlData.agents.citations.totalLimit;
        if (yamlData.agents.citations.perFileLimit) config.agentCitationsPerFileLimit = yamlData.agents.citations.perFileLimit;
        if (yamlData.agents.citations.threshold !== undefined) config.agentCitationsThreshold = yamlData.agents.citations.threshold;
      }
    }
    
    // Rate Limits
    if (yamlData.rateLimits) {
      if (yamlData.rateLimits.perUser) config.rateLimitsPerUser = yamlData.rateLimits.perUser;
      if (yamlData.rateLimits.perIP) config.rateLimitsPerIP = yamlData.rateLimits.perIP;
      if (yamlData.rateLimits.uploads) config.rateLimitsUploads = yamlData.rateLimits.uploads;
      if (yamlData.rateLimits.imports) config.rateLimitsImports = yamlData.rateLimits.imports;
      if (yamlData.rateLimits.tts) config.rateLimitsTTS = yamlData.rateLimits.tts;
      if (yamlData.rateLimits.stt) config.rateLimitsSTT = yamlData.rateLimits.stt;
    }
    
    // File Configuration
    if (yamlData.fileConfig?.endpoints?.openAI) {
      const fileConfig = yamlData.fileConfig.endpoints.openAI;
      if (fileConfig.fileLimit) config.filesMaxFilesPerRequest = fileConfig.fileLimit;
      if (fileConfig.fileSizeLimit) config.filesMaxSizeMB = fileConfig.fileSizeLimit;
      if (fileConfig.supportedMimeTypes) config.filesAllowedMimeTypes = fileConfig.supportedMimeTypes;
    }
    
    // Search Configuration
    if (yamlData.search) {
      if (yamlData.search.provider) config.searchProvider = yamlData.search.provider;
      if (yamlData.search.scraper) config.searchScraper = yamlData.search.scraper;
      if (yamlData.search.reranker) config.searchReranker = yamlData.search.reranker;
      if (yamlData.search.safeSearch !== undefined) config.searchSafeSearch = yamlData.search.safeSearch;
      if (yamlData.search.timeout) config.searchTimeout = yamlData.search.timeout;
    }
    
    // Memory Configuration
    if (yamlData.memory) {
      if (yamlData.memory.enabled !== undefined) config.memoryEnabled = yamlData.memory.enabled;
      if (yamlData.memory.personalization !== undefined) config.memoryPersonalization = yamlData.memory.personalization;
      if (yamlData.memory.windowSize) config.memoryWindowSize = yamlData.memory.windowSize;
      if (yamlData.memory.maxTokens) config.memoryMaxTokens = yamlData.memory.maxTokens;
      if (yamlData.memory.agent) config.memoryAgent = yamlData.memory.agent;
    }
    
    // OCR Configuration
    if (yamlData.ocr) {
      if (yamlData.ocr.provider) config.ocrProvider = yamlData.ocr.provider;
      if (yamlData.ocr.model) config.ocrModel = yamlData.ocr.model;
      if (yamlData.ocr.apiBase) config.ocrApiBase = yamlData.ocr.apiBase;
      if (yamlData.ocr.apiKey) config.ocrApiKey = yamlData.ocr.apiKey;
    }
    
    // Actions Configuration
    if (yamlData.actions?.allowedDomains) {
      config.actionsAllowedDomains = yamlData.actions.allowedDomains;
    }
    
    // Temporary Chats
    if (yamlData.temporaryChats?.retentionHours) {
      config.temporaryChatsRetentionHours = yamlData.temporaryChats.retentionHours;
    }
    
    // Interface settings
    if (yamlData.interface?.customWelcome) {
      config.customWelcome = yamlData.interface.customWelcome;
    }
    
    // Endpoint defaults
    if (yamlData.endpoints?.openAI) {
      const openAIConfig = yamlData.endpoints.openAI;
      if (openAIConfig.titleConvo !== undefined) {
        config.endpointDefaults = { ...config.endpointDefaults, titling: openAIConfig.titleConvo };
      }
      if (openAIConfig.titleModel) {
        config.endpointDefaults = { ...config.endpointDefaults, titleModel: openAIConfig.titleModel };
      }
      if (openAIConfig.models?.default?.[0]) {
        config.defaultModel = openAIConfig.models.default[0];
      }
    }
    
    return config;
  };

  const handleImportProfile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const profileData = JSON.parse(event.target?.result as string);
            
            // Validate profile structure
            if (!profileData.configuration) {
              throw new Error("Invalid profile format: missing configuration data");
            }

            console.log("📥 [PROFILE DEBUG] Loading profile:");
            console.log("   - Name:", profileData.name);
            console.log("   - Config keys:", profileData.configuration ? Object.keys(profileData.configuration) : 'NO CONFIG');
            console.log("   - MCP servers count:", profileData.configuration?.mcpServers?.length || 0);
            console.log("   - MCP servers:", profileData.configuration?.mcpServers);
            
            // Apply the configuration and name
            updateConfiguration(profileData.configuration);
            // Always try to restore the profile name, with fallback
            const importedName = profileData.name || `Imported ${new Date().toLocaleDateString()}`;
            setConfigurationName(importedName);
            
            toast({
              title: "Profile Imported", 
              description: `Configuration "${importedName}" loaded successfully.`,
            });
          } catch (error) {
            toast({
              title: "Import Failed",
              description: "Failed to import configuration. Please check the file format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleImportYaml = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".yaml,.yml";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            console.log("📥 [YAML IMPORT] Parsing YAML file:", file.name);
            const yamlContent = event.target?.result as string;
            const yamlData = yaml.load(yamlContent) as any;
            
            console.log("   - Parsed YAML data:", yamlData);
            
            const configUpdates = mapYamlToConfiguration(yamlData);
            console.log("   - Mapped configuration:", configUpdates);
            console.log("   - MCP servers found:", configUpdates.mcpServers?.length || 0);
            
            // Update configuration with parsed data
            updateConfiguration(configUpdates);
            
            toast({
              title: "YAML Imported",
              description: `LibreChat configuration from "${file.name}" imported successfully.`,
            });
          } catch (error) {
            console.error("YAML import error:", error);
            toast({
              title: "Import Failed",
              description: "Failed to parse YAML file. Please check the file format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleImportEnv = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".env";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            console.log("📥 [ENV IMPORT] Parsing ENV file:", file.name);
            const envContent = event.target?.result as string;
            const envVars = parseEnvFile(envContent);
            
            console.log("   - Parsed ENV vars:", Object.keys(envVars));
            
            const configUpdates = mapEnvToConfiguration(envVars);
            console.log("   - Mapped configuration:", configUpdates);
            
            // Update configuration with parsed data
            updateConfiguration(configUpdates);
            
            toast({
              title: "Environment File Imported",
              description: `Settings from "${file.name}" imported successfully.`,
            });
          } catch (error) {
            console.error("ENV import error:", error);
            toast({
              title: "Import Failed",
              description: "Failed to parse environment file. Please check the file format.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleResetToDefaults = () => {
    
    // Reset configuration to LibreChat defaults (keep profile name unchanged)
    updateConfiguration(defaultConfiguration);
    
    toast({
      title: "Reset Complete",
      description: "Configuration reset to LibreChat v0.8.0-rc3 defaults.",
    });
  };

  const handleGeneratePackage = async () => {
    try {
      // Generate package name from configuration name (without .zip extension)
      const packageName = configurationName.replace(/[^a-zA-Z0-9-_\s]/g, '-').replace(/\s+/g, '-');
      
      const result = await generatePackage({
        includeFiles: ["env", "yaml", "docker-compose", "install-script", "readme"],
        packageName: packageName,
      });
      
      
      // Import JSZip dynamically
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Add each file to the ZIP (dynamically include all files from backend)
      Object.entries(result.files).forEach(([filename, content]) => {
        zip.file(filename, content as string);
      });
      
      // Generate ZIP file and download with Save As dialog
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const { downloadZIP } = await import("@/lib/download-utils");
      const filename = `${configurationName.replace(/[^a-zA-Z0-9-_\s]/g, '-')}.zip`;
      const success = await downloadZIP(zipBlob, filename);

      if (success) {
        toast({
          title: "Package Generated",
          description: "LibreChat installation package downloaded as ZIP file.",
        });
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate installation package.",
        variant: "destructive",
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                  <i className="fas fa-cog text-white text-lg"></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">LibreChat Configuration</h1>
                  <p className="text-sm text-muted-foreground">v0.8.0-RC4 Enterprise Setup</p>
                </div>
                
                {/* Profile Name Input */}
                <div className="flex items-center space-x-3">
                  <Label htmlFor="profile-name" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Profile name:
                  </Label>
                  <Input
                    id="profile-name"
                    value={configurationName}
                    onChange={(e) => setConfigurationName(e.target.value)}
                    className="text-lg font-medium w-72 border-border"
                    placeholder="Enter profile name..."
                    data-testid="input-config-name"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Profile Management Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" data-testid="button-profile-menu">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Profile
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuItem onClick={handleSaveProfile} data-testid="menu-save">
                    <Save className="h-4 w-4 mr-2" />
                    Export profile (json)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleResetToDefaults} data-testid="menu-reset">
                    <Settings className="h-4 w-4 mr-2" />
                    Reset to LibreChat Defaults
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleImportProfile} data-testid="menu-import-profile">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Profile (.json)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleImportYaml} data-testid="menu-import-yaml">
                    <FileText className="h-4 w-4 mr-2" />
                    Import librechat.yaml
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleImportEnv} data-testid="menu-import-env">
                    <Settings className="h-4 w-4 mr-2" />
                    Import Environment File (.env)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="h-6 border-l border-border mx-2"></div>
              
              {/* Configuration History */}
              <ConfigurationHistory onConfigurationLoad={updateConfiguration} />
              
              {/* Package Generation Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90" data-testid="button-package-menu">
                    <Rocket className="h-4 w-4 mr-2" />
                    Package
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setShowPreview(true)} data-testid="menu-preview">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Files...
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleGeneratePackage} data-testid="menu-generate">
                    <Download className="h-4 w-4 mr-2" />
                    Generate & Download ZIP
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1">
          <ConfigurationTabs 
            configuration={configuration}
            onConfigurationChange={updateConfiguration}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        </main>
      </div>


      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          configuration={configuration}
          onClose={() => setShowPreview(false)}
          onGenerate={handleGeneratePackage}
        />
      )}
      
    </div>
  );
}
