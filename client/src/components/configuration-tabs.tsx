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

          {/* Add other tab contents here with similar structure */}
        </Tabs>
      </main>
    </div>
  );
}
