import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { parseEnvFile, parseYamlFile } from "@/lib/file-parsers";
import { configurationSchema } from "@shared/schema";
import { CheckCircle2, XCircle, AlertTriangle, Upload, FileText } from "lucide-react";

interface ValidationResult {
  field: string;
  status: "valid" | "invalid" | "warning";
  message: string;
}

interface FileValidatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FileValidator({ open, onOpenChange }: FileValidatorProps) {
  const [envFile, setEnvFile] = useState<File | null>(null);
  const [yamlFile, setYamlFile] = useState<File | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const handleFileSelect = (type: 'env' | 'yaml', file: File | null) => {
    if (type === 'env') {
      setEnvFile(file);
    } else {
      setYamlFile(file);
    }
    setValidationResults([]);
  };

  const validateFiles = async () => {
    setIsValidating(true);
    const results: ValidationResult[] = [];

    try {
      let config: any = {};

      // Parse .env file
      if (envFile) {
        const envContent = await envFile.text();
        try {
          const envVars = parseEnvFile(envContent);
          results.push({
            field: ".env file",
            status: "valid",
            message: `Successfully parsed ${Object.keys(envVars).length} environment variables`
          });
          
          // Basic env validation
          if (envVars.MONGO_URI || envVars.MONGO_ROOT_USERNAME) {
            config.mongoUri = envVars.MONGO_URI || '';
          }
          if (envVars.OPENAI_API_KEY) config.openaiApiKey = envVars.OPENAI_API_KEY;
          if (envVars.ANTHROPIC_API_KEY) config.anthropicApiKey = envVars.ANTHROPIC_API_KEY;
          
        } catch (error) {
          results.push({
            field: ".env file",
            status: "invalid",
            message: error instanceof Error ? error.message : "Failed to parse .env file"
          });
        }
      }

      // Parse YAML file
      if (yamlFile) {
        const yamlContent = await yamlFile.text();
        try {
          const yamlData = parseYamlFile(yamlContent);
          results.push({
            field: "librechat.yaml file",
            status: "valid",
            message: "Successfully parsed YAML structure"
          });

          // Validate YAML structure
          if (yamlData.version) {
            config.version = yamlData.version;
            results.push({
              field: "version",
              status: "valid",
              message: `Version: ${yamlData.version}`
            });
          } else {
            results.push({
              field: "version",
              status: "warning",
              message: "No version specified in YAML"
            });
          }

          if (yamlData.cache !== undefined) {
            config.cache = yamlData.cache;
          }

          // Check for common configuration sections
          if (yamlData.endpoints) {
            results.push({
              field: "endpoints",
              status: "valid",
              message: `Found ${Object.keys(yamlData.endpoints).length} endpoint configuration(s)`
            });
          }

          if (yamlData.mcpServers) {
            const serverCount = Array.isArray(yamlData.mcpServers) 
              ? yamlData.mcpServers.length 
              : Object.keys(yamlData.mcpServers).length;
            results.push({
              field: "mcpServers",
              status: "valid",
              message: `Configured ${serverCount} MCP server(s)`
            });
          }

          if (yamlData.rateLimits) {
            results.push({
              field: "rateLimits",
              status: "valid",
              message: "Rate limiting configuration found"
            });
          }

        } catch (error) {
          results.push({
            field: "librechat.yaml file",
            status: "invalid",
            message: error instanceof Error ? error.message : "Failed to parse YAML file"
          });
        }
      }

      // Validate against schema if we have config data
      if (Object.keys(config).length > 0) {
        try {
          const result = configurationSchema.safeParse(config);
          if (result.success) {
            results.push({
              field: "Schema Validation",
              status: "valid",
              message: "Configuration matches LibreChat schema"
            });
          } else {
            // Add specific validation errors
            result.error.issues.forEach((issue: { path: (string | number)[]; message: string }) => {
              results.push({
                field: issue.path.join('.') || "configuration",
                status: "invalid",
                message: issue.message
              });
            });
          }
        } catch (error) {
          results.push({
            field: "Schema Validation",
            status: "warning",
            message: "Unable to fully validate configuration schema"
          });
        }
      }

      // If no files provided
      if (!envFile && !yamlFile) {
        results.push({
          field: "No files",
          status: "warning",
          message: "Please select at least one file to validate"
        });
      }

    } catch (error) {
      results.push({
        field: "Validation",
        status: "invalid",
        message: error instanceof Error ? error.message : "Validation failed"
      });
    }

    setValidationResults(results);
    setIsValidating(false);
  };

  const getIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "invalid":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getAlertVariant = (status: string): "default" | "destructive" => {
    return status === "invalid" ? "destructive" : "default";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Validate Configuration Files</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload your .env and/or librechat.yaml files to check for errors and validate against the LibreChat schema.
          </p>

          {/* File Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* .env file */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                .env file (optional)
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.env';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      handleFileSelect('env', file || null);
                    };
                    input.click();
                  }}
                  data-testid="button-upload-env"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {envFile ? envFile.name : 'Select .env file'}
                </Button>
                {envFile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFileSelect('env', null)}
                    data-testid="button-clear-env"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* YAML file */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                librechat.yaml file (optional)
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.yaml,.yml';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      handleFileSelect('yaml', file || null);
                    };
                    input.click();
                  }}
                  data-testid="button-upload-yaml"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {yamlFile ? yamlFile.name : 'Select YAML file'}
                </Button>
                {yamlFile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFileSelect('yaml', null)}
                    data-testid="button-clear-yaml"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Validate Button */}
          <Button
            onClick={validateFiles}
            disabled={(!envFile && !yamlFile) || isValidating}
            className="w-full"
            data-testid="button-validate"
          >
            {isValidating ? "Validating..." : "Validate Files"}
          </Button>

          {/* Results Section */}
          {validationResults.length > 0 && (
            <div className="space-y-2" data-testid="validation-results">
              <h3 className="text-sm font-semibold">Validation Results:</h3>
              {validationResults.map((result, index) => (
                <Alert
                  key={index}
                  variant={getAlertVariant(result.status)}
                  className="flex items-start gap-2"
                  data-testid={`result-${result.status}-${index}`}
                >
                  {getIcon(result.status)}
                  <div className="flex-1">
                    <AlertDescription>
                      <span className="font-medium">{result.field}:</span> {result.message}
                    </AlertDescription>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
