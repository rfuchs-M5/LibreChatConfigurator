import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Zap, 
  Settings, 
  Target, 
  CheckCircle, 
  Clock, 
  Gauge, 
  Database, 
  HardDrive, 
  Smartphone, 
  Monitor,
  Info 
} from "lucide-react";
import { useState, useEffect } from "react";

type CachingPreset = "performance" | "balanced" | "development" | "disabled" | "custom";

interface CachingConfig {
  preset: CachingPreset;
  cache?: boolean;
  staticCacheMaxAge?: number;
  staticCacheSMaxAge?: number;
  indexCacheControl?: string;
  indexPragma?: string;
  indexExpires?: string;
}

interface CachingIntegrationEditorProps {
  value: CachingConfig | null;
  onChange: (value: CachingConfig) => void;
  "data-testid"?: string;
}

// Predefined caching presets
const CACHING_PRESETS = {
  performance: {
    cache: true,
    staticCacheMaxAge: 31536000, // 1 year
    staticCacheSMaxAge: 31536000, // 1 year
    indexCacheControl: "public, max-age=86400", // 1 day
    indexPragma: "cache",
    indexExpires: "86400" // 1 day
  },
  balanced: {
    cache: true,
    staticCacheMaxAge: 604800, // 1 week
    staticCacheSMaxAge: 604800, // 1 week
    indexCacheControl: "public, max-age=3600", // 1 hour
    indexPragma: "cache",
    indexExpires: "3600" // 1 hour
  },
  development: {
    cache: true,
    staticCacheMaxAge: 3600, // 1 hour
    staticCacheSMaxAge: 3600, // 1 hour
    indexCacheControl: "no-cache, must-revalidate", 
    indexPragma: "no-cache",
    indexExpires: "0"
  },
  disabled: {
    cache: false,
    staticCacheMaxAge: 0,
    staticCacheSMaxAge: 0,
    indexCacheControl: "no-store, no-cache, must-revalidate",
    indexPragma: "no-cache", 
    indexExpires: "0"
  }
};

const PRESET_INFO = {
  performance: {
    icon: <Gauge className="h-4 w-4" />,
    title: "Performance Optimized",
    description: "Maximum caching for production sites with stable content",
    badge: "Production",
    color: "bg-green-500",
    features: [
      "Static files cached for 1 year",
      "Aggressive browser caching",
      "Fastest loading times",
      "Best for live websites"
    ]
  },
  balanced: {
    icon: <Target className="h-4 w-4" />,
    title: "Balanced Caching",
    description: "Smart caching balance between performance and flexibility",
    badge: "Recommended", 
    color: "bg-blue-500",
    features: [
      "Static files cached for 1 week",
      "Moderate browser caching",
      "Good performance + updates",
      "Best for most deployments"
    ]
  },
  development: {
    icon: <Settings className="h-4 w-4" />,
    title: "Development Mode",
    description: "Short cache durations for easy content updates",
    badge: "Development",
    color: "bg-yellow-500",
    features: [
      "Static files cached for 1 hour",
      "Quick cache invalidation",
      "Easy to see changes",
      "Perfect for testing"
    ]
  },
  disabled: {
    icon: <Database className="h-4 w-4" />,
    title: "No Caching",
    description: "All caching disabled for debugging and development",
    badge: "Debug Only",
    color: "bg-red-500",
    features: [
      "No browser caching",
      "Every request is fresh",
      "Immediate content updates", 
      "Debugging scenarios only"
    ]
  },
  custom: {
    icon: <Settings className="h-4 w-4" />,
    title: "User Defined",
    description: "Configure individual caching settings manually",
    badge: "Custom",
    color: "bg-purple-500",
    features: [
      "Full control over settings",
      "Custom cache durations",
      "Advanced configuration",
      "Expert users only"
    ]
  }
};

export function CachingIntegrationEditor({ value, onChange, "data-testid": testId }: CachingIntegrationEditorProps) {
  const [config, setConfig] = useState<CachingConfig>(() => {
    // Determine current preset based on existing configuration
    const hasCustomConfig = value?.cache !== undefined || 
                           value?.staticCacheMaxAge !== undefined ||
                           value?.staticCacheSMaxAge !== undefined;
    
    if (!hasCustomConfig) {
      return { preset: "balanced" }; // Default preset
    }

    // Try to match existing config to a preset
    for (const [presetName, presetConfig] of Object.entries(CACHING_PRESETS)) {
      const matches = Object.entries(presetConfig).every(([key, val]) => {
        return value?.[key as keyof CachingConfig] === val;
      });
      if (matches) {
        return { ...value, preset: presetName as CachingPreset };
      }
    }

    // If no preset matches, mark as custom
    return { ...value, preset: "custom" };
  });

  useEffect(() => {
    // Map caching config to base configuration fields
    const baseConfig = config.preset !== "custom" 
      ? CACHING_PRESETS[config.preset as keyof typeof CACHING_PRESETS]
      : {
          cache: config.cache,
          staticCacheMaxAge: config.staticCacheMaxAge,
          staticCacheSMaxAge: config.staticCacheSMaxAge,
          indexCacheControl: config.indexCacheControl,
          indexPragma: config.indexPragma,
          indexExpires: config.indexExpires
        };

    onChange({ preset: config.preset, ...baseConfig });
  }, [config, onChange]);

  const updateConfig = (updates: Partial<CachingConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const applyPreset = (preset: CachingPreset) => {
    if (preset === "custom") {
      // Switch to custom mode but preserve current values
      setConfig(prev => ({ ...prev, preset: "custom" }));
      return;
    }
    
    const presetConfig = CACHING_PRESETS[preset];
    setConfig({ ...presetConfig, preset });
  };

  const formatTime = (seconds: number): string => {
    if (seconds === 0) return "Disabled";
    if (seconds < 60) return `${seconds} seconds`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days`;
    if (seconds < 31536000) return `${Math.floor(seconds / 604800)} weeks`;
    return `${Math.floor(seconds / 31536000)} years`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <HardDrive className="h-4 w-4" />
        <span className="text-sm font-medium">Caching Configuration</span>
        {config.preset !== "custom" && (
          <Badge variant="secondary">{PRESET_INFO[config.preset]?.badge}</Badge>
        )}
      </div>

      {/* Educational Information */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Caching Configuration</strong><br />
          Caching improves your LibreChat performance by storing frequently-used files in users' browsers and CDN networks. Choose a preset that matches your deployment needs, or configure custom settings for advanced control.
        </AlertDescription>
      </Alert>

      {/* Preset Selection */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Choose Caching Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(PRESET_INFO).map(([presetKey, info]) => {
            const preset = presetKey as CachingPreset;
            const isSelected = config.preset === preset;
            
            return (
              <Card 
                key={preset}
                className={`cursor-pointer transition-all border-2 ${
                  isSelected 
                    ? 'border-primary shadow-md' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => applyPreset(preset)}
                data-testid={`card-preset-${preset}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2">
                      {info.icon}
                      {info.title}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-white ${info.color}`}
                    >
                      {info.badge}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {info.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    {info.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Configuration Summary */}
      {config.preset !== "custom" && (
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
              Current Configuration: {PRESET_INFO[config.preset]?.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs font-medium text-muted-foreground">Cache Status</Label>
                <div className="flex items-center gap-2">
                  {config.cache ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <Database className="h-3 w-3 text-red-600" />
                  )}
                  <span>{config.cache ? "Enabled" : "Disabled"}</span>
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground">Static Files</Label>
                <div className="flex items-center gap-2">
                  <HardDrive className="h-3 w-3" />
                  <span>{formatTime(config.staticCacheMaxAge || 0)}</span>
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground">Browser Cache</Label>
                <div className="flex items-center gap-2">
                  <Monitor className="h-3 w-3" />
                  <span>{config.indexCacheControl || "Not set"}</span>
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-muted-foreground">Mobile Optimized</Label>
                <div className="flex items-center gap-2">
                  <Smartphone className="h-3 w-3" />
                  <span>{config.cache ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="p-3 bg-muted rounded-md">
              <h5 className="text-xs font-medium mb-2">Performance Impact:</h5>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>✓ Page load speed: {config.preset === "performance" ? "Fastest" : config.preset === "balanced" ? "Fast" : config.preset === "development" ? "Good" : "Slowest"}</li>
                <li>✓ Content freshness: {config.preset === "disabled" ? "Immediate" : config.preset === "development" ? "Quick" : config.preset === "balanced" ? "Moderate" : "Delayed"}</li>
                <li>✓ Server load: {config.preset === "performance" ? "Minimal" : config.preset === "balanced" ? "Low" : config.preset === "development" ? "Moderate" : "High"}</li>
                <li>✓ Bandwidth usage: {config.cache ? "Optimized" : "Full"}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Configuration Interface */}
      {config.preset === "custom" && (
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4" />
              User Defined Configuration
              <Badge variant="secondary" className="text-white bg-purple-500">Custom</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure individual caching settings manually for advanced control.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic Cache Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="cache-enabled"
                checked={config.cache || false}
                onCheckedChange={(enabled) => updateConfig({ cache: enabled })}
                data-testid="toggle-cache-enabled"
              />
              <Label htmlFor="cache-enabled">Enable Caching</Label>
            </div>

            <Separator />

            {/* Static File Caching */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Static File Caching</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="static-cache-max-age">Static Cache Max Age (seconds)</Label>
                  <Input
                    id="static-cache-max-age"
                    type="number"
                    value={config.staticCacheMaxAge || 0}
                    onChange={(e) => updateConfig({ staticCacheMaxAge: parseInt(e.target.value) || 0 })}
                    placeholder="31536000"
                    data-testid="input-static-cache-max-age"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    How long browsers cache static files (e.g., 31536000 = 1 year)
                  </p>
                </div>
                <div>
                  <Label htmlFor="static-cache-s-max-age">Static Cache S-Max-Age (seconds)</Label>
                  <Input
                    id="static-cache-s-max-age"
                    type="number"
                    value={config.staticCacheSMaxAge || 0}
                    onChange={(e) => updateConfig({ staticCacheSMaxAge: parseInt(e.target.value) || 0 })}
                    placeholder="31536000"
                    data-testid="input-static-cache-s-max-age"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Shared cache (CDN) duration for static files
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Index/Page Caching */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Page Caching Headers</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="index-cache-control">Cache-Control Header</Label>
                  <Input
                    id="index-cache-control"
                    value={config.indexCacheControl || ""}
                    onChange={(e) => updateConfig({ indexCacheControl: e.target.value })}
                    placeholder="public, max-age=3600"
                    data-testid="input-index-cache-control"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    HTTP Cache-Control header for pages
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="index-pragma">Pragma Header</Label>
                    <Input
                      id="index-pragma"
                      value={config.indexPragma || ""}
                      onChange={(e) => updateConfig({ indexPragma: e.target.value })}
                      placeholder="cache"
                      data-testid="input-index-pragma"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Legacy cache directive
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="index-expires">Expires Header</Label>
                    <Input
                      id="index-expires"
                      value={config.indexExpires || ""}
                      onChange={(e) => updateConfig({ indexExpires: e.target.value })}
                      placeholder="3600"
                      data-testid="input-index-expires"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Expiration time in seconds
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="mt-4">
              <Label className="text-sm font-medium">Quick Fill from Preset:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(CACHING_PRESETS).map(([presetKey, presetConfig]) => (
                  <Button
                    key={presetKey}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateConfig({
                        ...presetConfig,
                        preset: "custom" // Keep it as custom after filling
                      });
                    }}
                    data-testid={`button-fill-${presetKey}`}
                  >
                    Fill from {presetKey.charAt(0).toUpperCase() + presetKey.slice(1)}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Use preset values as a starting point, then modify as needed.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}