/**
 * Security utilities for redacting sensitive data in logs and exports
 */

// List of sensitive keys that should be redacted
const SENSITIVE_KEYS = [
  'authorization',
  'token', 
  'apikey',
  'api_key',
  'secret',
  'password',
  'jwt',
  'credskey',
  'credsiv',
  'openaiApiKey',
  'serperApiKey',
  'searxngApiKey',
  'firecrawlApiKey',
  'jinaApiKey',
  'cohereApiKey',
  'ocrApiKey',
  'jwtSecret',
  'jwtRefreshSecret'
];

/**
 * Deep redaction of sensitive data in objects
 */
export function deepRedact(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepRedact(item));
  }
  
  if (typeof obj === 'object') {
    const redacted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const keyLower = key.toLowerCase();
      
      if (SENSITIVE_KEYS.some(sensitiveKey => keyLower.includes(sensitiveKey))) {
        redacted[key] = '[REDACTED]';
      } else if (key === 'headers' && typeof value === 'object' && value !== null) {
        // Special handling for headers object
        redacted[key] = Object.fromEntries(
          Object.entries(value).map(([headerKey, headerValue]) => [
            headerKey,
            SENSITIVE_KEYS.some(sensitiveKey => 
              headerKey.toLowerCase().includes(sensitiveKey)
            ) ? '[REDACTED]' : headerValue
          ])
        );
      } else {
        redacted[key] = deepRedact(value);
      }
    }
    return redacted;
  }
  
  return obj;
}

/**
 * Sanitize configuration for export (replace secrets with placeholders)
 */
export function sanitizeConfigurationForExport(config: any): any {
  if (!config) return config;
  
  const sanitized = { ...config };
  
  // Replace API keys with placeholders
  if (sanitized.openaiApiKey) sanitized.openaiApiKey = '{{OPENAI_API_KEY}}';
  if (sanitized.serperApiKey) sanitized.serperApiKey = '{{SERPER_API_KEY}}';
  if (sanitized.searxngApiKey) sanitized.searxngApiKey = '{{SEARXNG_API_KEY}}';
  if (sanitized.firecrawlApiKey) sanitized.firecrawlApiKey = '{{FIRECRAWL_API_KEY}}';
  if (sanitized.jinaApiKey) sanitized.jinaApiKey = '{{JINA_API_KEY}}';
  if (sanitized.cohereApiKey) sanitized.cohereApiKey = '{{COHERE_API_KEY}}';
  if (sanitized.ocrApiKey) sanitized.ocrApiKey = '{{OCR_API_KEY}}';
  
  // Replace security credentials with placeholders
  if (sanitized.jwtSecret) sanitized.jwtSecret = '{{JWT_SECRET}}';
  if (sanitized.jwtRefreshSecret) sanitized.jwtRefreshSecret = '{{JWT_REFRESH_SECRET}}';
  if (sanitized.credsKey) sanitized.credsKey = '{{CREDS_KEY}}';
  if (sanitized.credsIV) sanitized.credsIV = '{{CREDS_IV}}';
  
  // Sanitize MCP servers
  if (sanitized.mcpServers && Array.isArray(sanitized.mcpServers)) {
    sanitized.mcpServers = sanitized.mcpServers.map((server: any) => ({
      ...server,
      url: server.url?.includes('replit.dev') ? '{{MCP_SERVER_URL}}' : server.url,
      headers: server.headers ? Object.fromEntries(
        Object.entries(server.headers).map(([key, value]) => [
          key,
          key.toLowerCase().includes('authorization') ? '{{MCP_API_TOKEN}}' : value
        ])
      ) : {}
    }));
  }
  
  return sanitized;
}

/**
 * Safe logging that automatically redacts sensitive data
 */
export function safeLog(message: string, data?: any) {
  if (process.env.NODE_ENV === 'development') {
    if (data) {
      console.log(message, deepRedact(data));
    } else {
      console.log(message);
    }
  }
}