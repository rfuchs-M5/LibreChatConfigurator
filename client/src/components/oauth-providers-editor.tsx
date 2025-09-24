import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Key, Github, Chrome, MessageCircle, Apple, Globe, Settings } from "lucide-react";
import { useState, useEffect } from "react";

interface OAuthProvider {
  enabled: boolean;
  clientId?: string;
  clientSecret?: string;
  callbackURL?: string;
  // Apple-specific
  privateKey?: string;
  keyId?: string;
  teamId?: string;
  // OpenID-specific  
  url?: string;
  scope?: string;
  sessionSecret?: string;
  issuer?: string;
  buttonLabel?: string;
  imageURL?: string;
}

interface OAuthConfig {
  google?: OAuthProvider;
  github?: OAuthProvider;
  discord?: OAuthProvider;
  facebook?: OAuthProvider;
  apple?: OAuthProvider;
  openid?: OAuthProvider;
}

interface OAuthProvidersEditorProps {
  value: OAuthConfig | null;
  onChange: (value: OAuthConfig) => void;
  "data-testid"?: string;
}

export function OAuthProvidersEditor({ value, onChange, "data-testid": testId }: OAuthProvidersEditorProps) {
  const [config, setConfig] = useState<OAuthConfig>({
    google: { enabled: false },
    github: { enabled: false },
    discord: { enabled: false },
    facebook: { enabled: false },
    apple: { enabled: false },
    openid: { enabled: false },
    ...value
  });

  useEffect(() => {
    onChange(config);
  }, [config, onChange]);

  const updateProvider = (provider: keyof OAuthConfig, updates: Partial<OAuthProvider>) => {
    setConfig(prev => ({
      ...prev,
      [provider]: { ...prev[provider], ...updates }
    }));
  };

  const toggleProvider = (provider: keyof OAuthConfig, enabled: boolean) => {
    updateProvider(provider, { enabled });
  };

  const getEnabledCount = () => {
    return Object.values(config).filter(provider => provider?.enabled).length;
  };

  const renderProviderCard = (
    providerKey: keyof OAuthConfig,
    providerName: string,
    icon: React.ReactNode,
    color: string,
    fields: React.ReactNode
  ) => {
    const provider = config[providerKey];
    const isEnabled = provider?.enabled || false;

    return (
      <Card key={providerKey} className={`border-l-4 ${isEnabled ? color : 'border-l-gray-300'} ${isEnabled ? '' : 'opacity-60'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              {icon}
              {providerName}
              {isEnabled && <Badge variant="secondary">Enabled</Badge>}
            </CardTitle>
            <Switch
              checked={isEnabled}
              onCheckedChange={(enabled) => toggleProvider(providerKey, enabled)}
              data-testid={`toggle-${providerKey}-oauth`}
            />
          </div>
        </CardHeader>
        
        {isEnabled && (
          <CardContent className="space-y-4">
            {fields}
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4" />
          <span className="text-sm font-medium">OAuth Providers</span>
          <Badge variant="secondary">{getEnabledCount()} enabled</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Enable only the providers you need
        </p>
      </div>

      {getEnabledCount() === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Key className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No OAuth providers enabled</p>
              <p className="text-xs text-muted-foreground">Enable providers below to configure social login</p>
            </div>
          </CardContent>
        </Card>
      )}

      {renderProviderCard(
        "google",
        "Google OAuth",
        <Chrome className="h-4 w-4" />,
        "border-l-blue-500",
        <div className="space-y-3">
          <div>
            <Label htmlFor="google-client-id">Client ID *</Label>
            <Input
              id="google-client-id"
              value={config.google?.clientId || ""}
              onChange={(e) => updateProvider("google", { clientId: e.target.value })}
              placeholder="Enter Google OAuth Client ID"
              data-testid="input-google-client-id"
            />
          </div>
          <div>
            <Label htmlFor="google-client-secret">Client Secret *</Label>
            <Input
              id="google-client-secret"
              type="password"
              value={config.google?.clientSecret || ""}
              onChange={(e) => updateProvider("google", { clientSecret: e.target.value })}
              placeholder="Enter Google OAuth Client Secret"
              className="font-mono"
              data-testid="input-google-client-secret"
            />
          </div>
          <div>
            <Label htmlFor="google-callback-url">Callback URL</Label>
            <Input
              id="google-callback-url"
              value={config.google?.callbackURL || ""}
              onChange={(e) => updateProvider("google", { callbackURL: e.target.value })}
              placeholder="https://yourdomain.com/oauth/google/callback"
              data-testid="input-google-callback-url"
            />
          </div>
        </div>
      )}

      {renderProviderCard(
        "github",
        "GitHub OAuth",
        <Github className="h-4 w-4" />,
        "border-l-gray-800",
        <div className="space-y-3">
          <div>
            <Label htmlFor="github-client-id">Client ID *</Label>
            <Input
              id="github-client-id"
              value={config.github?.clientId || ""}
              onChange={(e) => updateProvider("github", { clientId: e.target.value })}
              placeholder="Enter GitHub OAuth Client ID"
              data-testid="input-github-client-id"
            />
          </div>
          <div>
            <Label htmlFor="github-client-secret">Client Secret *</Label>
            <Input
              id="github-client-secret"
              type="password"
              value={config.github?.clientSecret || ""}
              onChange={(e) => updateProvider("github", { clientSecret: e.target.value })}
              placeholder="Enter GitHub OAuth Client Secret"
              className="font-mono"
              data-testid="input-github-client-secret"
            />
          </div>
          <div>
            <Label htmlFor="github-callback-url">Callback URL</Label>
            <Input
              id="github-callback-url"
              value={config.github?.callbackURL || ""}
              onChange={(e) => updateProvider("github", { callbackURL: e.target.value })}
              placeholder="https://yourdomain.com/oauth/github/callback"
              data-testid="input-github-callback-url"
            />
          </div>
        </div>
      )}

      {renderProviderCard(
        "discord",
        "Discord OAuth",
        <MessageCircle className="h-4 w-4" />,
        "border-l-indigo-500",
        <div className="space-y-3">
          <div>
            <Label htmlFor="discord-client-id">Client ID *</Label>
            <Input
              id="discord-client-id"
              value={config.discord?.clientId || ""}
              onChange={(e) => updateProvider("discord", { clientId: e.target.value })}
              placeholder="Enter Discord OAuth Client ID"
              data-testid="input-discord-client-id"
            />
          </div>
          <div>
            <Label htmlFor="discord-client-secret">Client Secret *</Label>
            <Input
              id="discord-client-secret"
              type="password"
              value={config.discord?.clientSecret || ""}
              onChange={(e) => updateProvider("discord", { clientSecret: e.target.value })}
              placeholder="Enter Discord OAuth Client Secret"
              className="font-mono"
              data-testid="input-discord-client-secret"
            />
          </div>
          <div>
            <Label htmlFor="discord-callback-url">Callback URL</Label>
            <Input
              id="discord-callback-url"
              value={config.discord?.callbackURL || ""}
              onChange={(e) => updateProvider("discord", { callbackURL: e.target.value })}
              placeholder="https://yourdomain.com/oauth/discord/callback"
              data-testid="input-discord-callback-url"
            />
          </div>
        </div>
      )}

      {renderProviderCard(
        "facebook",
        "Facebook OAuth",
        <Globe className="h-4 w-4" />,
        "border-l-blue-600",
        <div className="space-y-3">
          <div>
            <Label htmlFor="facebook-client-id">Client ID *</Label>
            <Input
              id="facebook-client-id"
              value={config.facebook?.clientId || ""}
              onChange={(e) => updateProvider("facebook", { clientId: e.target.value })}
              placeholder="Enter Facebook OAuth Client ID"
              data-testid="input-facebook-client-id"
            />
          </div>
          <div>
            <Label htmlFor="facebook-client-secret">Client Secret *</Label>
            <Input
              id="facebook-client-secret"
              type="password"
              value={config.facebook?.clientSecret || ""}
              onChange={(e) => updateProvider("facebook", { clientSecret: e.target.value })}
              placeholder="Enter Facebook OAuth Client Secret"
              className="font-mono"
              data-testid="input-facebook-client-secret"
            />
          </div>
          <div>
            <Label htmlFor="facebook-callback-url">Callback URL</Label>
            <Input
              id="facebook-callback-url"
              value={config.facebook?.callbackURL || ""}
              onChange={(e) => updateProvider("facebook", { callbackURL: e.target.value })}
              placeholder="https://yourdomain.com/oauth/facebook/callback"
              data-testid="input-facebook-callback-url"
            />
          </div>
        </div>
      )}

      {renderProviderCard(
        "apple",
        "Apple OAuth",
        <Apple className="h-4 w-4" />,
        "border-l-gray-900",
        <div className="space-y-3">
          <div>
            <Label htmlFor="apple-client-id">Client ID *</Label>
            <Input
              id="apple-client-id"
              value={config.apple?.clientId || ""}
              onChange={(e) => updateProvider("apple", { clientId: e.target.value })}
              placeholder="Enter Apple OAuth Client ID"
              data-testid="input-apple-client-id"
            />
          </div>
          <div>
            <Label htmlFor="apple-private-key">Private Key *</Label>
            <Textarea
              id="apple-private-key"
              value={config.apple?.privateKey || ""}
              onChange={(e) => updateProvider("apple", { privateKey: e.target.value })}
              placeholder="Enter Apple OAuth Private Key (PEM format)"
              rows={4}
              className="font-mono text-xs"
              data-testid="input-apple-private-key"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="apple-key-id">Key ID *</Label>
              <Input
                id="apple-key-id"
                value={config.apple?.keyId || ""}
                onChange={(e) => updateProvider("apple", { keyId: e.target.value })}
                placeholder="Apple Key ID"
                data-testid="input-apple-key-id"
              />
            </div>
            <div>
              <Label htmlFor="apple-team-id">Team ID *</Label>
              <Input
                id="apple-team-id"
                value={config.apple?.teamId || ""}
                onChange={(e) => updateProvider("apple", { teamId: e.target.value })}
                placeholder="Apple Team ID"
                data-testid="input-apple-team-id"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="apple-callback-url">Callback URL</Label>
            <Input
              id="apple-callback-url"
              value={config.apple?.callbackURL || ""}
              onChange={(e) => updateProvider("apple", { callbackURL: e.target.value })}
              placeholder="https://yourdomain.com/oauth/apple/callback"
              data-testid="input-apple-callback-url"
            />
          </div>
        </div>
      )}

      {renderProviderCard(
        "openid",
        "OpenID Connect",
        <Settings className="h-4 w-4" />,
        "border-l-orange-500",
        <div className="space-y-3">
          <div>
            <Label htmlFor="openid-url">OpenID Provider URL *</Label>
            <Input
              id="openid-url"
              value={config.openid?.url || ""}
              onChange={(e) => updateProvider("openid", { url: e.target.value })}
              placeholder="https://your-openid-provider.com"
              data-testid="input-openid-url"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="openid-client-id">Client ID *</Label>
              <Input
                id="openid-client-id"
                value={config.openid?.clientId || ""}
                onChange={(e) => updateProvider("openid", { clientId: e.target.value })}
                placeholder="OpenID Client ID"
                data-testid="input-openid-client-id"
              />
            </div>
            <div>
              <Label htmlFor="openid-client-secret">Client Secret *</Label>
              <Input
                id="openid-client-secret"
                type="password"
                value={config.openid?.clientSecret || ""}
                onChange={(e) => updateProvider("openid", { clientSecret: e.target.value })}
                placeholder="OpenID Client Secret"
                className="font-mono"
                data-testid="input-openid-client-secret"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="openid-scope">Scope</Label>
            <Input
              id="openid-scope"
              value={config.openid?.scope || ""}
              onChange={(e) => updateProvider("openid", { scope: e.target.value })}
              placeholder="openid profile email"
              data-testid="input-openid-scope"
            />
          </div>
          <div>
            <Label htmlFor="openid-callback-url">Callback URL</Label>
            <Input
              id="openid-callback-url"
              value={config.openid?.callbackURL || ""}
              onChange={(e) => updateProvider("openid", { callbackURL: e.target.value })}
              placeholder="https://yourdomain.com/oauth/openid/callback"
              data-testid="input-openid-callback-url"
            />
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Advanced Settings</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="openid-issuer">Issuer</Label>
                <Input
                  id="openid-issuer"
                  value={config.openid?.issuer || ""}
                  onChange={(e) => updateProvider("openid", { issuer: e.target.value })}
                  placeholder="OpenID Issuer"
                  data-testid="input-openid-issuer"
                />
              </div>
              <div>
                <Label htmlFor="openid-button-label">Button Label</Label>
                <Input
                  id="openid-button-label"
                  value={config.openid?.buttonLabel || ""}
                  onChange={(e) => updateProvider("openid", { buttonLabel: e.target.value })}
                  placeholder="Sign in with OpenID"
                  data-testid="input-openid-button-label"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="openid-session-secret">Session Secret</Label>
                <Input
                  id="openid-session-secret"
                  type="password"
                  value={config.openid?.sessionSecret || ""}
                  onChange={(e) => updateProvider("openid", { sessionSecret: e.target.value })}
                  placeholder="OpenID Session Secret"
                  className="font-mono"
                  data-testid="input-openid-session-secret"
                />
              </div>
              <div>
                <Label htmlFor="openid-image-url">Button Image URL</Label>
                <Input
                  id="openid-image-url"
                  value={config.openid?.imageURL || ""}
                  onChange={(e) => updateProvider("openid", { imageURL: e.target.value })}
                  placeholder="https://example.com/oauth-logo.png"
                  data-testid="input-openid-image-url"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}