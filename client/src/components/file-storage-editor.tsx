import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { HardDrive, Cloud, Database, FileText, Settings2 } from "lucide-react";
import { useState, useEffect } from "react";

interface FileStorageConfig {
  strategy: "local" | "firebase" | "azure_blob" | "s3" | "";
  // Local storage
  fileUploadPath?: string;
  // Firebase storage
  firebaseApiKey?: string;
  firebaseAuthDomain?: string;
  firebaseProjectId?: string;
  firebaseStorageBucket?: string;
  firebaseMessagingSenderId?: string;
  firebaseAppId?: string;
  // Azure storage
  azureStorageConnectionString?: string;
  azureStoragePublicAccess?: boolean;
  azureContainerName?: string;
  // S3 storage (if applicable)
  s3AccessKeyId?: string;
  s3SecretAccessKey?: string;
  s3BucketName?: string;
  s3Region?: string;
}

interface FileStorageEditorProps {
  value: FileStorageConfig | null;
  onChange: (value: FileStorageConfig) => void;
  "data-testid"?: string;
}

export function FileStorageEditor({ value, onChange, "data-testid": testId }: FileStorageEditorProps) {
  const [config, setConfig] = useState<FileStorageConfig>({
    strategy: "",
    fileUploadPath: "/uploads",
    azureStoragePublicAccess: false,
    ...value
  });

  useEffect(() => {
    onChange(config);
  }, [config, onChange]);

  const updateConfig = (updates: Partial<FileStorageConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleStrategyChange = (strategy: FileStorageConfig["strategy"]) => {
    updateConfig({ strategy });
  };

  const strategyOptions = [
    { value: "", label: "Select Storage Strategy", disabled: true },
    { value: "local", label: "Local File Storage", icon: HardDrive },
    { value: "firebase", label: "Firebase Storage", icon: Database },
    { value: "azure_blob", label: "Azure Blob Storage", icon: Cloud },
    { value: "s3", label: "Amazon S3", icon: Cloud },
  ];

  const getStrategyInfo = (strategy: string) => {
    switch (strategy) {
      case "local":
        return {
          title: "Local File Storage",
          description: "Store files directly on your server's file system",
          icon: <HardDrive className="h-4 w-4" />,
          color: "border-l-green-500",
        };
      case "firebase":
        return {
          title: "Firebase Storage", 
          description: "Google Firebase Cloud Storage integration",
          icon: <Database className="h-4 w-4" />,
          color: "border-l-orange-500",
        };
      case "azure_blob":
        return {
          title: "Azure Blob Storage",
          description: "Microsoft Azure Blob Storage service",
          icon: <Cloud className="h-4 w-4" />,
          color: "border-l-blue-500",
        };
      case "s3":
        return {
          title: "Amazon S3",
          description: "Amazon Simple Storage Service",
          icon: <Cloud className="h-4 w-4" />,
          color: "border-l-yellow-500",
        };
      default:
        return null;
    }
  };

  const renderStrategyConfig = () => {
    const strategyInfo = getStrategyInfo(config.strategy);
    if (!strategyInfo) return null;

    return (
      <Card className={`border-l-4 ${strategyInfo.color}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            {strategyInfo.icon}
            {strategyInfo.title}
            <Badge variant="secondary">Active</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{strategyInfo.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {config.strategy === "local" && (
            <div>
              <Label htmlFor="file-upload-path">File Upload Path *</Label>
              <Input
                id="file-upload-path"
                value={config.fileUploadPath || ""}
                onChange={(e) => updateConfig({ fileUploadPath: e.target.value })}
                placeholder="/uploads"
                data-testid="input-file-upload-path"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Local directory path where uploaded files will be stored
              </p>
            </div>
          )}

          {config.strategy === "firebase" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="firebase-api-key">API Key *</Label>
                <Input
                  id="firebase-api-key"
                  type="password"
                  value={config.firebaseApiKey || ""}
                  onChange={(e) => updateConfig({ firebaseApiKey: e.target.value })}
                  placeholder="Enter Firebase API Key"
                  className="font-mono"
                  data-testid="input-firebase-api-key"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firebase-auth-domain">Auth Domain *</Label>
                  <Input
                    id="firebase-auth-domain"
                    value={config.firebaseAuthDomain || ""}
                    onChange={(e) => updateConfig({ firebaseAuthDomain: e.target.value })}
                    placeholder="your-project.firebaseapp.com"
                    data-testid="input-firebase-auth-domain"
                  />
                </div>
                <div>
                  <Label htmlFor="firebase-project-id">Project ID *</Label>
                  <Input
                    id="firebase-project-id"
                    value={config.firebaseProjectId || ""}
                    onChange={(e) => updateConfig({ firebaseProjectId: e.target.value })}
                    placeholder="your-project-id"
                    data-testid="input-firebase-project-id"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="firebase-storage-bucket">Storage Bucket *</Label>
                <Input
                  id="firebase-storage-bucket"
                  value={config.firebaseStorageBucket || ""}
                  onChange={(e) => updateConfig({ firebaseStorageBucket: e.target.value })}
                  placeholder="your-project.appspot.com"
                  data-testid="input-firebase-storage-bucket"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firebase-messaging-sender-id">Messaging Sender ID</Label>
                  <Input
                    id="firebase-messaging-sender-id"
                    value={config.firebaseMessagingSenderId || ""}
                    onChange={(e) => updateConfig({ firebaseMessagingSenderId: e.target.value })}
                    placeholder="123456789012"
                    data-testid="input-firebase-messaging-sender-id"
                  />
                </div>
                <div>
                  <Label htmlFor="firebase-app-id">App ID</Label>
                  <Input
                    id="firebase-app-id"
                    value={config.firebaseAppId || ""}
                    onChange={(e) => updateConfig({ firebaseAppId: e.target.value })}
                    placeholder="1:123:web:abc123def456"
                    data-testid="input-firebase-app-id"
                  />
                </div>
              </div>
            </div>
          )}

          {config.strategy === "azure_blob" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="azure-storage-connection-string">Connection String *</Label>
                <Input
                  id="azure-storage-connection-string"
                  type="password"
                  value={config.azureStorageConnectionString || ""}
                  onChange={(e) => updateConfig({ azureStorageConnectionString: e.target.value })}
                  placeholder="DefaultEndpointsProtocol=https;AccountName=..."
                  className="font-mono"
                  data-testid="input-azure-storage-connection-string"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="azure-container-name">Container Name *</Label>
                  <Input
                    id="azure-container-name"
                    value={config.azureContainerName || ""}
                    onChange={(e) => updateConfig({ azureContainerName: e.target.value })}
                    placeholder="uploads"
                    data-testid="input-azure-container-name"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="azure-storage-public-access"
                    checked={config.azureStoragePublicAccess || false}
                    onCheckedChange={(checked) => updateConfig({ azureStoragePublicAccess: checked })}
                    data-testid="toggle-azure-storage-public-access"
                  />
                  <Label htmlFor="azure-storage-public-access">Public Access</Label>
                </div>
              </div>
            </div>
          )}

          {config.strategy === "s3" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="s3-access-key-id">Access Key ID *</Label>
                  <Input
                    id="s3-access-key-id"
                    type="password"
                    value={config.s3AccessKeyId || ""}
                    onChange={(e) => updateConfig({ s3AccessKeyId: e.target.value })}
                    placeholder="AKIA..."
                    className="font-mono"
                    data-testid="input-s3-access-key-id"
                  />
                </div>
                <div>
                  <Label htmlFor="s3-secret-access-key">Secret Access Key *</Label>
                  <Input
                    id="s3-secret-access-key"
                    type="password"
                    value={config.s3SecretAccessKey || ""}
                    onChange={(e) => updateConfig({ s3SecretAccessKey: e.target.value })}
                    placeholder="Enter S3 Secret Key"
                    className="font-mono"
                    data-testid="input-s3-secret-access-key"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="s3-bucket-name">Bucket Name *</Label>
                  <Input
                    id="s3-bucket-name"
                    value={config.s3BucketName || ""}
                    onChange={(e) => updateConfig({ s3BucketName: e.target.value })}
                    placeholder="my-uploads-bucket"
                    data-testid="input-s3-bucket-name"
                  />
                </div>
                <div>
                  <Label htmlFor="s3-region">Region *</Label>
                  <Input
                    id="s3-region"
                    value={config.s3Region || ""}
                    onChange={(e) => updateConfig({ s3Region: e.target.value })}
                    placeholder="us-east-1"
                    data-testid="input-s3-region"
                  />
                </div>
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
        <FileText className="h-4 w-4" />
        <span className="text-sm font-medium">File Storage Configuration</span>
        {config.strategy && <Badge variant="secondary">{getStrategyInfo(config.strategy)?.title}</Badge>}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="storage-strategy">Storage Strategy *</Label>
          <Select value={config.strategy} onValueChange={handleStrategyChange} data-testid="select-storage-strategy">
            <SelectTrigger>
              <SelectValue placeholder="Select file storage backend" />
            </SelectTrigger>
            <SelectContent>
              {strategyOptions.map((option) => (
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
            Choose where LibreChat will store uploaded files
          </p>
        </div>

        {config.strategy ? (
          renderStrategyConfig()
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Settings2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Select a storage strategy to configure</p>
                <p className="text-xs text-muted-foreground">Different storage backends require different settings</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}