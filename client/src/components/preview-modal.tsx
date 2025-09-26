import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Configuration, CONFIG_VERSION } from "@shared/schema";
import { createVersionedConfiguration } from "@shared/version-utils";
import { Download, X, Copy, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PreviewModalProps {
  configuration: Configuration;
  onClose: () => void;
  onGenerate: () => void;
}

export function PreviewModal({ configuration, onClose, onGenerate }: PreviewModalProps) {
  const { toast } = useToast();

  const copyToClipboard = async (content: string, filename: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to Clipboard",
        description: `${filename} has been copied to your clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed", 
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Downloaded",
      description: `${filename} has been downloaded`,
    });
  };
  const generateEnvPreview = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    return `# =============================================================================
# LibreChat Environment Configuration (RC4)
# Generated on ${currentDate}
# =============================================================================

# =============================================================================
# App Configuration
# =============================================================================
${configuration.appTitle ? `APP_TITLE=${configuration.appTitle}` : '# APP_TITLE=LibreChat'}
${configuration.customWelcome ? `CUSTOM_WELCOME=${configuration.customWelcome}` : '# CUSTOM_WELCOME='}
${configuration.customFooter ? `CUSTOM_FOOTER=${configuration.customFooter}` : '# CUSTOM_FOOTER='}
${configuration.helpAndFAQURL ? `HELP_AND_FAQ_URL=${configuration.helpAndFAQURL}` : '# HELP_AND_FAQ_URL='}

# =============================================================================
# Server Configuration
# =============================================================================
${configuration.host ? `HOST=${configuration.host}` : '# HOST=0.0.0.0'}
${configuration.port ? `PORT=${configuration.port}` : '# PORT=3080'}
${configuration.nodeEnv ? `NODE_ENV=${configuration.nodeEnv}` : '# NODE_ENV=production'}
${configuration.domainClient ? `DOMAIN_CLIENT=${configuration.domainClient}` : '# DOMAIN_CLIENT='}
${configuration.domainServer ? `DOMAIN_SERVER=${configuration.domainServer}` : '# DOMAIN_SERVER='}
${configuration.noIndex !== undefined ? `NO_INDEX=${configuration.noIndex}` : '# NO_INDEX=true'}

# =============================================================================
# Security Configuration
# =============================================================================
${configuration.jwtSecret ? `JWT_SECRET=${configuration.jwtSecret}` : '# JWT_SECRET=your_jwt_secret_here'}
${configuration.jwtRefreshSecret ? `JWT_REFRESH_SECRET=${configuration.jwtRefreshSecret}` : '# JWT_REFRESH_SECRET=your_jwt_refresh_secret_here'}
${configuration.credsKey ? `CREDS_KEY=${configuration.credsKey}` : '# CREDS_KEY=your_32_character_key_here'}
${configuration.credsIV ? `CREDS_IV=${configuration.credsIV}` : '# CREDS_IV=your_16_character_iv_here'}
${configuration.minPasswordLength ? `MIN_PASSWORD_LENGTH=${configuration.minPasswordLength}` : '# MIN_PASSWORD_LENGTH=8'}
${configuration.sessionExpiry ? `SESSION_EXPIRY=${configuration.sessionExpiry}` : '# SESSION_EXPIRY=15_minutes'}
${configuration.refreshTokenExpiry ? `REFRESH_TOKEN_EXPIRY=${configuration.refreshTokenExpiry}` : '# REFRESH_TOKEN_EXPIRY=7_days'}

# =============================================================================
# Database Configuration
# =============================================================================
${configuration.mongoUri ? `MONGO_URI=${configuration.mongoUri}` : '# MONGO_URI=mongodb://127.0.0.1:27017/LibreChat'}
${configuration.mongoRootUsername ? `MONGO_ROOT_USERNAME=${configuration.mongoRootUsername}` : '# MONGO_ROOT_USERNAME='}
${configuration.mongoRootPassword ? `MONGO_ROOT_PASSWORD=${configuration.mongoRootPassword}` : '# MONGO_ROOT_PASSWORD='}
${configuration.mongoDbName ? `MONGO_DB_NAME=${configuration.mongoDbName}` : '# MONGO_DB_NAME=LibreChat'}
${configuration.redisUri ? `REDIS_URI=${configuration.redisUri}` : '# REDIS_URI=redis://localhost:6379'}
${configuration.redisUsername ? `REDIS_USERNAME=${configuration.redisUsername}` : '# REDIS_USERNAME='}
${configuration.redisPassword ? `REDIS_PASSWORD=${configuration.redisPassword}` : '# REDIS_PASSWORD='}
${configuration.redisKeyPrefix ? `REDIS_KEY_PREFIX=${configuration.redisKeyPrefix}` : '# REDIS_KEY_PREFIX='}
${configuration.redisKeyPrefixVar ? `REDIS_KEY_PREFIX_VAR=${configuration.redisKeyPrefixVar}` : '# REDIS_KEY_PREFIX_VAR='}
${configuration.redisMaxListeners ? `REDIS_MAX_LISTENERS=${configuration.redisMaxListeners}` : '# REDIS_MAX_LISTENERS=10'}
${configuration.redisPingInterval ? `REDIS_PING_INTERVAL=${configuration.redisPingInterval}` : '# REDIS_PING_INTERVAL=30000'}
${configuration.redisUseAlternativeDNSLookup !== undefined ? `REDIS_USE_ALTERNATIVE_DNS_LOOKUP=${configuration.redisUseAlternativeDNSLookup}` : '# REDIS_USE_ALTERNATIVE_DNS_LOOKUP=false'}

# =============================================================================
# Authentication Configuration
# =============================================================================
${configuration.allowRegistration !== undefined ? `ALLOW_REGISTRATION=${configuration.allowRegistration}` : '# ALLOW_REGISTRATION=true'}
${configuration.allowEmailLogin !== undefined ? `ALLOW_EMAIL_LOGIN=${configuration.allowEmailLogin}` : '# ALLOW_EMAIL_LOGIN=true'}
${configuration.allowSocialLogin !== undefined ? `ALLOW_SOCIAL_LOGIN=${configuration.allowSocialLogin}` : '# ALLOW_SOCIAL_LOGIN=false'}
${configuration.allowSocialRegistration !== undefined ? `ALLOW_SOCIAL_REGISTRATION=${configuration.allowSocialRegistration}` : '# ALLOW_SOCIAL_REGISTRATION=false'}
${configuration.allowPasswordReset !== undefined ? `ALLOW_PASSWORD_RESET=${configuration.allowPasswordReset}` : '# ALLOW_PASSWORD_RESET=false'}

# =============================================================================
# Email Configuration
# =============================================================================
${configuration.emailService ? `EMAIL_SERVICE=${configuration.emailService}` : '# EMAIL_SERVICE='}
${configuration.emailUsername ? `EMAIL_USERNAME=${configuration.emailUsername}` : '# EMAIL_USERNAME='}
${configuration.emailPassword ? `EMAIL_PASSWORD=${configuration.emailPassword}` : '# EMAIL_PASSWORD='}
${configuration.emailFrom ? `EMAIL_FROM=${configuration.emailFrom}` : '# EMAIL_FROM='}
${configuration.emailFromName ? `EMAIL_FROM_NAME=${configuration.emailFromName}` : '# EMAIL_FROM_NAME='}
${configuration.mailgunApiKey ? `MAILGUN_API_KEY=${configuration.mailgunApiKey}` : '# MAILGUN_API_KEY='}
${configuration.mailgunDomain ? `MAILGUN_DOMAIN=${configuration.mailgunDomain}` : '# MAILGUN_DOMAIN='}
${configuration.mailgunHost ? `MAILGUN_HOST=${configuration.mailgunHost}` : '# MAILGUN_HOST='}

# =============================================================================
# OAuth Providers Configuration
# =============================================================================
${configuration.googleClientId ? `GOOGLE_CLIENT_ID=${configuration.googleClientId}` : '# GOOGLE_CLIENT_ID='}
${configuration.googleClientSecret ? `GOOGLE_CLIENT_SECRET=${configuration.googleClientSecret}` : '# GOOGLE_CLIENT_SECRET='}
${configuration.googleCallbackURL ? `GOOGLE_CALLBACK_URL=${configuration.googleCallbackURL}` : '# GOOGLE_CALLBACK_URL='}
${configuration.githubClientId ? `GITHUB_CLIENT_ID=${configuration.githubClientId}` : '# GITHUB_CLIENT_ID='}
${configuration.githubClientSecret ? `GITHUB_CLIENT_SECRET=${configuration.githubClientSecret}` : '# GITHUB_CLIENT_SECRET='}
${configuration.githubCallbackURL ? `GITHUB_CALLBACK_URL=${configuration.githubCallbackURL}` : '# GITHUB_CALLBACK_URL='}
${configuration.discordClientId ? `DISCORD_CLIENT_ID=${configuration.discordClientId}` : '# DISCORD_CLIENT_ID='}
${configuration.discordClientSecret ? `DISCORD_CLIENT_SECRET=${configuration.discordClientSecret}` : '# DISCORD_CLIENT_SECRET='}
${configuration.discordCallbackURL ? `DISCORD_CALLBACK_URL=${configuration.discordCallbackURL}` : '# DISCORD_CALLBACK_URL='}
${configuration.facebookClientId ? `FACEBOOK_CLIENT_ID=${configuration.facebookClientId}` : '# FACEBOOK_CLIENT_ID='}
${configuration.facebookClientSecret ? `FACEBOOK_CLIENT_SECRET=${configuration.facebookClientSecret}` : '# FACEBOOK_CLIENT_SECRET='}
${configuration.facebookCallbackURL ? `FACEBOOK_CALLBACK_URL=${configuration.facebookCallbackURL}` : '# FACEBOOK_CALLBACK_URL='}
${configuration.appleClientId ? `APPLE_CLIENT_ID=${configuration.appleClientId}` : '# APPLE_CLIENT_ID='}
${configuration.applePrivateKey ? `APPLE_PRIVATE_KEY=${configuration.applePrivateKey}` : '# APPLE_PRIVATE_KEY='}
${configuration.appleKeyId ? `APPLE_KEY_ID=${configuration.appleKeyId}` : '# APPLE_KEY_ID='}
${configuration.appleTeamId ? `APPLE_TEAM_ID=${configuration.appleTeamId}` : '# APPLE_TEAM_ID='}
${configuration.appleCallbackURL ? `APPLE_CALLBACK_URL=${configuration.appleCallbackURL}` : '# APPLE_CALLBACK_URL='}
${configuration.openidURL ? `OPENID_URL=${configuration.openidURL}` : '# OPENID_URL='}
${configuration.openidClientId ? `OPENID_CLIENT_ID=${configuration.openidClientId}` : '# OPENID_CLIENT_ID='}
${configuration.openidClientSecret ? `OPENID_CLIENT_SECRET=${configuration.openidClientSecret}` : '# OPENID_CLIENT_SECRET='}
${configuration.openidCallbackURL ? `OPENID_CALLBACK_URL=${configuration.openidCallbackURL}` : '# OPENID_CALLBACK_URL='}
${configuration.openidScope ? `OPENID_SCOPE=${configuration.openidScope}` : '# OPENID_SCOPE='}
${configuration.openidSessionSecret ? `OPENID_SESSION_SECRET=${configuration.openidSessionSecret}` : '# OPENID_SESSION_SECRET='}
${configuration.openidIssuer ? `OPENID_ISSUER=${configuration.openidIssuer}` : '# OPENID_ISSUER='}
${configuration.openidButtonLabel ? `OPENID_BUTTON_LABEL=${configuration.openidButtonLabel}` : '# OPENID_BUTTON_LABEL='}
${configuration.openidImageURL ? `OPENID_IMAGE_URL=${configuration.openidImageURL}` : '# OPENID_IMAGE_URL='}

# =============================================================================
# Core AI API Keys
# =============================================================================
${configuration.openaiApiKey ? `OPENAI_API_KEY=${configuration.openaiApiKey}` : '# OPENAI_API_KEY='}
${configuration.anthropicApiKey ? `ANTHROPIC_API_KEY=${configuration.anthropicApiKey}` : '# ANTHROPIC_API_KEY='}
${configuration.googleApiKey ? `GOOGLE_API_KEY=${configuration.googleApiKey}` : '# GOOGLE_API_KEY='}
${configuration.groqApiKey ? `GROQ_API_KEY=${configuration.groqApiKey}` : '# GROQ_API_KEY='}
${configuration.mistralApiKey ? `MISTRAL_API_KEY=${configuration.mistralApiKey}` : '# MISTRAL_API_KEY='}

# =============================================================================
# Extended AI API Keys
# =============================================================================
${configuration.deepseekApiKey ? `DEEPSEEK_API_KEY=${configuration.deepseekApiKey}` : '# DEEPSEEK_API_KEY='}
${configuration.perplexityApiKey ? `PERPLEXITY_API_KEY=${configuration.perplexityApiKey}` : '# PERPLEXITY_API_KEY='}
${configuration.fireworksApiKey ? `FIREWORKS_API_KEY=${configuration.fireworksApiKey}` : '# FIREWORKS_API_KEY='}
${configuration.togetheraiApiKey ? `TOGETHERAI_API_KEY=${configuration.togetheraiApiKey}` : '# TOGETHERAI_API_KEY='}
${configuration.huggingfaceToken ? `HUGGINGFACE_TOKEN=${configuration.huggingfaceToken}` : '# HUGGINGFACE_TOKEN='}
${configuration.xaiApiKey ? `XAI_API_KEY=${configuration.xaiApiKey}` : '# XAI_API_KEY='}
${configuration.nvidiaApiKey ? `NVIDIA_API_KEY=${configuration.nvidiaApiKey}` : '# NVIDIA_API_KEY='}
${configuration.sambaNovaApiKey ? `SAMBANOVA_API_KEY=${configuration.sambaNovaApiKey}` : '# SAMBANOVA_API_KEY='}
${configuration.hyperbolicApiKey ? `HYPERBOLIC_API_KEY=${configuration.hyperbolicApiKey}` : '# HYPERBOLIC_API_KEY='}
${configuration.klusterApiKey ? `KLUSTER_API_KEY=${configuration.klusterApiKey}` : '# KLUSTER_API_KEY='}
${configuration.nanogptApiKey ? `NANOGPT_API_KEY=${configuration.nanogptApiKey}` : '# NANOGPT_API_KEY='}
${configuration.glhfApiKey ? `GLHF_API_KEY=${configuration.glhfApiKey}` : '# GLHF_API_KEY='}
${configuration.apipieApiKey ? `APIPIE_API_KEY=${configuration.apipieApiKey}` : '# APIPIE_API_KEY='}
${configuration.unifyApiKey ? `UNIFY_API_KEY=${configuration.unifyApiKey}` : '# UNIFY_API_KEY='}
${configuration.openrouterKey ? `OPENROUTER_KEY=${configuration.openrouterKey}` : '# OPENROUTER_KEY='}

# =============================================================================
# Azure OpenAI Configuration
# =============================================================================
${configuration.azureApiKey ? `AZURE_API_KEY=${configuration.azureApiKey}` : '# AZURE_API_KEY='}
${configuration.azureOpenaiApiInstanceName ? `AZURE_OPENAI_API_INSTANCE_NAME=${configuration.azureOpenaiApiInstanceName}` : '# AZURE_OPENAI_API_INSTANCE_NAME='}
${configuration.azureOpenaiApiDeploymentName ? `AZURE_OPENAI_API_DEPLOYMENT_NAME=${configuration.azureOpenaiApiDeploymentName}` : '# AZURE_OPENAI_API_DEPLOYMENT_NAME='}
${configuration.azureOpenaiApiVersion ? `AZURE_OPENAI_API_VERSION=${configuration.azureOpenaiApiVersion}` : '# AZURE_OPENAI_API_VERSION='}
${configuration.azureOpenaiModels ? `AZURE_OPENAI_MODELS=${configuration.azureOpenaiModels}` : '# AZURE_OPENAI_MODELS='}

# =============================================================================
# AWS Bedrock Configuration
# =============================================================================
${configuration.awsAccessKeyId ? `AWS_ACCESS_KEY_ID=${configuration.awsAccessKeyId}` : '# AWS_ACCESS_KEY_ID='}
${configuration.awsSecretAccessKey ? `AWS_SECRET_ACCESS_KEY=${configuration.awsSecretAccessKey}` : '# AWS_SECRET_ACCESS_KEY='}
${configuration.awsRegion ? `AWS_REGION=${configuration.awsRegion}` : '# AWS_REGION='}
${configuration.awsBedrockRegion ? `AWS_BEDROCK_REGION=${configuration.awsBedrockRegion}` : '# AWS_BEDROCK_REGION='}
${configuration.awsEndpointURL ? `AWS_ENDPOINT_URL=${configuration.awsEndpointURL}` : '# AWS_ENDPOINT_URL='}
${configuration.awsBucketName ? `AWS_BUCKET_NAME=${configuration.awsBucketName}` : '# AWS_BUCKET_NAME='}

# =============================================================================
# File Storage Configuration
# =============================================================================
${configuration.fileUploadPath ? `FILE_UPLOAD_PATH=${configuration.fileUploadPath}` : '# FILE_UPLOAD_PATH='}
${configuration.firebaseApiKey ? `FIREBASE_API_KEY=${configuration.firebaseApiKey}` : '# FIREBASE_API_KEY='}
${configuration.firebaseAuthDomain ? `FIREBASE_AUTH_DOMAIN=${configuration.firebaseAuthDomain}` : '# FIREBASE_AUTH_DOMAIN='}
${configuration.firebaseProjectId ? `FIREBASE_PROJECT_ID=${configuration.firebaseProjectId}` : '# FIREBASE_PROJECT_ID='}
${configuration.firebaseStorageBucket ? `FIREBASE_STORAGE_BUCKET=${configuration.firebaseStorageBucket}` : '# FIREBASE_STORAGE_BUCKET='}
${configuration.firebaseMessagingSenderId ? `FIREBASE_MESSAGING_SENDER_ID=${configuration.firebaseMessagingSenderId}` : '# FIREBASE_MESSAGING_SENDER_ID='}
${configuration.firebaseAppId ? `FIREBASE_APP_ID=${configuration.firebaseAppId}` : '# FIREBASE_APP_ID='}
${configuration.azureStorageConnectionString ? `AZURE_STORAGE_CONNECTION_STRING=${configuration.azureStorageConnectionString}` : '# AZURE_STORAGE_CONNECTION_STRING='}
${configuration.azureStoragePublicAccess !== undefined ? `AZURE_STORAGE_PUBLIC_ACCESS=${configuration.azureStoragePublicAccess}` : '# AZURE_STORAGE_PUBLIC_ACCESS=false'}
${configuration.azureContainerName ? `AZURE_CONTAINER_NAME=${configuration.azureContainerName}` : '# AZURE_CONTAINER_NAME='}

# =============================================================================
# Search & External APIs Configuration
# =============================================================================
${configuration.googleSearchApiKey ? `GOOGLE_SEARCH_API_KEY=${configuration.googleSearchApiKey}` : '# GOOGLE_SEARCH_API_KEY='}
${configuration.googleCSEId ? `GOOGLE_CSE_ID=${configuration.googleCSEId}` : '# GOOGLE_CSE_ID='}
${configuration.bingSearchApiKey ? `BING_SEARCH_API_KEY=${configuration.bingSearchApiKey}` : '# BING_SEARCH_API_KEY='}
${configuration.openweatherApiKey ? `OPENWEATHER_API_KEY=${configuration.openweatherApiKey}` : '# OPENWEATHER_API_KEY='}
${configuration.librechatCodeApiKey ? `LIBRECHAT_CODE_API_KEY=${configuration.librechatCodeApiKey}` : '# LIBRECHAT_CODE_API_KEY='}

# =============================================================================
# RAG API Configuration
# =============================================================================
${configuration.ragApiURL ? `RAG_API_URL=${configuration.ragApiURL}` : '# RAG_API_URL='}
${configuration.ragOpenaiApiKey ? `RAG_OPENAI_API_KEY=${configuration.ragOpenaiApiKey}` : '# RAG_OPENAI_API_KEY='}
${configuration.ragPort ? `RAG_PORT=${configuration.ragPort}` : '# RAG_PORT='}
${configuration.ragHost ? `RAG_HOST=${configuration.ragHost}` : '# RAG_HOST='}
${configuration.collectionName ? `COLLECTION_NAME=${configuration.collectionName}` : '# COLLECTION_NAME='}
${configuration.chunkSize ? `CHUNK_SIZE=${configuration.chunkSize}` : '# CHUNK_SIZE='}
${configuration.chunkOverlap ? `CHUNK_OVERLAP=${configuration.chunkOverlap}` : '# CHUNK_OVERLAP='}
${configuration.embeddingsProvider ? `EMBEDDINGS_PROVIDER=${configuration.embeddingsProvider}` : '# EMBEDDINGS_PROVIDER='}

# =============================================================================
# MeiliSearch Configuration
# =============================================================================
${configuration.search !== undefined ? `SEARCH=${configuration.search}` : '# SEARCH=true'}
${configuration.meilisearchURL ? `MEILISEARCH_URL=${configuration.meilisearchURL}` : '# MEILISEARCH_URL='}
${configuration.meilisearchMasterKey ? `MEILISEARCH_MASTER_KEY=${configuration.meilisearchMasterKey}` : '# MEILISEARCH_MASTER_KEY='}
${configuration.meiliNoAnalytics !== undefined ? `MEILI_NO_ANALYTICS=${configuration.meiliNoAnalytics}` : '# MEILI_NO_ANALYTICS=true'}

# =============================================================================
# Rate Limiting & Security Configuration
# =============================================================================
${configuration.limitConcurrentMessages !== undefined ? `LIMIT_CONCURRENT_MESSAGES=${configuration.limitConcurrentMessages}` : '# LIMIT_CONCURRENT_MESSAGES=true'}
${configuration.concurrentMessageMax ? `CONCURRENT_MESSAGE_MAX=${configuration.concurrentMessageMax}` : '# CONCURRENT_MESSAGE_MAX=2'}
${configuration.banViolations !== undefined ? `BAN_VIOLATIONS=${configuration.banViolations}` : '# BAN_VIOLATIONS=true'}
${configuration.banDuration ? `BAN_DURATION=${configuration.banDuration}` : '# BAN_DURATION=7200000'}
${configuration.banInterval ? `BAN_INTERVAL=${configuration.banInterval}` : '# BAN_INTERVAL=20'}
${configuration.loginViolationScore ? `LOGIN_VIOLATION_SCORE=${configuration.loginViolationScore}` : '# LOGIN_VIOLATION_SCORE=1'}
${configuration.registrationViolationScore ? `REGISTRATION_VIOLATION_SCORE=${configuration.registrationViolationScore}` : '# REGISTRATION_VIOLATION_SCORE=1'}
${configuration.concurrentViolationScore ? `CONCURRENT_VIOLATION_SCORE=${configuration.concurrentViolationScore}` : '# CONCURRENT_VIOLATION_SCORE=1'}
${configuration.messageViolationScore ? `MESSAGE_VIOLATION_SCORE=${configuration.messageViolationScore}` : '# MESSAGE_VIOLATION_SCORE=1'}
${configuration.nonBrowserViolationScore ? `NON_BROWSER_VIOLATION_SCORE=${configuration.nonBrowserViolationScore}` : '# NON_BROWSER_VIOLATION_SCORE=20'}
${configuration.loginMax ? `LOGIN_MAX=${configuration.loginMax}` : '# LOGIN_MAX=7'}
${configuration.loginWindow ? `LOGIN_WINDOW=${configuration.loginWindow}` : '# LOGIN_WINDOW=5'}

# =============================================================================
# LDAP Configuration
# =============================================================================
${configuration.ldapURL ? `LDAP_URL=${configuration.ldapURL}` : '# LDAP_URL='}
${configuration.ldapBindDN ? `LDAP_BIND_DN=${configuration.ldapBindDN}` : '# LDAP_BIND_DN='}
${configuration.ldapBindCredentials ? `LDAP_BIND_CREDENTIALS=${configuration.ldapBindCredentials}` : '# LDAP_BIND_CREDENTIALS='}
${configuration.ldapSearchBase ? `LDAP_SEARCH_BASE=${configuration.ldapSearchBase}` : '# LDAP_SEARCH_BASE='}
${configuration.ldapSearchFilter ? `LDAP_SEARCH_FILTER=${configuration.ldapSearchFilter}` : '# LDAP_SEARCH_FILTER='}

# =============================================================================
# Turnstile Configuration
# =============================================================================
${configuration.turnstileSiteKey ? `TURNSTILE_SITE_KEY=${configuration.turnstileSiteKey}` : '# TURNSTILE_SITE_KEY='}
${configuration.turnstileSecretKey ? `TURNSTILE_SECRET_KEY=${configuration.turnstileSecretKey}` : '# TURNSTILE_SECRET_KEY='}

# =============================================================================
# Features Configuration
# =============================================================================
${configuration.allowSharedLinks !== undefined ? `ALLOW_SHARED_LINKS=${configuration.allowSharedLinks}` : '# ALLOW_SHARED_LINKS=true'}
${configuration.allowSharedLinksPublic !== undefined ? `ALLOW_SHARED_LINKS_PUBLIC=${configuration.allowSharedLinksPublic}` : '# ALLOW_SHARED_LINKS_PUBLIC=false'}
${configuration.titleConvo !== undefined ? `TITLE_CONVO=${configuration.titleConvo}` : '# TITLE_CONVO=true'}
${configuration.summaryConvo !== undefined ? `SUMMARY_CONVO=${configuration.summaryConvo}` : '# SUMMARY_CONVO=false'}

# =============================================================================
# Caching Configuration
# =============================================================================
${configuration.staticCacheMaxAge ? `STATIC_CACHE_MAX_AGE=${configuration.staticCacheMaxAge}` : '# STATIC_CACHE_MAX_AGE='}
${configuration.staticCacheSMaxAge ? `STATIC_CACHE_S_MAX_AGE=${configuration.staticCacheSMaxAge}` : '# STATIC_CACHE_S_MAX_AGE='}
${configuration.indexCacheControl ? `INDEX_CACHE_CONTROL=${configuration.indexCacheControl}` : '# INDEX_CACHE_CONTROL='}
${configuration.indexPragma ? `INDEX_PRAGMA=${configuration.indexPragma}` : '# INDEX_PRAGMA='}
${configuration.indexExpires ? `INDEX_EXPIRES=${configuration.indexExpires}` : '# INDEX_EXPIRES='}

# =============================================================================
# MCP Configuration
# =============================================================================
${configuration.mcpOauthOnAuthError ? `MCP_OAUTH_ON_AUTH_ERROR=${configuration.mcpOauthOnAuthError}` : '# MCP_OAUTH_ON_AUTH_ERROR='}
${configuration.mcpOauthDetectionTimeout ? `MCP_OAUTH_DETECTION_TIMEOUT=${configuration.mcpOauthDetectionTimeout}` : '# MCP_OAUTH_DETECTION_TIMEOUT='}

# =============================================================================
# User Management Configuration
# =============================================================================
${configuration.uid ? `UID=${configuration.uid}` : '# UID='}
${configuration.gid ? `GID=${configuration.gid}` : '# GID='}

# =============================================================================
# Debug Configuration
# =============================================================================
${configuration.debugLogging !== undefined ? `DEBUG_LOGGING=${configuration.debugLogging}` : '# DEBUG_LOGGING=false'}
${configuration.debugConsole !== undefined ? `DEBUG_CONSOLE=${configuration.debugConsole}` : '# DEBUG_CONSOLE=false'}
${configuration.consoleJSON !== undefined ? `CONSOLE_JSON=${configuration.consoleJSON}` : '# CONSOLE_JSON=false'}

# =============================================================================
# Miscellaneous Configuration
# =============================================================================
${configuration.cdnProvider ? `CDN_PROVIDER=${configuration.cdnProvider}` : '# CDN_PROVIDER='}

# =============================================================================
# End of Configuration
# =============================================================================`;
  };

  const generateYamlPreview = () => {
    return `# LibreChat YAML Configuration (RC4)
# This file configures the available AI models and endpoints for LibreChat
# Generated on ${new Date().toISOString().split('T')[0]}

version: 1.1.6

cache: true

# =============================================================================
# Endpoint Configuration
# =============================================================================
endpoints:
  assistants:
    disableBuilder: false
    pollIntervalMs: 750
    timeoutMs: 180000
    supportedIds: ["asst_"]
    
  custom:
    # Example custom endpoint - customize as needed
    - name: "Custom AI Provider"
      apiKey: "\${CUSTOM_API_KEY}"
      baseURL: "https://api.example.com/v1"
      models:
        default: [
          "custom-model-1",
          "custom-model-2"
        ]
      titleConvo: true
      titleModel: "current_model"
      summarize: false
      summaryModel: "current_model"
      forcePrompt: false
      modelDisplayLabel: "Custom Provider"

# =============================================================================
# Model Configuration  
# =============================================================================
${configuration.openaiApiKey ? `
# OpenAI Configuration
openAI:
  models:
    default: [
      "gpt-4o",
      "gpt-4o-mini", 
      "gpt-4-turbo",
      "gpt-4",
      "gpt-3.5-turbo"
    ]
  titleConvo: true
  titleModel: "gpt-3.5-turbo"
  summarize: false
  summaryModel: "gpt-3.5-turbo"
  dropParams: ["user"]
` : '# OpenAI: Not configured'}

${configuration.anthropicApiKey ? `
# Anthropic Configuration
anthropic:
  models:
    default: [
      "claude-3-5-sonnet-20241022",
      "claude-3-5-haiku-20241022", 
      "claude-3-opus-20240229",
      "claude-3-sonnet-20240229",
      "claude-3-haiku-20240307"
    ]
  titleConvo: true
  titleModel: "claude-3-haiku-20240307"
  dropParams: ["stop", "user"]
` : '# Anthropic: Not configured'}

${configuration.googleApiKey ? `
# Google AI Configuration
google:
  models:
    default: [
      "gemini-1.5-pro-latest",
      "gemini-1.5-flash-latest",
      "gemini-pro",
      "gemini-pro-vision"
    ]
  titleConvo: true
  titleModel: "gemini-pro"
` : '# Google AI: Not configured'}

${configuration.groqApiKey ? `
# Groq Configuration
groq:
  models:
    default: [
      "llama-3.1-405b-reasoning",
      "llama-3.1-70b-versatile",
      "llama-3.1-8b-instant",
      "mixtral-8x7b-32768"
    ]
  titleConvo: true
  titleModel: "llama-3.1-8b-instant"
` : '# Groq: Not configured'}

${configuration.mistralApiKey ? `
# Mistral AI Configuration
mistralai:
  models:
    default: [
      "mistral-large-latest",
      "mistral-medium-latest", 
      "mistral-small-latest",
      "codestral-latest"
    ]
  titleConvo: true
  titleModel: "mistral-small-latest"
` : '# Mistral AI: Not configured'}

# =============================================================================
# Model Rate Limits (requests per minute)
# =============================================================================
rateLimits:
  fileUploads:
    maxCount: 5
    maxSize: "20MB"
  
  default:
    requests: 50
    interval: "1m"
    
  premium:
    requests: 200  
    interval: "1m"

# =============================================================================
# File Configuration
# =============================================================================
fileConfig:
  endpoints:
    assistants:
      fileLimit: 20
      fileSizeLimit: 512
      totalSizeLimit: 1024
      supportedMimeTypes:
        - "image/*"
        - "text/*"
        - "application/pdf"
        - "application/json"
        - "application/vnd.openxmlformats-officedocument.*"
    
    openAI:
      disabled: false
      fileLimit: 10
      fileSizeLimit: 100
      totalSizeLimit: 1000
      supportedMimeTypes:
        - "image/*"
        - "text/*"
        - "application/pdf"
    
  serverFileSizeLimit: 1000
  avatarSizeLimit: 2

# =============================================================================
# Interface Configuration
# =============================================================================
interface:
  privacyPolicy:
    externalUrl: ""
    openNewTab: true
  
  termsOfService:
    externalUrl: ""
    openNewTab: true
`;
  };

  const generateJsonPreview = () => {
    const configWithVersion = createVersionedConfiguration(configuration);
    return JSON.stringify(configWithVersion, null, 2);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Configuration Preview</DialogTitle>
              <DialogDescription>
                Preview your LibreChat configuration files before generating the deployment package
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={onGenerate} className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white">
                <Download className="h-4 w-4 mr-2" />
                Generate Package
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 overflow-hidden">
          <Tabs defaultValue="env" className="h-full flex flex-col">
            <div className="px-6 flex-shrink-0">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="env">Environment (.env)</TabsTrigger>
                <TabsTrigger value="yaml">Configuration (librechat.yaml)</TabsTrigger>
                <TabsTrigger value="json">LibreChat Configuration Settings (JSON)</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 min-h-0 px-6 pb-6">
              <TabsContent value="env" className="h-full mt-4" style={{ height: 'calc(100% - 1rem)' }}>
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Environment Configuration File</h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generateEnvPreview(), ".env file")}
                        data-testid="button-copy-env"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy to Clipboard
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(generateEnvPreview(), "librechat.env", "text/plain")}
                        data-testid="button-download-env"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="flex-1 rounded-md border">
                    <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                      {generateEnvPreview()}
                    </pre>
                  </ScrollArea>
                </div>
              </TabsContent>
              
              <TabsContent value="yaml" className="h-full mt-4" style={{ height: 'calc(100% - 1rem)' }}>
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">YAML Configuration File</h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generateYamlPreview(), "librechat.yaml file")}
                        data-testid="button-copy-yaml"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy to Clipboard
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(generateYamlPreview(), "librechat.yaml", "text/yaml")}
                        data-testid="button-download-yaml"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="flex-1 rounded-md border">
                    <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                      {generateYamlPreview()}
                    </pre>
                  </ScrollArea>
                </div>
              </TabsContent>
              
              <TabsContent value="json" className="h-full mt-4" style={{ height: 'calc(100% - 1rem)' }}>
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-muted-foreground">JSON Configuration Export</h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generateJsonPreview(), "LibreChat Configuration Settings (JSON)")}
                        data-testid="button-copy-json"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy to Clipboard
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(generateJsonPreview(), `librechat-config-v${CONFIG_VERSION}.json`, "application/json")}
                        data-testid="button-download-json"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="flex-1 rounded-md border">
                    <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                      {generateJsonPreview()}
                    </pre>
                  </ScrollArea>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}