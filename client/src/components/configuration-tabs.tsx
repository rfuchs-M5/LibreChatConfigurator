import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingInput } from "./setting-input";
import { StatusIndicator } from "./status-indicator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { type Configuration } from "@shared/schema";
import { 
  Server, 
  Shield, 
  Database, 
  Eye, 
  Brain, 
  Plug, 
  Bot, 
  FileText, 
  Gauge, 
  Key, 
  MemoryStick, 
  Search, 
  Network, 
  Camera, 
  Wrench, 
  Clock, 
  Download 
} from "lucide-react";

interface ConfigurationTabsProps {
  configuration: Configuration;
  onConfigurationChange: (updates: Partial<Configuration>) => void;
  searchQuery: string;
}

export function ConfigurationTabs({ 
  configuration, 
  onConfigurationChange, 
  searchQuery 
}: ConfigurationTabsProps) {
  const [activeTab, setActiveTab] = useState("server");

  const tabs = [
    {
      id: "server",
      label: "Server",
      icon: Server,
      description: "Host, Port, Proxy",
      color: "from-blue-500 to-blue-600",
      settings: ["host", "port"],
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      description: "JWT, Encryption, CORS",
      color: "from-red-500 to-red-600",
      settings: ["jwtSecret", "jwtRefreshSecret", "credsKey", "credsIV"],
    },
    {
      id: "database",
      label: "Database",
      icon: Database,
      description: "MongoDB, Redis",
      color: "from-green-500 to-green-600",
      settings: ["mongoRootUsername", "mongoRootPassword", "mongoDbName"],
    },
    {
      id: "ui",
      label: "UI/Visibility",
      icon: Eye,
      description: "Interface Controls",
      color: "from-purple-500 to-purple-600",
      settings: [
        "showModelSelect", "showParameters", "showSidePanel", "showPresets",
        "showPrompts", "showBookmarks", "showMultiConvo", "showAgents",
        "showWebSearch", "showFileSearch", "showFileCitations", "showRunCode",
        "customWelcome", "enableConversations"
      ],
    },
    {
      id: "models",
      label: "Models/Specs",
      icon: Brain,
      description: "AI Model Configuration",
      color: "from-indigo-500 to-indigo-600",
      settings: ["modelSpecs", "enforceModelSpecs", "defaultModel", "addedEndpoints"],
    },
    {
      id: "endpoints",
      label: "Endpoints",
      icon: Plug,
      description: "API Configuration",
      color: "from-cyan-500 to-cyan-600",
      settings: ["openaiApiKey", "endpointDefaults"],
    },
    {
      id: "agents",
      label: "Agents",
      icon: Bot,
      description: "AI Agent Settings",
      color: "from-orange-500 to-orange-600",
      settings: [
        "agentDefaultRecursionLimit", "agentMaxRecursionLimit", "agentAllowedProviders",
        "agentAllowedCapabilities", "agentCitationsTotalLimit", "agentCitationsPerFileLimit",
        "agentCitationsThreshold"
      ],
    },
    {
      id: "files",
      label: "Files",
      icon: FileText,
      description: "Upload & Storage",
      color: "from-teal-500 to-teal-600",
      settings: ["filesMaxSizeMB", "filesAllowedMimeTypes", "filesMaxFilesPerRequest", "filesClientResizeImages"],
    },
    {
      id: "rate-limits",
      label: "Rate Limits",
      icon: Gauge,
      description: "User & IP Limits",
      color: "from-pink-500 to-pink-600",
      settings: [
        "rateLimitsPerUser", "rateLimitsPerIP", "rateLimitsUploads",
        "rateLimitsImports", "rateLimitsTTS", "rateLimitsSTT"
      ],
    },
    {
      id: "auth",
      label: "Authentication",
      icon: Key,
      description: "Login & Registration",
      color: "from-yellow-500 to-yellow-600",
      settings: ["enableRegistration", "authAllowedDomains", "authSocialLogins", "authLoginOrder"],
    },
    {
      id: "memory",
      label: "MemoryStick",
      icon: MemoryStick,
      description: "AI MemoryStick System",
      color: "from-emerald-500 to-emerald-600",
      settings: ["memoryEnabled", "memoryPersonalization", "memoryWindowSize", "memoryMaxTokens", "memoryAgent"],
    },
    {
      id: "search",
      label: "Search",
      icon: Search,
      description: "Web & Vector Search",
      color: "from-violet-500 to-violet-600",
      settings: ["searchProvider", "searchScraper", "searchReranker", "searchSafeSearch", "searchTimeout"],
    },
    {
      id: "mcp",
      label: "MCP",
      icon: Network,
      description: "Model Context Protocol",
      color: "from-rose-500 to-rose-600",
      settings: ["mcpServers"],
    },
    {
      id: "ocr",
      label: "OCR",
      icon: Camera,
      description: "Document Processing",
      color: "from-amber-500 to-amber-600",
      settings: ["ocrProvider", "ocrModel", "ocrApiBase", "ocrApiKey"],
    },
    {
      id: "actions",
      label: "Actions",
      icon: Wrench,
      description: "OpenAPI Tools",
      color: "from-lime-500 to-lime-600",
      settings: ["actionsAllowedDomains"],
    },
    {
      id: "temp-chats",
      label: "Temp Chats",
      icon: Clock,
      description: "Chat Retention",
      color: "from-slate-500 to-slate-600",
      settings: ["temporaryChatsRetentionHours"],
    },
    {
      id: "generate",
      label: "Generate",
      icon: Download,
      description: "Create Package",
      color: "from-emerald-600 to-green-700",
      settings: [],
    },
  ];

  const getTabProgress = (tabSettings: string[]) => {
    if (tabSettings.length === 0) return 100;
    const validSettings = tabSettings.filter(setting => {
      const value = configuration[setting as keyof Configuration];
      return value !== undefined && value !== null && value !== "";
    });
    return Math.round((validSettings.length / tabSettings.length) * 100);
  };

  const filteredTabs = tabs.filter(tab => 
    searchQuery === "" || 
    tab.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tab.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-white shadow-lg border-r border-border h-screen sticky top-16 overflow-y-auto">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Configuration Categories</h2>
          
          <nav className="space-y-2">
            {filteredTabs.map((tab) => {
              const Icon = tab.icon;
              const progress = getTabProgress(tab.settings);
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  data-testid={`tab-${tab.id}`}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg shadow-sm transition-all ${
                    isActive 
                      ? `bg-gradient-to-r ${tab.color} text-white` 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-left flex-1">
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs opacity-90">{tab.description}</div>
                  </div>
                  <StatusIndicator 
                    status={progress === 100 ? "valid" : progress > 50 ? "pending" : "invalid"}
                    count={`${Math.floor((progress / 100) * tab.settings.length)}/${tab.settings.length}`}
                  />
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Server Configuration */}
          <TabsContent value="server">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <Server className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>Server Configuration</CardTitle>
                        <CardDescription>Configure host, port, and proxy settings</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status="valid" count="Complete" />
                  </div>
                  <Progress value={getTabProgress(["host", "port"])} className="mt-4" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SettingInput
                    label="Host Address"
                    description="The host interface to bind to (0.0.0.0 for all interfaces)"
                    type="text"
                    value={configuration.host}
                    onChange={(value) => onConfigurationChange({ host: value as string })}
                    placeholder="0.0.0.0"
                    data-testid="input-host"
                  />
                  <SettingInput
                    label="Port Number"
                    description="Port number for LibreChat to listen on"
                    type="number"
                    value={configuration.port}
                    onChange={(value) => onConfigurationChange({ port: value as number })}
                    placeholder="3080"
                    data-testid="input-port"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Configuration */}
          <TabsContent value="security">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <CardTitle>Security Configuration</CardTitle>
                        <CardDescription>Configure JWT secrets and encryption keys</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status="valid" count="Configured" />
                  </div>
                  <Progress value={getTabProgress(["jwtSecret", "jwtRefreshSecret", "credsKey", "credsIV"])} className="mt-4" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SettingInput
                    label="JWT Secret"
                    description="Secret key for JWT token signing (32+ characters recommended)"
                    type="password"
                    value={configuration.jwtSecret}
                    onChange={(value) => onConfigurationChange({ jwtSecret: value as string })}
                    data-testid="input-jwt-secret"
                  />
                  <SettingInput
                    label="JWT Refresh Secret"
                    description="Secret key for refresh token signing"
                    type="password"
                    value={configuration.jwtRefreshSecret}
                    onChange={(value) => onConfigurationChange({ jwtRefreshSecret: value as string })}
                    data-testid="input-jwt-refresh-secret"
                  />
                  <SettingInput
                    label="Credentials Key"
                    description="32-character encryption key for credentials"
                    type="password"
                    value={configuration.credsKey}
                    onChange={(value) => onConfigurationChange({ credsKey: value as string })}
                    data-testid="input-creds-key"
                  />
                  <SettingInput
                    label="Credentials IV"
                    description="16-character initialization vector for encryption"
                    type="password"
                    value={configuration.credsIV}
                    onChange={(value) => onConfigurationChange({ credsIV: value as string })}
                    data-testid="input-creds-iv"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* UI/Visibility Configuration */}
          <TabsContent value="ui">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                        <Eye className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle>UI & Visibility Settings</CardTitle>
                        <CardDescription>Control which interface elements are visible to users</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status="pending" count="12/14" />
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SettingInput
                    label="Show Model Select"
                    description="Display model selector in the UI"
                    type="boolean"
                    value={configuration.showModelSelect}
                    onChange={(value) => onConfigurationChange({ showModelSelect: value as boolean })}
                    data-testid="input-show-model-select"
                  />
                  <SettingInput
                    label="Show Parameters"
                    description="Show advanced parameter controls"
                    type="boolean"
                    value={configuration.showParameters}
                    onChange={(value) => onConfigurationChange({ showParameters: value as boolean })}
                    data-testid="input-show-parameters"
                  />
                  <SettingInput
                    label="Show Side Panel"
                    description="Display the side panel"
                    type="boolean"
                    value={configuration.showSidePanel}
                    onChange={(value) => onConfigurationChange({ showSidePanel: value as boolean })}
                    data-testid="input-show-side-panel"
                  />
                  <SettingInput
                    label="Show Presets"
                    description="Enable preset system prompts"
                    type="boolean"
                    value={configuration.showPresets}
                    onChange={(value) => onConfigurationChange({ showPresets: value as boolean })}
                    data-testid="input-show-presets"
                  />
                  <SettingInput
                    label="Show Prompts"
                    description="Enable custom prompts library"
                    type="boolean"
                    value={configuration.showPrompts}
                    onChange={(value) => onConfigurationChange({ showPrompts: value as boolean })}
                    data-testid="input-show-prompts"
                  />
                  <SettingInput
                    label="Show Agents"
                    description="Show Agents endpoint"
                    type="boolean"
                    value={configuration.showAgents}
                    onChange={(value) => onConfigurationChange({ showAgents: value as boolean })}
                    data-testid="input-show-agents"
                  />
                  <SettingInput
                    label="Custom Welcome Message"
                    description="Custom welcome text in landing page"
                    type="textarea"
                    value={configuration.customWelcome || ""}
                    onChange={(value) => onConfigurationChange({ customWelcome: value as string })}
                    data-testid="input-custom-welcome"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Generate Tab */}
          <TabsContent value="generate">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center">Generate Installation Package</CardTitle>
                  <CardDescription className="text-center">
                    Create a complete LibreChat installation package with your configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-green-800">.env File</h3>
                      <p className="text-sm text-green-600">Environment variables</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-blue-800">librechat.yaml</h3>
                      <p className="text-sm text-blue-600">Main configuration</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <FileText className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-purple-800">docker-compose.yml</h3>
                      <p className="text-sm text-purple-600">Container orchestration</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-6 rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-2">Ready to Deploy!</h3>
                    <p className="mb-4">Your configuration is complete and ready for package generation.</p>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      73 Settings Configured
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Database Configuration */}
          <TabsContent value="database">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <Database className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle>Database Configuration</CardTitle>
                        <CardDescription>Configure MongoDB and Redis settings</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status="valid" count="Complete" />
                  </div>
                  <Progress value={getTabProgress(["mongoRootUsername", "mongoRootPassword", "mongoDbName"])} className="mt-4" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SettingInput
                    label="MongoDB Username"
                    description="Root username for MongoDB database"
                    type="text"
                    value={configuration.mongoRootUsername}
                    onChange={(value) => onConfigurationChange({ mongoRootUsername: value as string })}
                    data-testid="input-mongo-username"
                  />
                  <SettingInput
                    label="MongoDB Password"
                    description="Root password for MongoDB database"
                    type="password"
                    value={configuration.mongoRootPassword}
                    onChange={(value) => onConfigurationChange({ mongoRootPassword: value as string })}
                    data-testid="input-mongo-password"
                  />
                  <SettingInput
                    label="Database Name"
                    description="Name of the LibreChat database"
                    type="text"
                    value={configuration.mongoDbName}
                    onChange={(value) => onConfigurationChange({ mongoDbName: value as string })}
                    data-testid="input-mongo-dbname"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Models/Specs Configuration */}
          <TabsContent value="models">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center">
                        <Brain className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle>AI Model Configuration</CardTitle>
                        <CardDescription>Configure model specifications and defaults</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status="valid" count="Complete" />
                  </div>
                  <Progress value={getTabProgress(["modelSpecs", "enforceModelSpecs", "defaultModel", "addedEndpoints"])} className="mt-4" />
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SettingInput
                    label="Enable Model Specs"
                    description="Define curated set of model specifications"
                    type="boolean"
                    value={configuration.modelSpecs}
                    onChange={(value) => onConfigurationChange({ modelSpecs: value as boolean })}
                    data-testid="input-model-specs"
                  />
                  <SettingInput
                    label="Enforce Model Specs"
                    description="Only allow curated model specifications"
                    type="boolean"
                    value={configuration.enforceModelSpecs}
                    onChange={(value) => onConfigurationChange({ enforceModelSpecs: value as boolean })}
                    data-testid="input-enforce-model-specs"
                  />
                  <SettingInput
                    label="Default Model"
                    description="Default AI model shown to users"
                    type="select"
                    value={configuration.defaultModel}
                    onChange={(value) => onConfigurationChange({ defaultModel: value as string })}
                    options={["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo", "claude-3", "gemini-pro"]}
                    data-testid="input-default-model"
                  />
                  <SettingInput
                    label="Allow Added Endpoints"
                    description="Allow endpoints not in specifications"
                    type="boolean"
                    value={configuration.addedEndpoints}
                    onChange={(value) => onConfigurationChange({ addedEndpoints: value as boolean })}
                    data-testid="input-added-endpoints"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Endpoints Configuration */}
          <TabsContent value="endpoints">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-lg flex items-center justify-center">
                        <Plug className="h-5 w-5 text-cyan-600" />
                      </div>
                      <div>
                        <CardTitle>API Endpoint Configuration</CardTitle>
                        <CardDescription>Configure API keys and endpoint settings</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status="pending" count="1/2" />
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6">
                  <SettingInput
                    label="OpenAI API Key"
                    description="Your OpenAI API key (starts with sk-)"
                    type="password"
                    value={configuration.openaiApiKey || ""}
                    onChange={(value) => onConfigurationChange({ openaiApiKey: value as string })}
                    placeholder="sk-..."
                    data-testid="input-openai-api-key"
                  />
                  <div className="space-y-4">
                    <h4 className="font-medium">Endpoint Defaults</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <SettingInput
                        label="Enable Streaming"
                        description="Enable streaming responses by default"
                        type="boolean"
                        value={configuration.endpointDefaults.streaming}
                        onChange={(value) => onConfigurationChange({ 
                          endpointDefaults: { ...configuration.endpointDefaults, streaming: value as boolean }
                        })}
                        data-testid="input-endpoint-streaming"
                      />
                      <SettingInput
                        label="Enable Titling"
                        description="Auto-generate conversation titles"
                        type="boolean"
                        value={configuration.endpointDefaults.titling}
                        onChange={(value) => onConfigurationChange({ 
                          endpointDefaults: { ...configuration.endpointDefaults, titling: value as boolean }
                        })}
                        data-testid="input-endpoint-titling"
                      />
                      <SettingInput
                        label="Title Model"
                        description="Model used for generating titles"
                        type="select"
                        value={configuration.endpointDefaults.titleModel}
                        onChange={(value) => onConfigurationChange({ 
                          endpointDefaults: { ...configuration.endpointDefaults, titleModel: value as string }
                        })}
                        options={["gpt-3.5-turbo", "gpt-4", "claude-3"]}
                        data-testid="input-title-model"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Agents Configuration */}
          <TabsContent value="agents">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <Bot className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <CardTitle>AI Agent Configuration</CardTitle>
                        <CardDescription>Configure AI agent capabilities and limits</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status="valid" count="Complete" />
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SettingInput
                    label="Default Recursion Limit"
                    description="Default number of agent steps (1-50)"
                    type="number"
                    value={configuration.agentDefaultRecursionLimit}
                    onChange={(value) => onConfigurationChange({ agentDefaultRecursionLimit: value as number })}
                    min={1}
                    max={50}
                    data-testid="input-agent-default-recursion"
                  />
                  <SettingInput
                    label="Max Recursion Limit"
                    description="Maximum recursion steps allowed (1-100)"
                    type="number"
                    value={configuration.agentMaxRecursionLimit}
                    onChange={(value) => onConfigurationChange({ agentMaxRecursionLimit: value as number })}
                    min={1}
                    max={100}
                    data-testid="input-agent-max-recursion"
                  />
                  <SettingInput
                    label="Allowed Providers"
                    description="Which AI providers agents can use"
                    type="array"
                    value={configuration.agentAllowedProviders}
                    onChange={(value) => onConfigurationChange({ agentAllowedProviders: value as string[] })}
                    placeholder="Add provider (e.g., openAI)"
                    data-testid="input-agent-providers"
                  />
                  <SettingInput
                    label="Allowed Capabilities"
                    description="Capabilities agents are allowed to use"
                    type="array"
                    value={configuration.agentAllowedCapabilities}
                    onChange={(value) => onConfigurationChange({ agentAllowedCapabilities: value as string[] })}
                    placeholder="Add capability (e.g., execute_code)"
                    data-testid="input-agent-capabilities"
                  />
                  <SettingInput
                    label="Total Citation Limit"
                    description="Total citation count limit (1-100)"
                    type="number"
                    value={configuration.agentCitationsTotalLimit}
                    onChange={(value) => onConfigurationChange({ agentCitationsTotalLimit: value as number })}
                    min={1}
                    max={100}
                    data-testid="input-agent-citations-total"
                  />
                  <SettingInput
                    label="Per File Citation Limit"
                    description="Citation limit per file (1-20)"
                    type="number"
                    value={configuration.agentCitationsPerFileLimit}
                    onChange={(value) => onConfigurationChange({ agentCitationsPerFileLimit: value as number })}
                    min={1}
                    max={20}
                    data-testid="input-agent-citations-per-file"
                  />
                  <SettingInput
                    label="Citation Threshold"
                    description="Minimum relevance threshold (0-1)"
                    type="number"
                    value={configuration.agentCitationsThreshold}
                    onChange={(value) => onConfigurationChange({ agentCitationsThreshold: value as number })}
                    min={0}
                    max={1}
                    step={0.1}
                    data-testid="input-agent-citations-threshold"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Files Configuration */}
          <TabsContent value="files">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <CardTitle>File Upload & Storage</CardTitle>
                        <CardDescription>Configure file handling and storage limits</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status="valid" count="Complete" />
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SettingInput
                    label="Max File Size (MB)"
                    description="Maximum file size for uploads (1-1000 MB)"
                    type="number"
                    value={configuration.filesMaxSizeMB}
                    onChange={(value) => onConfigurationChange({ filesMaxSizeMB: value as number })}
                    min={1}
                    max={1000}
                    data-testid="input-files-max-size"
                  />
                  <SettingInput
                    label="Max Files Per Request"
                    description="Maximum files per request (1-20)"
                    type="number"
                    value={configuration.filesMaxFilesPerRequest}
                    onChange={(value) => onConfigurationChange({ filesMaxFilesPerRequest: value as number })}
                    min={1}
                    max={20}
                    data-testid="input-files-max-per-request"
                  />
                  <SettingInput
                    label="Allowed MIME Types"
                    description="Allowed file types for upload"
                    type="array"
                    value={configuration.filesAllowedMimeTypes}
                    onChange={(value) => onConfigurationChange({ filesAllowedMimeTypes: value as string[] })}
                    placeholder="Add MIME type (e.g., image/jpeg)"
                    data-testid="input-files-mime-types"
                  />
                  <SettingInput
                    label="Client-side Image Resize"
                    description="Resize images on client before upload"
                    type="boolean"
                    value={configuration.filesClientResizeImages}
                    onChange={(value) => onConfigurationChange({ filesClientResizeImages: value as boolean })}
                    data-testid="input-files-resize-images"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rate Limits Configuration */}
          <TabsContent value="rate-limits">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center">
                        <Gauge className="h-5 w-5 text-pink-600" />
                      </div>
                      <div>
                        <CardTitle>Rate Limiting Configuration</CardTitle>
                        <CardDescription>Control request limits per user and IP</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status="valid" count="Complete" />
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SettingInput
                    label="Requests Per User"
                    description="Request limit per user per time window"
                    type="number"
                    value={configuration.rateLimitsPerUser}
                    onChange={(value) => onConfigurationChange({ rateLimitsPerUser: value as number })}
                    min={1}
                    max={10000}
                    data-testid="input-rate-limit-user"
                  />
                  <SettingInput
                    label="Requests Per IP"
                    description="Request limit per IP per time window"
                    type="number"
                    value={configuration.rateLimitsPerIP}
                    onChange={(value) => onConfigurationChange({ rateLimitsPerIP: value as number })}
                    min={1}
                    max={10000}
                    data-testid="input-rate-limit-ip"
                  />
                  <SettingInput
                    label="Upload Limits"
                    description="File uploads per time window"
                    type="number"
                    value={configuration.rateLimitsUploads}
                    onChange={(value) => onConfigurationChange({ rateLimitsUploads: value as number })}
                    min={1}
                    max={1000}
                    data-testid="input-rate-limit-uploads"
                  />
                  <SettingInput
                    label="Import Limits"
                    description="Data imports per time window"
                    type="number"
                    value={configuration.rateLimitsImports}
                    onChange={(value) => onConfigurationChange({ rateLimitsImports: value as number })}
                    min={1}
                    max={1000}
                    data-testid="input-rate-limit-imports"
                  />
                  <SettingInput
                    label="TTS Limits"
                    description="Text-to-speech requests per time window"
                    type="number"
                    value={configuration.rateLimitsTTS}
                    onChange={(value) => onConfigurationChange({ rateLimitsTTS: value as number })}
                    min={1}
                    max={1000}
                    data-testid="input-rate-limit-tts"
                  />
                  <SettingInput
                    label="STT Limits"
                    description="Speech-to-text requests per time window"
                    type="number"
                    value={configuration.rateLimitsSTT}
                    onChange={(value) => onConfigurationChange({ rateLimitsSTT: value as number })}
                    min={1}
                    max={1000}
                    data-testid="input-rate-limit-stt"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Authentication Configuration */}
          <TabsContent value="auth">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center">
                        <Key className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <CardTitle>Authentication Configuration</CardTitle>
                        <CardDescription>Configure login options and restrictions</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status="valid" count="Complete" />
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SettingInput
                    label="Enable Registration"
                    description="Allow new users to register"
                    type="boolean"
                    value={configuration.enableRegistration}
                    onChange={(value) => onConfigurationChange({ enableRegistration: value as boolean })}
                    data-testid="input-enable-registration"
                  />
                  <SettingInput
                    label="Allowed Email Domains"
                    description="Restrict registration to specific domains"
                    type="array"
                    value={configuration.authAllowedDomains}
                    onChange={(value) => onConfigurationChange({ authAllowedDomains: value as string[] })}
                    placeholder="Add domain (e.g., company.com)"
                    data-testid="input-auth-allowed-domains"
                  />
                  <SettingInput
                    label="Social Login Providers"
                    description="Enabled social login options"
                    type="array"
                    value={configuration.authSocialLogins}
                    onChange={(value) => onConfigurationChange({ authSocialLogins: value as string[] })}
                    placeholder="Add provider (e.g., google, github)"
                    data-testid="input-auth-social-logins"
                  />
                  <SettingInput
                    label="Login Order"
                    description="Order of login options in UI"
                    type="array"
                    value={configuration.authLoginOrder}
                    onChange={(value) => onConfigurationChange({ authLoginOrder: value as string[] })}
                    placeholder="Add login method (e.g., email, google)"
                    data-testid="input-auth-login-order"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Memory Configuration */}
          <TabsContent value="memory">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                        <MemoryStick className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <CardTitle>Memory System Configuration</CardTitle>
                        <CardDescription>Configure AI memory and personalization</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status={configuration.memoryEnabled ? "valid" : "pending"} count={configuration.memoryEnabled ? "Enabled" : "Disabled"} />
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SettingInput
                    label="Enable Memory System"
                    description="Enable AI memory capabilities"
                    type="boolean"
                    value={configuration.memoryEnabled}
                    onChange={(value) => onConfigurationChange({ memoryEnabled: value as boolean })}
                    data-testid="input-memory-enabled"
                  />
                  <SettingInput
                    label="Enable Personalization"
                    description="Allow AI to personalize responses"
                    type="boolean"
                    value={configuration.memoryPersonalization}
                    onChange={(value) => onConfigurationChange({ memoryPersonalization: value as boolean })}
                    data-testid="input-memory-personalization"
                  />
                  <SettingInput
                    label="Memory Window Size"
                    description="Context window size for memory (1000-100000)"
                    type="number"
                    value={configuration.memoryWindowSize}
                    onChange={(value) => onConfigurationChange({ memoryWindowSize: value as number })}
                    min={1000}
                    max={100000}
                    data-testid="input-memory-window-size"
                  />
                  <SettingInput
                    label="Max Memory Tokens"
                    description="Maximum tokens stored in memory (1000-50000)"
                    type="number"
                    value={configuration.memoryMaxTokens}
                    onChange={(value) => onConfigurationChange({ memoryMaxTokens: value as number })}
                    min={1000}
                    max={50000}
                    data-testid="input-memory-max-tokens"
                  />
                  <SettingInput
                    label="Memory Agent Provider"
                    description="AI provider used for memory operations"
                    type="select"
                    value={configuration.memoryAgent}
                    onChange={(value) => onConfigurationChange({ memoryAgent: value as string })}
                    options={["openAI", "claude", "gemini"]}
                    data-testid="input-memory-agent"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Search Configuration */}
          <TabsContent value="search">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-violet-200 rounded-lg flex items-center justify-center">
                        <Search className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <CardTitle>Search Configuration</CardTitle>
                        <CardDescription>Configure web search and vector search</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status="valid" count="Complete" />
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SettingInput
                    label="Search Provider"
                    description="Web search provider"
                    type="select"
                    value={configuration.searchProvider}
                    onChange={(value) => onConfigurationChange({ searchProvider: value as "Serper" | "SearXNG" })}
                    options={["Serper", "SearXNG"]}
                    data-testid="input-search-provider"
                  />
                  <SettingInput
                    label="Scraper Service"
                    description="Content scraping service"
                    type="select"
                    value={configuration.searchScraper}
                    onChange={(value) => onConfigurationChange({ searchScraper: value as "Firecrawl" | "Serper" })}
                    options={["Firecrawl", "Serper"]}
                    data-testid="input-search-scraper"
                  />
                  <SettingInput
                    label="Reranker Service"
                    description="Search result reranking service"
                    type="select"
                    value={configuration.searchReranker}
                    onChange={(value) => onConfigurationChange({ searchReranker: value as "Jina" | "Cohere" })}
                    options={["Jina", "Cohere"]}
                    data-testid="input-search-reranker"
                  />
                  <SettingInput
                    label="Safe Search"
                    description="Enable safe search filtering"
                    type="boolean"
                    value={configuration.searchSafeSearch}
                    onChange={(value) => onConfigurationChange({ searchSafeSearch: value as boolean })}
                    data-testid="input-search-safe-search"
                  />
                  <SettingInput
                    label="Search Timeout (ms)"
                    description="Search request timeout (1000-60000 ms)"
                    type="number"
                    value={configuration.searchTimeout}
                    onChange={(value) => onConfigurationChange({ searchTimeout: value as number })}
                    min={1000}
                    max={60000}
                    data-testid="input-search-timeout"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* MCP Configuration */}
          <TabsContent value="mcp">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg flex items-center justify-center">
                        <Network className="h-5 w-5 text-rose-600" />
                      </div>
                      <div>
                        <CardTitle>Model Context Protocol (MCP)</CardTitle>
                        <CardDescription>Configure MCP servers and connections</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status={configuration.mcpServers.length > 0 ? "valid" : "pending"} count={`${configuration.mcpServers.length} servers`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      MCP servers are currently configured from the provided librechat.yaml. 
                      Advanced MCP configuration will be available in future versions.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Current MCP Servers:</h4>
                      {configuration.mcpServers.length > 0 ? (
                        <div className="space-y-2">
                          {configuration.mcpServers.map((server, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
                              <div>
                                <span className="font-medium">{server.name}</span>
                                <span className="text-sm text-muted-foreground ml-2">({server.type})</span>
                              </div>
                              <Badge variant="secondary">{server.timeout}ms timeout</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No MCP servers configured</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* OCR Configuration */}
          <TabsContent value="ocr">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center">
                        <Camera className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <CardTitle>OCR Configuration</CardTitle>
                        <CardDescription>Configure optical character recognition</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status="valid" count="Complete" />
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SettingInput
                    label="OCR Provider"
                    description="OCR service provider"
                    type="select"
                    value={configuration.ocrProvider}
                    onChange={(value) => onConfigurationChange({ ocrProvider: value as "mistral" | "custom" })}
                    options={["mistral", "custom"]}
                    data-testid="input-ocr-provider"
                  />
                  <SettingInput
                    label="OCR Model"
                    description="Model used for OCR processing"
                    type="text"
                    value={configuration.ocrModel}
                    onChange={(value) => onConfigurationChange({ ocrModel: value as string })}
                    data-testid="input-ocr-model"
                  />
                  <SettingInput
                    label="OCR API Base URL"
                    description="Custom API base URL for OCR (optional)"
                    type="text"
                    value={configuration.ocrApiBase || ""}
                    onChange={(value) => onConfigurationChange({ ocrApiBase: value as string })}
                    placeholder="https://api.example.com"
                    data-testid="input-ocr-api-base"
                  />
                  <SettingInput
                    label="OCR API Key"
                    description="API key for OCR service (optional)"
                    type="password"
                    value={configuration.ocrApiKey || ""}
                    onChange={(value) => onConfigurationChange({ ocrApiKey: value as string })}
                    data-testid="input-ocr-api-key"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Actions Configuration */}
          <TabsContent value="actions">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-lime-100 to-lime-200 rounded-lg flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-lime-600" />
                      </div>
                      <div>
                        <CardTitle>Actions Configuration</CardTitle>
                        <CardDescription>Configure OpenAPI tools and actions</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status={configuration.actionsAllowedDomains.length > 0 ? "valid" : "pending"} count={`${configuration.actionsAllowedDomains.length} domains`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <SettingInput
                    label="Allowed Domains"
                    description="Domains allowed for OpenAPI tool actions"
                    type="array"
                    value={configuration.actionsAllowedDomains}
                    onChange={(value) => onConfigurationChange({ actionsAllowedDomains: value as string[] })}
                    placeholder="Add domain (e.g., api.example.com)"
                    data-testid="input-actions-allowed-domains"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Temporary Chats Configuration */}
          <TabsContent value="temp-chats">
            <div className="space-y-8">
              <Card className="card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <CardTitle>Temporary Chats Configuration</CardTitle>
                        <CardDescription>Configure chat retention settings</CardDescription>
                      </div>
                    </div>
                    <StatusIndicator status="valid" count="Complete" />
                  </div>
                </CardHeader>
                <CardContent>
                  <SettingInput
                    label="Retention Hours"
                    description="How long to keep temporary chats (1-8760 hours)"
                    type="number"
                    value={configuration.temporaryChatsRetentionHours}
                    onChange={(value) => onConfigurationChange({ temporaryChatsRetentionHours: value as number })}
                    min={1}
                    max={8760}
                    data-testid="input-temp-chats-retention"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Default: 720 hours (30 days). Maximum: 8760 hours (1 year).
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
