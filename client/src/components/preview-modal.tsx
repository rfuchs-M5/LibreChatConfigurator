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
    return `version: 1.2.8
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
        - "gpt-4o"
        - "gpt-4o-mini"
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
  agents: true
  temporaryChatRetention: ${configuration.temporaryChatsRetentionHours}

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
  fileUploads:
    ipMax: ${configuration.rateLimitsPerIP}
    ipWindowInMinutes: 60
    userMax: ${configuration.rateLimitsUploads}
    userWindowInMinutes: 60
  conversationsImport:
    ipMax: ${configuration.rateLimitsPerIP}
    ipWindowInMinutes: 60
    userMax: ${configuration.rateLimitsImports}
    userWindowInMinutes: 60
  stt:
    ipMax: ${configuration.rateLimitsPerIP}
    ipWindowInMinutes: 1
    userMax: ${configuration.rateLimitsSTT}
    userWindowInMinutes: 1
  tts:
    ipMax: ${configuration.rateLimitsPerIP}
    ipWindowInMinutes: 1
    userMax: ${configuration.rateLimitsTTS}
    userWindowInMinutes: 1

# Memory Configuration
${configuration.memoryEnabled ? `memory:
  disabled: false
  validKeys:
    - "user_preferences"
    - "conversation_context"
    - "learned_facts"
    - "personal_information"
  tokenLimit: ${configuration.memoryMaxTokens}
  personalize: ${configuration.memoryPersonalization}
  messageWindowSize: ${configuration.memoryWindowSize}
  agent:
    provider: "${configuration.memoryAgent}"
    model: "gpt-4"
    instructions: |
      Store memory using only the specified validKeys.
      For user_preferences: save explicitly stated preferences.
      For conversation_context: save important facts or ongoing projects.
      For learned_facts: save objective information about the user.
      For personal_information: save only what the user explicitly shares.
    model_parameters:
      temperature: 0.2
      max_tokens: 2000` : '# Memory system is disabled'}

# Search Configuration
search:
  provider: "${configuration.searchProvider}"
  scraper: "${configuration.searchScraper}"
  reranker: "${configuration.searchReranker}"
  safeSearch: ${configuration.searchSafeSearch}
  timeout: ${configuration.searchTimeout}

# OCR Configuration
${configuration.ocrProvider ? `ocr:
  strategy: "${configuration.ocrProvider === 'mistral' ? 'mistral_ocr' : configuration.ocrProvider === 'custom' ? 'custom_ocr' : 'mistral_ocr'}"${configuration.ocrProvider === 'mistral' ? `
  mistralModel: "${configuration.ocrModel}"` : ''}
  ${configuration.ocrApiBase ? `baseURL: "${configuration.ocrApiBase}"` : ''}
  ${configuration.ocrApiKey ? `apiKey: "${configuration.ocrApiKey}"` : ''}` : '# OCR is not configured'}

# Actions Configuration
${configuration.actionsAllowedDomains.length > 0 ? `actions:
  allowedDomains:
${configuration.actionsAllowedDomains.map((domain: string) => `    - "${domain}"`).join('\n')}` : '# Actions are not configured'}`;
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
