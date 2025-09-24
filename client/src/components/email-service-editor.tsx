import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Server, Send, Settings } from "lucide-react";
import { useState, useEffect } from "react";

interface EmailConfig {
  serviceType: "smtp" | "mailgun" | "";
  // SMTP settings
  emailService?: string;
  emailUsername?: string;
  emailPassword?: string;
  emailFrom?: string;
  emailFromName?: string;
  // Mailgun settings
  mailgunApiKey?: string;
  mailgunDomain?: string;
  mailgunHost?: string;
}

interface EmailServiceEditorProps {
  value: EmailConfig | null;
  onChange: (value: EmailConfig) => void;
  "data-testid"?: string;
}

export function EmailServiceEditor({ value, onChange, "data-testid": testId }: EmailServiceEditorProps) {
  const [config, setConfig] = useState<EmailConfig>(() => {
    // Infer service type from existing configuration
    const hasSmtpFields = value?.emailService || value?.emailUsername || value?.emailPassword;
    const hasMailgunFields = value?.mailgunApiKey || value?.mailgunDomain;
    
    return {
      serviceType: hasMailgunFields ? "mailgun" : hasSmtpFields ? "smtp" : "",
      ...value
    };
  });

  useEffect(() => {
    // Only trigger onChange when user actively changes something, not on mount
    if (config.serviceType) {
      onChange(config);
    }
  }, [config, onChange]);

  const updateConfig = (updates: Partial<EmailConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleServiceTypeChange = (serviceType: EmailConfig["serviceType"]) => {
    updateConfig({ serviceType });
  };

  const serviceOptions = [
    { value: "", label: "Select Email Service", disabled: true },
    { value: "smtp", label: "Standard SMTP", icon: Mail },
    { value: "mailgun", label: "Mailgun Service", icon: Send },
  ];

  const getServiceInfo = (serviceType: string) => {
    switch (serviceType) {
      case "smtp":
        return {
          title: "Standard SMTP Email",
          description: "Configure standard SMTP server for sending emails",
          icon: <Mail className="h-4 w-4" />,
          color: "border-l-blue-500",
        };
      case "mailgun":
        return {
          title: "Mailgun Email Service",
          description: "Use Mailgun's email delivery service",
          icon: <Send className="h-4 w-4" />,
          color: "border-l-orange-500",
        };
      default:
        return null;
    }
  };

  const renderServiceConfig = () => {
    const serviceInfo = getServiceInfo(config.serviceType);
    if (!serviceInfo) return null;

    return (
      <Card className={`border-l-4 ${serviceInfo.color}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            {serviceInfo.icon}
            {serviceInfo.title}
            <Badge variant="secondary">Active</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{serviceInfo.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {config.serviceType === "smtp" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="email-service">SMTP Service Provider</Label>
                <Input
                  id="email-service"
                  value={config.emailService || ""}
                  onChange={(e) => updateConfig({ emailService: e.target.value })}
                  placeholder="gmail, outlook, sendgrid, etc."
                  data-testid="input-email-service"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email service provider (e.g., Gmail, Outlook, SendGrid)
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="email-username">SMTP Username *</Label>
                  <Input
                    id="email-username"
                    value={config.emailUsername || ""}
                    onChange={(e) => updateConfig({ emailUsername: e.target.value })}
                    placeholder="your-email@example.com"
                    data-testid="input-email-username"
                  />
                </div>
                <div>
                  <Label htmlFor="email-password">SMTP Password *</Label>
                  <Input
                    id="email-password"
                    type="password"
                    value={config.emailPassword || ""}
                    onChange={(e) => updateConfig({ emailPassword: e.target.value })}
                    placeholder="App password or SMTP password"
                    className="font-mono"
                    data-testid="input-email-password"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="email-from">From Email Address *</Label>
                  <Input
                    id="email-from"
                    type="email"
                    value={config.emailFrom || ""}
                    onChange={(e) => updateConfig({ emailFrom: e.target.value })}
                    placeholder="noreply@yourdomain.com"
                    data-testid="input-email-from"
                  />
                </div>
                <div>
                  <Label htmlFor="email-from-name">From Name</Label>
                  <Input
                    id="email-from-name"
                    value={config.emailFromName || ""}
                    onChange={(e) => updateConfig({ emailFromName: e.target.value })}
                    placeholder="LibreChat Support"
                    data-testid="input-email-from-name"
                  />
                </div>
              </div>
            </div>
          )}

          {config.serviceType === "mailgun" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="mailgun-api-key">Mailgun API Key *</Label>
                <Input
                  id="mailgun-api-key"
                  type="password"
                  value={config.mailgunApiKey || ""}
                  onChange={(e) => updateConfig({ mailgunApiKey: e.target.value })}
                  placeholder="key-..."
                  className="font-mono"
                  data-testid="input-mailgun-api-key"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="mailgun-domain">Mailgun Domain *</Label>
                  <Input
                    id="mailgun-domain"
                    value={config.mailgunDomain || ""}
                    onChange={(e) => updateConfig({ mailgunDomain: e.target.value })}
                    placeholder="mg.yourdomain.com"
                    data-testid="input-mailgun-domain"
                  />
                </div>
                <div>
                  <Label htmlFor="mailgun-host">Mailgun Host</Label>
                  <Input
                    id="mailgun-host"
                    value={config.mailgunHost || ""}
                    onChange={(e) => updateConfig({ mailgunHost: e.target.value })}
                    placeholder="api.mailgun.net"
                    data-testid="input-mailgun-host"
                  />
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                <p>💡 <strong>Mailgun Setup:</strong></p>
                <p>1. Create account at <strong>mailgun.com</strong></p>
                <p>2. Verify your domain in Mailgun dashboard</p>
                <p>3. Copy API key and domain from your Mailgun settings</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Server className="h-4 w-4" />
        <span className="text-sm font-medium">Email Service Configuration</span>
        {config.serviceType && <Badge variant="secondary">{getServiceInfo(config.serviceType)?.title}</Badge>}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email-service-type">Email Service Type *</Label>
          <Select value={config.serviceType} onValueChange={handleServiceTypeChange} data-testid="select-email-service-type">
            <SelectTrigger>
              <SelectValue placeholder="Select email service provider" />
            </SelectTrigger>
            <SelectContent>
              {serviceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  <div className="flex items-center gap-2">
                    {option.icon && <option.icon className="h-4 w-4" />}
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Choose how LibreChat will send emails (password resets, notifications, etc.)
          </p>
        </div>

        {config.serviceType ? (
          renderServiceConfig()
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Settings className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Select an email service to configure</p>
                <p className="text-xs text-muted-foreground">LibreChat needs email service for password resets and notifications</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}