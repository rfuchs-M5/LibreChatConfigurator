import { useState } from "react";
import { ConfigurationTabs } from "@/components/configuration-tabs";
import { PreviewModal } from "@/components/preview-modal";
import { useConfiguration } from "@/hooks/use-configuration";
import { useBackendAvailability } from "@/hooks/use-backend-availability";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { defaultConfiguration } from "@/lib/configuration-defaults";
import { createResetConfiguration } from "@/lib/librechat-defaults";
import { Search, Download, Save, Upload, CheckCircle, Eye, Rocket, ChevronDown, FolderOpen, FileText, Settings, TestTube, Zap, AlertTriangle, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"; 
import { Label } from "@/components/ui/label";
import { ConfigurationHistory } from "@/components/ConfigurationHistory";
import { getVersion, getVersionInfo } from "@shared/version";
import yaml from "js-yaml";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [configurationName, setConfigurationName] = useState("My LibreChat Configuration");
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showSelfTestConfirmation, setShowSelfTestConfirmation] = useState(false);
  const { configuration, updateConfiguration, saveProfile, generatePackage, loadDemoConfiguration, verifyConfiguration } = useConfiguration();
  const { isBackendAvailable, isDemo } = useBackendAvailability();
  const { toast } = useToast();

  const handleSaveProfile = async () => {
    try {
      // ⚠️ REMINDER: Always update version in shared/version.ts when making changes!
      
      // Create profile data with configuration and name
      const versionInfo = getVersionInfo();
      const profileData = {
        name: configurationName,
        description: `Configuration profile created on ${new Date().toLocaleDateString()}`,
        configuration: configuration,
        version: versionInfo.version,
        librechatTarget: versionInfo.librechatTarget,
        createdAt: new Date().toISOString(),
        exportedFrom: `LibreChat Configuration Manager v${versionInfo.version}`,
        lastUpdated: versionInfo.lastUpdated,
        changelog: versionInfo.changelog
      };

      // Download as JSON file with Save As dialog
      const { downloadJSON } = await import("@/lib/download-utils");
      const filename = `${configurationName.replace(/[^a-zA-Z0-9-_\s]/g, '-')}-LibreChatConfigSettings.json`;
      const success = await downloadJSON(profileData, filename);

      if (success) {
        toast({
          title: "Configuration Saved",
          description: `Configuration "${configurationName}" downloaded successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save LibreChat configuration settings.",
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
            
            // Validate configuration structure
            if (!profileData.configuration) {
              throw new Error("Invalid configuration format: missing configuration data");
            }

            console.log("📥 [CONFIG DEBUG] Loading configuration:");
            console.log("   - Name:", profileData.name);
            console.log("   - Config keys:", profileData.configuration ? Object.keys(profileData.configuration) : 'NO CONFIG');
            console.log("   - MCP servers count:", profileData.configuration?.mcpServers?.length || 0);
            console.log("   - MCP servers:", profileData.configuration?.mcpServers);
            
            // Apply the configuration and name
            updateConfiguration(profileData.configuration);
            // Always try to restore the configuration name, with fallback
            const importedName = profileData.name || `Imported ${new Date().toLocaleDateString()}`;
            setConfigurationName(importedName);
            
            toast({
              title: "Configuration Imported", 
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
    setShowResetConfirmation(true);
  };

  const confirmResetToDefaults = () => {
    // Create reset configuration that preserves user secrets but resets settings to LibreChat defaults
    const resetConfig = createResetConfiguration(configuration);
    
    // Update configuration with LibreChat defaults
    updateConfiguration(resetConfig);
    
    toast({
      title: "Reset Complete", 
      description: "Configuration reset to LibreChat RC4 defaults while preserving your API keys and secrets.",
    });
    
    setShowResetConfirmation(false);
  };

  const handleLoadDemoConfiguration = () => {
    const demoConfig = loadDemoConfiguration();
    const verification = verifyConfiguration(demoConfig);
    
    toast({
      title: "Demo Configuration Loaded",
      description: `Loaded ${verification.current.populatedFields}/${verification.current.totalFields} fields (${verification.current.completionPercentage}% complete) with ALL toggles enabled for comprehensive testing.`,
    });
  };

  const handleRunSelfTest = () => {
    setShowSelfTestConfirmation(true);
  };

  const confirmRunSelfTest = async () => {
    setShowSelfTestConfirmation(false);
    try {
      // Verify current configuration first
      const verification = verifyConfiguration();
      console.log("🔍 [SELF-TEST] Configuration verification:", verification);
      
      const errors: string[] = [];
      const warnings: string[] = [];
      let testsPassed = 0;
      let totalTests = 0;
      
      // Test 1: JSON Export Validation
      totalTests++;
      try {
        const profileData = {
          name: "SELF_TEST_PROFILE",
          configuration: configuration,
          version: "0.8.0-rc4",
          createdAt: new Date().toISOString()
        };
        const jsonString = JSON.stringify(profileData, null, 2);
        const parsedProfile = JSON.parse(jsonString);
        
        // Deep equality check between original and parsed configuration
        const configKeys = Object.keys(configuration);
        const parsedKeys = Object.keys(parsedProfile.configuration);
        
        if (configKeys.length !== parsedKeys.length) {
          errors.push(`JSON Export: Field count mismatch (${configKeys.length} vs ${parsedKeys.length})`);
        } else {
          let fieldMismatches = 0;
          for (const key of configKeys) {
            const original = configuration[key as keyof typeof configuration];
            const parsed = parsedProfile.configuration[key];
            if (JSON.stringify(original) !== JSON.stringify(parsed)) {
              fieldMismatches++;
              if (fieldMismatches <= 3) { // Log first 3 mismatches
                errors.push(`JSON Export: Field ${key} mismatch: ${JSON.stringify(original)} !== ${JSON.stringify(parsed)}`);
              }
            }
          }
          if (fieldMismatches === 0) {
            testsPassed++;
            console.log("✅ [SELF-TEST] JSON export validation passed");
          } else if (fieldMismatches > 3) {
            errors.push(`JSON Export: ${fieldMismatches - 3} additional field mismatches...`);
          }
        }
      } catch (error) {
        errors.push(`JSON Export: Parse error - ${error}`);
      }
      
      // Test 2: Package Generation and ENV File Validation
      totalTests++;
      try {
        const packageResult = await generatePackage({
          packageName: "SELF_TEST_PACKAGE",
          includeFiles: ["env", "yaml", "docker-compose", "install-script", "readme"]
        });
        
        const envContent = packageResult.files[".env"];
        if (!envContent) {
          errors.push("ENV Export: .env file not generated");
        } else {
          // Parse .env file back to object
          const envVars: Record<string, string> = {};
          const envLines = envContent.split('\n').filter((line: string) => 
            line.trim() && !line.trim().startsWith('#') && line.includes('=')
          );
          
          for (const line of envLines) {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
              envVars[key.trim()] = valueParts.join('=').trim();
            }
          }
          
          // Validate critical fields that should be present
          const criticalFields = [
            { configKey: 'appTitle', envKey: 'APP_TITLE' },
            { configKey: 'host', envKey: 'HOST' },
            { configKey: 'port', envKey: 'PORT' },
            { configKey: 'openaiApiKey', envKey: 'OPENAI_API_KEY' },
            { configKey: 'anthropicApiKey', envKey: 'ANTHROPIC_API_KEY' }
          ];
          
          let envMismatches = 0;
          for (const { configKey, envKey } of criticalFields) {
            const configValue = configuration[configKey as keyof typeof configuration];
            const envValue = envVars[envKey];
            
            if (configValue && !envValue) {
              envMismatches++;
              errors.push(`ENV Export: Missing ${envKey} for configured ${configKey}`);
            } else if (configValue && envValue && String(configValue) !== envValue) {
              envMismatches++;
              warnings.push(`ENV Export: Value mismatch for ${envKey}: config="${configValue}" env="${envValue}"`);
            }
          }
          
          if (envMismatches === 0) {
            testsPassed++;
            console.log("✅ [SELF-TEST] ENV export validation passed");
          }
          
          console.log(`📝 [SELF-TEST] ENV file: ${envLines.length} variables, ${envContent.length} chars`);
        }
      } catch (error) {
        errors.push(`ENV Export: Generation error - ${error}`);
      }
      
      // Test 3: YAML Export Validation  
      totalTests++;
      try {
        const packageResult = await generatePackage({
          packageName: "SELF_TEST_PACKAGE_YAML",
          includeFiles: ["yaml"]
        });
        
        const yamlContent = packageResult.files["librechat.yaml"];
        if (!yamlContent) {
          errors.push("YAML Export: librechat.yaml file not generated");
        } else {
          // Try to parse YAML content
          try {
            const parsedYaml = yaml.load(yamlContent) as any;
            if (parsedYaml && typeof parsedYaml === 'object') {
              testsPassed++;
              console.log("✅ [SELF-TEST] YAML export validation passed");
              console.log(`📄 [SELF-TEST] YAML file: ${yamlContent.split('\n').length} lines, ${yamlContent.length} chars`);
            } else {
              errors.push("YAML Export: Parsed YAML is not an object");
            }
          } catch (yamlError) {
            errors.push(`YAML Export: Parse error - ${yamlError}`);
          }
        }
      } catch (error) {
        errors.push(`YAML Export: Generation error - ${error}`);
      }
      
      // Compile results
      const selfTestResults = {
        summary: {
          testsPassed,
          totalTests,
          successRate: Math.round((testsPassed / totalTests) * 100),
          configurationFields: verification.current.populatedFields,
          totalFields: verification.current.totalFields,
          completionPercentage: verification.current.completionPercentage
        },
        errors,
        warnings,
        singleSourceOfTruth: testsPassed === totalTests,
        details: {
          configurationSize: JSON.stringify(configuration).length,
          timestamp: new Date().toISOString()
        }
      };
      
      console.log("🎯 [COMPREHENSIVE SELF-TEST RESULTS]", selfTestResults);
      
      if (errors.length === 0) {
        toast({
          title: "✅ Export Functions Verified",
          description: `File generation working correctly! Current config: ${verification.current.populatedFields}/${verification.current.totalFields} fields (${verification.current.completionPercentage}%). All export formats (JSON, ENV, YAML) validated successfully.`,
        });
      } else {
        toast({
          title: `❌ Self-Test Failed (${testsPassed}/${totalTests})`,
          description: `${errors.length} errors, ${warnings.length} warnings. Check console for details. Single source of truth validation failed.`,
          variant: "destructive",
        });
      }
      
      return selfTestResults;
    } catch (error) {
      console.error("❌ [SELF-TEST] Critical failure:", error);
      toast({
        title: "Self-Test Critical Failure",
        description: "Test execution failed completely. Check console for detailed error information.",
        variant: "destructive",
      });
    }
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
                  <h1 className="text-xl font-bold text-foreground">
                    LibreChat Configuration Tool 
                    <span className="text-sm font-normal text-muted-foreground ml-2">v{getVersion()}</span>
                  </h1>
                  <p className="text-sm text-muted-foreground">Currently supporting: v{getVersionInfo().librechatTarget}</p>
                </div>
                
                {/* Profile Name Input */}
                <div className="flex items-center space-x-3">
                  <Label htmlFor="profile-name" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                    Configuration name:
                  </Label>
                  <Input
                    id="profile-name"
                    value={configurationName}
                    onChange={(e) => setConfigurationName(e.target.value)}
                    className="text-lg font-medium w-72 border-border"
                    placeholder="Enter configuration name..."
                    data-testid="input-config-name"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Configuration Management Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" data-testid="button-profile-menu">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Configuration
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuItem onClick={handleSaveProfile} data-testid="menu-save">
                    <Save className="h-4 w-4 mr-2" />
                    Export LibreChat Configuration Settings (json)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleResetToDefaults} data-testid="menu-reset">
                    <Settings className="h-4 w-4 mr-2" />
                    Reset to LibreChat Defaults
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLoadDemoConfiguration} data-testid="menu-load-demo">
                    <Zap className="h-4 w-4 mr-2" />
                    Load Demo Configuration
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleRunSelfTest} data-testid="menu-self-test">
                    <TestTube className="h-4 w-4 mr-2" />
                    Run Comprehensive Self-Test
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleImportProfile} data-testid="menu-import-profile">
                    <Upload className="h-4 w-4 mr-2" />
                    Import LibreChat Configuration Settings (.json)
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
                <DropdownMenuContent align="end" className="w-80">
                  {isDemo && (
                    <>
                      <div className="px-3 py-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 border-l-4 border-amber-400 mx-2 my-2 rounded-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="font-medium">Online Hosted Demo</span>
                        </div>
                        <div className="text-xs text-amber-700 dark:text-amber-300 mb-2">
                          Go to GitHub to self-host securely for full functionality:
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <ExternalLink className="h-3 w-3" />
                          <a 
                            href="https://github.com/Fritsl/LibreChatConfigurator" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                          >
                            github.com/Fritsl/LibreChatConfigurator
                          </a>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => setShowPreview(true)} data-testid="menu-preview">
                    <Eye className="h-4 w-4 mr-2" />
                    Individual files (Works when this app is hosted on Netlify)
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

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetConfirmation} onOpenChange={setShowResetConfirmation}>
        <AlertDialogContent data-testid="dialog-reset-confirmation">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to LibreChat Defaults</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset your configuration to LibreChat RC4 defaults?
              <br /><br />
              <strong>This will:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Reset all settings to official LibreChat defaults</li>
                <li>• <span className="text-green-600 font-medium">Preserve your API keys and secrets</span></li>
                <li>• Clear custom configurations, integrations, and preferences</li>
              </ul>
              <br />
              This action cannot be undone without re-importing your configuration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-reset">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmResetToDefaults}
              data-testid="button-confirm-reset"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Reset Configuration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Self-Test Confirmation Dialog */}
      <AlertDialog open={showSelfTestConfirmation} onOpenChange={setShowSelfTestConfirmation}>
        <AlertDialogContent data-testid="dialog-selftest-confirmation">
          <AlertDialogHeader>
            <AlertDialogTitle>Run Comprehensive Self-Test</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to run the comprehensive self-test?
              <br /><br />
              <strong>This will:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• <span className="text-red-600 font-medium">Overwrite all current content and configuration</span></li>
                <li>• Test JSON export validation with test data</li>
                <li>• Generate and validate ENV and YAML files</li>
                <li>• Run extensive package generation tests</li>
                <li>• <span className="text-amber-600 font-medium">Potentially generate large test files</span></li>
              </ul>
              <br />
              <strong className="text-red-600">WARNING:</strong> Your current configuration will be replaced with test data. Save your configuration first if you want to keep your current settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-selftest">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRunSelfTest}
              data-testid="button-confirm-selftest"
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              Yes, Run Self-Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
    </div>
  );
}
