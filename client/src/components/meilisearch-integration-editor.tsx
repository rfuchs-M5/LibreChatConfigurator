import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Database, Container, Trash2, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface MeiliSearchConfig {
  enabled: boolean;
  search?: boolean;
  meilisearchURL?: string;
  meilisearchMasterKey?: string;
  meiliNoAnalytics?: boolean;
  dockerIntegration?: boolean;
  dockerServiceName?: string;
}

interface MeiliSearchIntegrationEditorProps {
  value: MeiliSearchConfig | null;
  onChange: (value: MeiliSearchConfig) => void;
  "data-testid"?: string;
}

// Generate secure random key for MeiliSearch
const generateSecureKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export function MeiliSearchIntegrationEditor({ value, onChange, "data-testid": testId }: MeiliSearchIntegrationEditorProps) {
  const [config, setConfig] = useState<MeiliSearchConfig>(() => {
    // Determine if MeiliSearch is currently enabled
    const hasConfig = value?.search || value?.meilisearchURL || value?.meilisearchMasterKey;
    
    return {
      enabled: Boolean(hasConfig),
      search: value?.search ?? false,
      meilisearchURL: value?.meilisearchURL || "",
      meilisearchMasterKey: value?.meilisearchMasterKey || "",
      meiliNoAnalytics: value?.meiliNoAnalytics ?? true,
      dockerIntegration: value?.dockerIntegration ?? true,
      dockerServiceName: value?.dockerServiceName || "meilisearch",
      ...value
    };
  });

  useEffect(() => {
    // Only propagate changes when user actively modifies configuration
    if (config.enabled) {
      // Map integration config to base configuration fields
      onChange({
        search: config.search,
        meilisearchURL: config.meilisearchURL,
        meilisearchMasterKey: config.meilisearchMasterKey,
        meiliNoAnalytics: config.meiliNoAnalytics
      });
    } else {
      // When disabled, clear the MeiliSearch fields
      onChange({
        search: false,
        meilisearchURL: undefined,
        meilisearchMasterKey: undefined,
        meiliNoAnalytics: true
      });
    }
  }, [config, onChange]);

  const updateConfig = (updates: Partial<MeiliSearchConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const enableMeiliSearch = () => {
    const autoConfig = {
      enabled: true,
      search: true,
      meilisearchURL: "http://meilisearch:7700",
      meilisearchMasterKey: generateSecureKey(),
      meiliNoAnalytics: true,
      dockerIntegration: true,
      dockerServiceName: "meilisearch"
    };
    
    setConfig(autoConfig);
    onChange(autoConfig);
  };

  const disableMeiliSearch = () => {
    const disabledConfig = {
      enabled: false,
      search: false,
      meilisearchURL: "",
      meilisearchMasterKey: "",
      meiliNoAnalytics: true,
      dockerIntegration: false,
      dockerServiceName: "meilisearch"
    };
    
    setConfig(disabledConfig);
    onChange(disabledConfig);
  };

  const regenerateKey = () => {
    const newKey = generateSecureKey();
    updateConfig({ meilisearchMasterKey: newKey });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        <span className="text-sm font-medium">MeiliSearch Integration</span>
        {config.enabled && <Badge variant="secondary">Enabled</Badge>}
      </div>

      {/* Educational Information */}
      <Alert>
        <Search className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>MeiliSearch Integration</strong><br />
          MeiliSearch is a fast, open-source search engine that can be connected to LibreChat. When enabled, it indexes your conversations and optional knowledge base so you can quickly search past chats or retrieve relevant documents. This improves context retrieval and makes the chat experience more powerful and efficient.
        </AlertDescription>
      </Alert>

      {/* Main Configuration */}
      {!config.enabled ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Database className="h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Enable MeiliSearch Integration</h3>
            <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
              Get powerful conversation search capabilities with one click. Includes automatic Docker setup and secure configuration.
            </p>
            <Button 
              onClick={enableMeiliSearch}
              className="flex items-center gap-2"
              data-testid="button-enable-meilisearch"
            >
              <Zap className="h-4 w-4" />
              Enable MeiliSearch (1-Click Setup)
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Status Card */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  MeiliSearch Enabled
                  <Badge variant="secondary">Active</Badge>
                </div>
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={disableMeiliSearch}
                  className="flex items-center gap-1"
                  data-testid="button-disable-meilisearch"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </Button>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Search functionality is active with secure configuration and Docker integration
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Basic Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="search-enabled"
                    checked={config.search || false}
                    onCheckedChange={(enabled) => updateConfig({ search: enabled })}
                    data-testid="toggle-search-enabled"
                  />
                  <Label htmlFor="search-enabled">Enable Search</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="no-analytics"
                    checked={config.meiliNoAnalytics || false}
                    onCheckedChange={(enabled) => updateConfig({ meiliNoAnalytics: enabled })}
                    data-testid="toggle-no-analytics"
                  />
                  <Label htmlFor="no-analytics">Privacy Mode (No Analytics)</Label>
                </div>
              </div>

              <Separator />

              {/* Connection Settings */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Connection Settings
                </h4>
                
                <div>
                  <Label htmlFor="meilisearch-url">MeiliSearch URL *</Label>
                  <Input
                    id="meilisearch-url"
                    value={config.meilisearchURL || ""}
                    onChange={(e) => updateConfig({ meilisearchURL: e.target.value })}
                    placeholder="http://meilisearch:7700"
                    data-testid="input-meilisearch-url"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Docker service URL or external MeiliSearch instance
                  </p>
                </div>

                <div>
                  <Label htmlFor="master-key">Master Key *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="master-key"
                      type="password"
                      value={config.meilisearchMasterKey || ""}
                      onChange={(e) => updateConfig({ meilisearchMasterKey: e.target.value })}
                      placeholder="Auto-generated secure key"
                      className="font-mono"
                      data-testid="input-master-key"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={regenerateKey}
                      data-testid="button-regenerate-key"
                    >
                      Regenerate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Authentication key for MeiliSearch API access
                  </p>
                </div>
              </div>

              <Separator />

              {/* Docker Integration */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Container className="h-4 w-4" />
                  Docker Integration
                </h4>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="docker-integration"
                    checked={config.dockerIntegration || false}
                    onCheckedChange={(enabled) => updateConfig({ dockerIntegration: enabled })}
                    data-testid="toggle-docker-integration"
                  />
                  <Label htmlFor="docker-integration">Include MeiliSearch in Docker Compose</Label>
                </div>

                {config.dockerIntegration && (
                  <div>
                    <Label htmlFor="docker-service-name">Docker Service Name</Label>
                    <Input
                      id="docker-service-name"
                      value={config.dockerServiceName || "meilisearch"}
                      onChange={(e) => updateConfig({ dockerServiceName: e.target.value })}
                      placeholder="meilisearch"
                      data-testid="input-docker-service-name"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Name of the MeiliSearch service in docker-compose.yml
                    </p>
                  </div>
                )}

                {config.dockerIntegration && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <strong>Docker Setup Included:</strong> When you generate a deployment package, a MeiliSearch service will be automatically added to your docker-compose.yml with proper volume persistence and networking configuration.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Configuration Summary */}
              <div className="mt-4 p-3 bg-muted rounded-md">
                <h5 className="text-xs font-medium mb-2">Configuration Summary:</h5>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>✓ Search indexing: {config.search ? 'Enabled' : 'Disabled'}</li>
                  <li>✓ Privacy mode: {config.meiliNoAnalytics ? 'Enabled' : 'Disabled'}</li>
                  <li>✓ Docker integration: {config.dockerIntegration ? 'Enabled' : 'Disabled'}</li>
                  <li>✓ Service URL: {config.meilisearchURL || 'Not set'}</li>
                  <li>✓ Authentication: {config.meilisearchMasterKey ? 'Configured' : 'Not set'}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}