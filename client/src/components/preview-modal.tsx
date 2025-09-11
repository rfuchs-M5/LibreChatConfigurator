import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Configuration } from "@shared/schema";
import { Download, X } from "lucide-react";

interface PreviewModalProps {
  configuration: Configuration;
  onClose: () => void;
  onGenerate: () => void;
}

export function PreviewModal({ configuration, onClose, onGenerate }: PreviewModalProps) {
  const generateEnvPreview = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    return `# LibreChat Environment Configuration
# Generated on ${currentDate}

# Security
JWT_SECRET=${configuration.jwtSecret}
JWT_REFRESH_SECRET=${configuration.jwtRefreshSecret}
CREDS_KEY=${configuration.credsKey}
CREDS_IV=${configuration.credsIV}

# Application
HOST=${configuration.host}
PORT=${configuration.port}
ALLOW_REGISTRATION=${configuration.enableRegistration}
SESSION_EXPIRY=${configuration.sessionExpiry}
REFRESH_TOKEN_EXPIRY=${configuration.refreshTokenExpiry}

# API Keys
${configuration.openaiApiKey ? `OPENAI_API_KEY=${configuration.openaiApiKey}` : '# OPENAI_API_KEY=your_openai_api_key_here'}`;
  };

  const generateYamlPreview = () => {
    return `version: ${configuration.configVer}
cache: ${configuration.cache}

# MCP Servers Configuration
mcpServers:${configuration.mcpServers && configuration.mcpServers.length > 0 
  ? configuration.mcpServers.map((server: any) => `
  ${server.name}:
    type: ${server.type}${server.url ? `
    url: "${server.url}"` : ''}
    timeout: ${server.timeout}${Object.keys(server.headers || {}).length > 0 ? `
    headers:${Object.entries(server.headers || {}).map(([k, v]) => `
      ${k}: "${v}"`).join('')}` : ''}${server.instructions ? `
    serverInstructions: |
      ${server.instructions.split('\n').join('\n      ')}` : ''}`).join('')
  : '\n  # No MCP servers configured'}

# Endpoints Configuration
endpoints:
  agents:
    disableBuilder: false
    recursionLimit: 50
    maxRecursionLimit: 100
    capabilities:
      - execute_code
      - file_search
      - actions
      - tools
      - artifacts
      - web_search
    maxCitations: 30
    maxCitationsPerFile: 7
    minRelevanceScore: 0.45
  openAI:
    title: "OpenAI"
    apiKey: "\${OPENAI_API_KEY}"
    models:
      default: 
        - "${configuration.defaultModel}"
        - "gpt-4o"
        - "gpt-4o-mini"
        - "o3"
        - "gpt-4-turbo"
        - "gpt-3.5-turbo"
      fetch: true
    dropParams:
      - "frequency_penalty"
      - "presence_penalty"
      - "stop"
      - "user"
    titleConvo: ${configuration.endpointDefaults.titling}
    titleModel: "${configuration.endpointDefaults.titleModel}"

# Interface Configuration
interface:
  agents: true${configuration.customWelcome ? `
  customWelcome: "${configuration.customWelcome}"` : ''}

# File Configuration
fileConfig:
  endpoints:
    openAI:
      disabled: false
      fileLimit: ${configuration.filesMaxFilesPerRequest}
      fileSizeLimit: ${configuration.filesMaxSizeMB}
      totalSizeLimit: ${configuration.filesMaxSizeMB * configuration.filesMaxFilesPerRequest}
      supportedMimeTypes:${configuration.filesAllowedMimeTypes.map((type: string) => `
        - "${type}"`).join('')}



# Rate Limits
rateLimits:
  perUser: ${configuration.rateLimitsPerUser}
  perIP: ${configuration.rateLimitsPerIP}
  uploads: ${configuration.rateLimitsUploads}
  imports: ${configuration.rateLimitsImports}
  tts: ${configuration.rateLimitsTTS}
  stt: ${configuration.rateLimitsSTT}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] w-full">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Configuration Preview</DialogTitle>
              <DialogDescription>
                Review your settings before generating package
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-preview">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <Tabs defaultValue="env" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="env">.env Configuration</TabsTrigger>
            <TabsTrigger value="yaml">librechat-config.yaml Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="env" className="mt-4">
            <ScrollArea className="h-96 w-full rounded-md border">
              <pre className="p-4 text-sm bg-slate-900 text-green-400 font-mono whitespace-pre-wrap break-all word-break-break-all overflow-wrap-anywhere">
                {generateEnvPreview()}
              </pre>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="yaml" className="mt-4">
            <ScrollArea className="h-96 w-full rounded-md border">
              <pre className="p-4 text-sm bg-slate-900 text-blue-400 font-mono whitespace-pre-wrap break-all word-break-break-all overflow-wrap-anywhere">
                {generateYamlPreview()}
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} data-testid="button-close">
            Close Preview
          </Button>
          <Button onClick={onGenerate} data-testid="button-generate-package">
            <Download className="h-4 w-4 mr-2" />
            Generate Package
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
