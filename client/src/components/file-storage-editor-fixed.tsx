import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HardDrive, Cloud, Database, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { SettingInput } from "@/components/setting-input";

interface FileStorageEditorProps {
  configuration: Record<string, any>;
  onConfigChange: (key: string, value: any) => void;
  "data-testid"?: string;
}

export function FileStorageEditor({ configuration, onConfigChange, "data-testid": testId }: FileStorageEditorProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<string>(() => {
    // Determine current strategy from fileStrategy field or infer from existing values
    const fileStrategy = configuration.fileStrategy;
    if (typeof fileStrategy === "string") {
      return fileStrategy;
    }
    
    // Infer strategy from existing field values
    if (configuration.fileUploadPath) return "local";
    if (configuration.firebaseApiKey) return "firebase"; 
    if (configuration.azureStorageConnectionString) return "azure_blob";
    
    return "";
  });

  // Sync internal state with incoming configuration changes
  useEffect(() => {
    const fileStrategy = configuration.fileStrategy;
    if (typeof fileStrategy === "string") {
      setSelectedStrategy(fileStrategy);
      return;
    }
    
    // Infer strategy from existing field values
    if (configuration.fileUploadPath) {
      setSelectedStrategy("local");
    } else if (configuration.firebaseApiKey) {
      setSelectedStrategy("firebase");
    } else if (configuration.azureStorageConnectionString) {
      setSelectedStrategy("azure_blob");
    } else {
      setSelectedStrategy("placeholder");
    }
  }, [configuration.fileStrategy, configuration.fileUploadPath, configuration.firebaseApiKey, configuration.azureStorageConnectionString]);

  const handleStrategyChange = (strategy: string) => {
    if (strategy === "placeholder") return; // Don't allow selecting placeholder
    setSelectedStrategy(strategy);
    onConfigChange("fileStrategy", strategy);
  };

  const strategyOptions = [
    { value: "placeholder", label: "Select Storage Strategy", disabled: true },
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
          fields: ["fileUploadPath"]
        };
      case "firebase":
        return {
          title: "Firebase Storage", 
          description: "Google Firebase Cloud Storage integration",
          icon: <Database className="h-4 w-4" />,
          color: "border-l-orange-500",
          fields: ["firebaseApiKey", "firebaseAuthDomain", "firebaseProjectId", "firebaseStorageBucket", "firebaseMessagingSenderId", "firebaseAppId"]
        };
      case "azure_blob":
        return {
          title: "Azure Blob Storage",
          description: "Microsoft Azure Blob Storage service",
          icon: <Cloud className="h-4 w-4" />,
          color: "border-l-blue-500",
          fields: ["azureStorageConnectionString", "azureStoragePublicAccess", "azureContainerName"]
        };
      case "s3":
        return {
          title: "Amazon S3",
          description: "Amazon Simple Storage Service",
          icon: <Cloud className="h-4 w-4" />,
          color: "border-l-yellow-500",
          fields: [] // S3 fields would be in AWS tab
        };
      default:
        return null;
    }
  };

  const fieldDefinitions: Record<string, any> = {
    fileUploadPath: { type: "text", description: "Local directory path where uploaded files will be stored", label: "File Upload Path", placeholder: "/uploads" },
    firebaseApiKey: { type: "password", description: "Firebase API key", label: "Firebase API Key", placeholder: "Enter Firebase API Key" },
    firebaseAuthDomain: { type: "text", description: "Firebase auth domain", label: "Firebase Auth Domain", placeholder: "your-project.firebaseapp.com" },
    firebaseProjectId: { type: "text", description: "Firebase project ID", label: "Firebase Project ID", placeholder: "your-project-id" },
    firebaseStorageBucket: { type: "text", description: "Firebase storage bucket", label: "Firebase Storage Bucket", placeholder: "your-project.appspot.com" },
    firebaseMessagingSenderId: { type: "text", description: "Firebase messaging sender ID", label: "Firebase Messaging Sender ID", placeholder: "123456789012" },
    firebaseAppId: { type: "text", description: "Firebase app ID", label: "Firebase App ID", placeholder: "1:123:web:abc123def456" },
    azureStorageConnectionString: { type: "password", description: "Azure storage connection string", label: "Azure Storage Connection String", placeholder: "DefaultEndpointsProtocol=https;AccountName=..." },
    azureStoragePublicAccess: { type: "boolean", description: "Azure storage public access", label: "Azure Storage Public Access" },
    azureContainerName: { type: "text", description: "Azure container name", label: "Azure Container Name", placeholder: "uploads" },
  };

  const renderStrategyConfig = () => {
    const strategyInfo = getStrategyInfo(selectedStrategy);
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
          {strategyInfo.fields.map((fieldKey) => {
            const fieldDef = fieldDefinitions[fieldKey];
            if (!fieldDef) return null;
            
            return (
              <SettingInput
                key={fieldKey}
                label={fieldDef.label}
                description={fieldDef.description}
                type={fieldDef.type}
                value={configuration[fieldKey]}
                onChange={(value) => onConfigChange(fieldKey, value)}
                placeholder={fieldDef.placeholder}
                data-testid={`input-${fieldKey}`}
              />
            );
          })}
          
          {selectedStrategy === "s3" && (
            <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
              <p>S3 credentials are configured in the <strong>AWS Bedrock</strong> tab.</p>
              <p>The File Storage strategy will use the AWS credentials from that tab.</p>
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
        {selectedStrategy && <Badge variant="secondary">{getStrategyInfo(selectedStrategy)?.title}</Badge>}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="storage-strategy">Storage Strategy *</Label>
          <Select value={selectedStrategy} onValueChange={handleStrategyChange} data-testid="select-storage-strategy">
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

        {selectedStrategy && selectedStrategy !== "placeholder" ? (
          renderStrategyConfig()
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
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