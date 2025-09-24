import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SettingInput } from "./setting-input";
import { StatusIndicator } from "./status-indicator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Configuration } from "@shared/schema";
import { 
  Server, 
  Shield, 
  Database, 
  Eye, 
  Brain, 
  Plug, 
  Bot, 
  FileText, 
  Gauge, 
  Key, 
  MemoryStick, 
  Search, 
  Network, 
  Camera, 
  Wrench, 
  Clock, 
  Download,
  Plus,
  Trash2,
  X
} from "lucide-react";

interface ConfigurationTabsProps {
  configuration: Configuration;
  onConfigurationChange: (updates: Partial<Configuration>) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export function ConfigurationTabs({ 
  configuration, 
  onConfigurationChange, 
  searchQuery,
  onSearchQueryChange
}: ConfigurationTabsProps) {
  const [activeTab, setActiveTab] = useState("server");

  const tabs = [
    {
      id: "app",
      label: "App Settings",
      icon: Server,
      description: "Title, Welcome, Footer",
      color: "from-blue-500 to-blue-600",
      settings: ["appTitle", "customWelcome", "customFooter", "helpAndFAQURL"],
    },
    {
      id: "server",
      label: "Server",
      icon: Server,
      description: "Host, Port, Environment",
      color: "from-blue-500 to-blue-600",
      settings: ["host", "port", "nodeEnv", "domainClient", "domainServer", "noIndex"],
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
      description: "JWT, Encryption, Passwords",
      color: "from-red-500 to-red-600",
      settings: ["jwtSecret", "jwtRefreshSecret", "credsKey", "credsIV", "minPasswordLength", "sessionExpiry", "refreshTokenExpiry"],
    },
    {
      id: "database",
      label: "Database",
      icon: Database,
      description: "MongoDB, Redis",
      color: "from-green-500 to-green-600",
      settings: ["mongoUri", "mongoRootUsername", "mongoRootPassword", "mongoDbName", "redisUri", "redisUsername", "redisPassword", "redisKeyPrefix", "redisKeyPrefixVar", "redisMaxListeners", "redisPingInterval", "redisUseAlternativeDNSLookup"],
    },
    {
      id: "auth",
      label: "Authentication",
      icon: Shield,
      description: "Login & Registration",
      color: "from-yellow-500 to-yellow-600",
      settings: ["allowRegistration", "allowEmailLogin", "allowSocialLogin", "allowSocialRegistration", "allowPasswordReset"],
    },
    {
      id: "email",
      label: "Email",
      icon: FileText,
      description: "Email Configuration",
      color: "from-blue-400 to-blue-500",
      settings: ["emailService", "emailUsername", "emailPassword", "emailFrom", "emailFromName", "mailgunApiKey", "mailgunDomain", "mailgunHost"],
    },
    {
      id: "oauth",
      label: "OAuth Providers",
      icon: Key,
      description: "Social Login Configuration",
      color: "from-purple-500 to-purple-600",
      settings: [
        "googleClientId", "googleClientSecret", "googleCallbackURL",
        "githubClientId", "githubClientSecret", "githubCallbackURL", 
        "discordClientId", "discordClientSecret", "discordCallbackURL",
        "facebookClientId", "facebookClientSecret", "facebookCallbackURL",
        "appleClientId", "applePrivateKey", "appleKeyId", "appleTeamId", "appleCallbackURL",
        "openidURL", "openidClientId", "openidClientSecret", "openidCallbackURL", "openidScope", "openidSessionSecret", "openidIssuer", "openidButtonLabel", "openidImageURL"
      ],
    },
    {
      id: "ai-core",
      label: "Core AI APIs",
      icon: Brain,
      description: "Primary AI Providers",
      color: "from-indigo-500 to-indigo-600",
      settings: ["openaiApiKey", "anthropicApiKey", "googleApiKey", "groqApiKey", "mistralApiKey"],
    },
    {
      id: "ai-extended",
      label: "Extended AI APIs",
      icon: Key,
      description: "Additional AI Providers",
      color: "from-emerald-500 to-emerald-600",
      settings: [
        "deepseekApiKey", "perplexityApiKey", "fireworksApiKey", "togetheraiApiKey", 
        "huggingfaceToken", "xaiApiKey", "nvidiaApiKey", "sambaNovaApiKey", 
        "hyperbolicApiKey", "klusterApiKey", "nanogptApiKey", "glhfApiKey", 
        "apipieApiKey", "unifyApiKey", "openrouterKey"
      ],
    },
    {
      id: "azure",
      label: "Azure OpenAI",
      icon: Plug,
      description: "Azure Configuration",
      color: "from-cyan-500 to-cyan-600",
      settings: ["azureApiKey", "azureOpenaiApiInstanceName", "azureOpenaiApiDeploymentName", "azureOpenaiApiVersion", "azureOpenaiModels"],
    },
    {
      id: "aws",
      label: "AWS Bedrock",
      icon: Database,
      description: "AWS Configuration",
      color: "from-orange-500 to-orange-600",
      settings: ["awsAccessKeyId", "awsSecretAccessKey", "awsRegion", "awsBedrockRegion", "awsEndpointURL", "awsBucketName"],
    },
    {
      id: "file-storage",
      label: "File Storage",
      icon: FileText,
      description: "File Upload & Storage",
      color: "from-teal-500 to-teal-600",
      settings: [
        "fileUploadPath", 
        "firebaseApiKey", "firebaseAuthDomain", "firebaseProjectId", "firebaseStorageBucket", "firebaseMessagingSenderId", "firebaseAppId",
        "azureStorageConnectionString", "azureStoragePublicAccess", "azureContainerName"
      ],
    },
    {
      id: "search",
      label: "Search & APIs",
      icon: Search,
      description: "Web Search & External APIs",
      color: "from-violet-500 to-violet-600",
      settings: ["googleSearchApiKey", "googleCSEId", "bingSearchApiKey", "openweatherApiKey", "librechatCodeApiKey"],
    },
    {
      id: "rag",
      label: "RAG API",
      icon: Database,
      description: "Retrieval Augmented Generation",
      color: "from-pink-500 to-pink-600",
      settings: ["ragApiURL", "ragOpenaiApiKey", "ragPort", "ragHost", "collectionName", "chunkSize", "chunkOverlap", "embeddingsProvider"],
    },
    {
      id: "meili",
      label: "MeiliSearch",
      icon: Search,
      description: "Search Engine Configuration",
      color: "from-gray-500 to-gray-600",
      settings: ["search", "meilisearchURL", "meilisearchMasterKey", "meiliNoAnalytics"],
    },
    {
      id: "rate-security",
      label: "Rate & Security",
      icon: Gauge,
      description: "Rate Limiting & Security",
      color: "from-red-400 to-red-500",
      settings: [
        "limitConcurrentMessages", "concurrentMessageMax", "banViolations", "banDuration", "banInterval",
        "loginViolationScore", "registrationViolationScore", "concurrentViolationScore", "messageViolationScore", 
        "nonBrowserViolationScore", "loginMax", "loginWindow"
      ],
    },
    {
      id: "ldap",
      label: "LDAP",
      icon: Shield,
      description: "LDAP Configuration",
      color: "from-yellow-600 to-yellow-700",
      settings: ["ldapURL", "ldapBindDN", "ldapBindCredentials", "ldapSearchBase", "ldapSearchFilter"],
    },
    {
      id: "turnstile",
      label: "Turnstile",
      icon: Shield,
      description: "Cloudflare Turnstile",
      color: "from-orange-400 to-orange-500",
      settings: ["turnstileSiteKey", "turnstileSecretKey"],
    },
    {
      id: "features",
      label: "Features",
      icon: Eye,
      description: "Feature Toggles",
      color: "from-purple-500 to-purple-600",
      settings: ["allowSharedLinks", "allowSharedLinksPublic", "titleConvo", "summaryConvo"],
    },
    {
      id: "caching",
      label: "Caching",
      icon: Clock,
      description: "Cache & Static Files",
      color: "from-slate-500 to-slate-600",
      settings: ["staticCacheMaxAge", "staticCacheSMaxAge", "indexCacheControl", "indexPragma", "indexExpires"],
    },
    {
      id: "mcp",
      label: "MCP",
      icon: Network,
      description: "Model Context Protocol",
      color: "from-rose-500 to-rose-600",
      settings: ["mcpOauthOnAuthError", "mcpOauthDetectionTimeout"],
    },
    {
      id: "users",
      label: "Users",
      icon: FileText,
      description: "User Management",
      color: "from-green-400 to-green-500",
      settings: ["uid", "gid"],
    },
    {
      id: "debug",
      label: "Debug",
      icon: Wrench,
      description: "Logging & Debug",
      color: "from-amber-500 to-amber-600",
      settings: ["debugLogging", "debugConsole", "consoleJSON"],
    },
    {
      id: "misc",
      label: "Miscellaneous",
      icon: Server,
      description: "Other Settings",
      color: "from-gray-400 to-gray-500",
      settings: ["cdnProvider"],
    },
    {
      id: "generate",
      label: "Generate",
      icon: Download,
      description: "Create Package",
      color: "from-emerald-600 to-green-700",
      settings: [],
    },
  ];

  const getTabProgress = (tabSettings: string[]) => {
    if (tabSettings.length === 0) return 100;
    const validSettings = tabSettings.filter(setting => {
      const value = configuration[setting as keyof Configuration];
      return value !== undefined && value !== null && value !== "";
    });
    return Math.round((validSettings.length / tabSettings.length) * 100);
  };

  const filteredTabs = tabs.filter(tab => 
    searchQuery === "" || 
    tab.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tab.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to get field type and description
  const getFieldInfo = (fieldName: string) => {
    const fieldMap: Record<string, { 
      type: "text" | "number" | "password" | "boolean" | "select" | "textarea" | "array" | "object"; 
      description: string; 
      label: string;
      docUrl?: string;
      docSection?: string;
    }> = {
      // App Settings
      appTitle: { 
        type: "text", 
        description: "Sets the custom application title displayed in the browser tab and header. This overrides the default 'LibreChat' branding with your preferred name.", 
        label: "App Title",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#application-domains",
        docSection: "App Settings"
      },
      customWelcome: { 
        type: "textarea", 
        description: "Custom welcome message shown to users when they first access LibreChat. Supports markdown formatting for rich text.", 
        label: "Welcome Message",
        docUrl: "https://www.librechat.ai/docs/configuration/librechat_yaml/object_structure/config",
        docSection: "Interface Config"
      },
      customFooter: { 
        type: "textarea", 
        description: "Custom footer text displayed at the bottom of the interface. Use this for copyright, contact information, or additional links.", 
        label: "Footer Text",
        docUrl: "https://www.librechat.ai/docs/configuration/librechat_yaml/object_structure/config",
        docSection: "Interface Config"
      },
      helpAndFAQURL: { 
        type: "text", 
        description: "URL to your help documentation or FAQ page. This creates a help link in the interface for user support.", 
        label: "Help & FAQ URL",
        docUrl: "https://www.librechat.ai/docs/configuration/librechat_yaml/object_structure/config",
        docSection: "Interface Config"
      },
      
      // Server
      host: { 
        type: "text", 
        description: "The address where LibreChat server listens for connections. Use 0.0.0.0 to accept connections from any IP address, or localhost for local-only access. Critical for Docker deployments.", 
        label: "Host",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#server-configuration",
        docSection: "Server Config"
      },
      port: { 
        type: "number", 
        description: "Port number where LibreChat runs. Default is 3080. Ensure this port is available and matches your Docker compose or proxy configuration.", 
        label: "Port",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#port",
        docSection: "Server Config"
      },
      nodeEnv: { 
        type: "select", 
        description: "Node.js environment mode. 'production' enables optimizations and security features. 'development' provides detailed error messages for debugging.", 
        label: "Environment",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#server-configuration",
        docSection: "Server Config"
      },
      domainClient: { 
        type: "text", 
        description: "Full URL where users access LibreChat (e.g., https://chat.yourcompany.com). Required for proper CORS, OAuth callbacks, and link generation.", 
        label: "Client Domain",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#application-domains",
        docSection: "Server Config"
      },
      domainServer: { 
        type: "text", 
        description: "Internal server URL for API calls. Usually same as client domain unless using separate API server. Critical for proper routing and authentication.", 
        label: "Server Domain",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#application-domains",
        docSection: "Server Config"
      },
      noIndex: { 
        type: "boolean", 
        description: "When enabled, adds meta tags to prevent search engines (Google, Bing) from indexing your LibreChat instance. Recommended for internal/private deployments.", 
        label: "No Index",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#prevent-public-search-engines-indexing",
        docSection: "Server Config"
      },
      
      // Security
      jwtSecret: { 
        type: "password", 
        description: "Secret key for signing JWT authentication tokens. Must be at least 32 characters long. Keep this secure and unique - changing it will log out all users. CRITICAL for security!", 
        label: "JWT Secret",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#credentials-configuration",
        docSection: "Security"
      },
      jwtRefreshSecret: { 
        type: "password", 
        description: "Separate secret for JWT refresh tokens. Should be different from JWT secret. Used for token rotation and extended authentication sessions.", 
        label: "JWT Refresh Secret",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#credentials-configuration",
        docSection: "Security"
      },
      credsKey: { 
        type: "password", 
        description: "32-byte encryption key (64 hex chars) for securely storing API credentials in database. Required for app startup. Generate with provided key generator tool.", 
        label: "Credentials Key",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#credentials-configuration",
        docSection: "Security"
      },
      credsIV: { 
        type: "password", 
        description: "16-byte initialization vector (32 hex chars) for credential encryption. Must pair with credentials key. Required for secure API key storage.", 
        label: "Credentials IV",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#credentials-configuration",
        docSection: "Security"
      },
      minPasswordLength: { 
        type: "number", 
        description: "Minimum character length required for user passwords. Recommended: 8-12 characters. Higher values increase security but may impact user experience.", 
        label: "Min Password Length",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#credentials-configuration",
        docSection: "Security"
      },
      sessionExpiry: { 
        type: "number", 
        description: "How long user sessions last in milliseconds. Default 15 minutes (900000ms). Shorter values increase security, longer values improve user experience.", 
        label: "Session Expiry",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#credentials-configuration",
        docSection: "Security"
      },
      refreshTokenExpiry: { 
        type: "number", 
        description: "Refresh token lifetime in milliseconds. Default 7 days (604800000ms). Allows users to stay logged in without re-entering credentials.", 
        label: "Refresh Token Expiry",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#credentials-configuration",
        docSection: "Security"
      },
      
      // Database
      mongoUri: { 
        type: "text", 
        description: "MongoDB connection string. Use mongodb://localhost:27017/LibreChat for local setup or mongodb+srv:// format for cloud databases like MongoDB Atlas. Include database name in URI.", 
        label: "MongoDB URI",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#mongodb-database",
        docSection: "Database"
      },
      mongoRootUsername: { 
        type: "text", 
        description: "MongoDB administrator username. Only required if MongoDB authentication is enabled. Leave empty for Docker setups without authentication.", 
        label: "MongoDB Username",
        docUrl: "https://www.librechat.ai/docs/configuration/mongodb/mongodb_auth",
        docSection: "Database"
      },
      mongoRootPassword: { 
        type: "password", 
        description: "MongoDB administrator password. Must match the username credentials. Keep secure and use strong passwords for production databases.", 
        label: "MongoDB Password",
        docUrl: "https://www.librechat.ai/docs/configuration/mongodb/mongodb_auth",
        docSection: "Database"
      },
      mongoDbName: { 
        type: "text", 
        description: "Name of the MongoDB database to store LibreChat data. Usually 'LibreChat'. This database will be created automatically if it doesn't exist.", 
        label: "Database Name",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#mongodb-database",
        docSection: "Database"
      },
      redisUri: { 
        type: "text", 
        description: "Redis connection string for caching and session storage. Use redis://localhost:6379/0 for local or cloud Redis URLs. Improves performance significantly.", 
        label: "Redis URI",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#mongodb-database",
        docSection: "Database"
      },
      redisUsername: { 
        type: "text", 
        description: "Redis username if authentication is required. Many Redis setups don't require auth, so this may be optional depending on your configuration.", 
        label: "Redis Username",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#mongodb-database",
        docSection: "Database"
      },
      redisPassword: { 
        type: "password", 
        description: "Redis password for authenticated connections. Required for production Redis instances with AUTH enabled. Keep secure.", 
        label: "Redis Password",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#mongodb-database",
        docSection: "Database"
      },
      redisKeyPrefix: { 
        type: "text", 
        description: "Prefix added to all Redis keys to avoid conflicts when sharing Redis with other applications. Example: 'librechat:' creates keys like 'librechat:session:abc123'.", 
        label: "Redis Key Prefix",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#mongodb-database",
        docSection: "Database"
      },
      redisKeyPrefixVar: { 
        type: "text", 
        description: "Environment variable name that contains the Redis key prefix. Alternative to hardcoding the prefix directly. Allows dynamic configuration per environment.", 
        label: "Redis Key Prefix Var",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#mongodb-database",
        docSection: "Database"
      },
      redisMaxListeners: { 
        type: "number", 
        description: "Maximum number of event listeners Redis client can have. Default is 10. Increase if you get 'MaxListenersExceededWarning' in logs with high traffic.", 
        label: "Redis Max Listeners",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#mongodb-database",
        docSection: "Database"
      },
      redisPingInterval: { 
        type: "number", 
        description: "Interval in milliseconds for Redis connection health checks. Default 30000 (30s). Lower values detect failures faster but increase network traffic.", 
        label: "Redis Ping Interval",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#mongodb-database",
        docSection: "Database"
      },
      redisUseAlternativeDNSLookup: { 
        type: "boolean", 
        description: "Use alternative DNS resolution for Redis connections. Enable if experiencing DNS issues in containerized environments or with certain cloud providers.", 
        label: "Alternative DNS Lookup",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#mongodb-database",
        docSection: "Database"
      },
      
      // Authentication
      allowRegistration: { 
        type: "boolean", 
        description: "When enabled, allows new users to create accounts. Disable for invite-only or enterprise deployments where accounts are managed externally.", 
        label: "Allow Registration",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#authentication",
        docSection: "Authentication"
      },
      allowEmailLogin: { 
        type: "boolean", 
        description: "Enables login with email and password. Core authentication method. Disable only if using social login exclusively.", 
        label: "Allow Email Login",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#authentication",
        docSection: "Authentication"
      },
      allowSocialLogin: { 
        type: "boolean", 
        description: "Enables OAuth login with configured providers (Google, GitHub, Discord, etc.). Requires setting up OAuth credentials for each provider.", 
        label: "Allow Social Login",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#authentication",
        docSection: "Authentication"
      },
      allowSocialRegistration: { 
        type: "boolean", 
        description: "Allows new account creation via social OAuth providers. Users can sign up using Google, GitHub, etc. without email verification.", 
        label: "Allow Social Registration",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#authentication",
        docSection: "Authentication"
      },
      allowPasswordReset: { 
        type: "boolean", 
        description: "Enables password reset functionality via email. Requires email service configuration (SMTP or Mailgun) to send reset links to users.", 
        label: "Allow Password Reset",
        docUrl: "https://www.librechat.ai/docs/configuration/dotenv#authentication",
        docSection: "Authentication"
      },
      
      // Email
      emailService: { type: "text", description: "Email service provider", label: "Email Service" },
      emailUsername: { type: "text", description: "Email username", label: "Email Username" },
      emailPassword: { type: "password", description: "Email password", label: "Email Password" },
      emailFrom: { type: "text", description: "Email from address", label: "Email From" },
      emailFromName: { type: "text", description: "Email from name", label: "Email From Name" },
      mailgunApiKey: { type: "password", description: "Mailgun API key", label: "Mailgun API Key" },
      mailgunDomain: { type: "text", description: "Mailgun domain", label: "Mailgun Domain" },
      mailgunHost: { type: "text", description: "Mailgun host URL", label: "Mailgun Host" },
      
      // OAuth Providers
      googleClientId: { type: "text", description: "Google OAuth client ID", label: "Google Client ID" },
      googleClientSecret: { type: "password", description: "Google OAuth client secret", label: "Google Client Secret" },
      googleCallbackURL: { type: "text", description: "Google OAuth callback URL", label: "Google Callback URL" },
      githubClientId: { type: "text", description: "GitHub OAuth client ID", label: "GitHub Client ID" },
      githubClientSecret: { type: "password", description: "GitHub OAuth client secret", label: "GitHub Client Secret" },
      githubCallbackURL: { type: "text", description: "GitHub OAuth callback URL", label: "GitHub Callback URL" },
      discordClientId: { type: "text", description: "Discord OAuth client ID", label: "Discord Client ID" },
      discordClientSecret: { type: "password", description: "Discord OAuth client secret", label: "Discord Client Secret" },
      discordCallbackURL: { type: "text", description: "Discord OAuth callback URL", label: "Discord Callback URL" },
      facebookClientId: { type: "text", description: "Facebook OAuth client ID", label: "Facebook Client ID" },
      facebookClientSecret: { type: "password", description: "Facebook OAuth client secret", label: "Facebook Client Secret" },
      facebookCallbackURL: { type: "text", description: "Facebook OAuth callback URL", label: "Facebook Callback URL" },
      appleClientId: { type: "text", description: "Apple OAuth client ID", label: "Apple Client ID" },
      applePrivateKey: { type: "textarea", description: "Apple OAuth private key", label: "Apple Private Key" },
      appleKeyId: { type: "text", description: "Apple OAuth key ID", label: "Apple Key ID" },
      appleTeamId: { type: "text", description: "Apple OAuth team ID", label: "Apple Team ID" },
      appleCallbackURL: { type: "text", description: "Apple OAuth callback URL", label: "Apple Callback URL" },
      openidURL: { type: "text", description: "OpenID Connect URL", label: "OpenID URL" },
      openidClientId: { type: "text", description: "OpenID Connect client ID", label: "OpenID Client ID" },
      openidClientSecret: { type: "password", description: "OpenID Connect client secret", label: "OpenID Client Secret" },
      openidCallbackURL: { type: "text", description: "OpenID Connect callback URL", label: "OpenID Callback URL" },
      openidScope: { type: "text", description: "OpenID Connect scope", label: "OpenID Scope" },
      openidSessionSecret: { type: "password", description: "OpenID Connect session secret", label: "OpenID Session Secret" },
      openidIssuer: { type: "text", description: "OpenID Connect issuer", label: "OpenID Issuer" },
      openidButtonLabel: { type: "text", description: "OpenID Connect button label", label: "OpenID Button Label" },
      openidImageURL: { type: "text", description: "OpenID Connect button image URL", label: "OpenID Image URL" },
      
      // Core AI APIs
      openaiApiKey: { type: "password", description: "OpenAI API key", label: "OpenAI API Key" },
      anthropicApiKey: { type: "password", description: "Anthropic API key", label: "Anthropic API Key" },
      googleApiKey: { type: "password", description: "Google AI API key", label: "Google AI API Key" },
      groqApiKey: { type: "password", description: "Groq API key", label: "Groq API Key" },
      mistralApiKey: { type: "password", description: "Mistral AI API key", label: "Mistral API Key" },
      
      // Extended AI APIs
      deepseekApiKey: { type: "password", description: "DeepSeek API key", label: "DeepSeek API Key" },
      perplexityApiKey: { type: "password", description: "Perplexity API key", label: "Perplexity API Key" },
      fireworksApiKey: { type: "password", description: "Fireworks API key", label: "Fireworks API Key" },
      togetheraiApiKey: { type: "password", description: "Together AI API key", label: "Together AI API Key" },
      huggingfaceToken: { type: "password", description: "HuggingFace token", label: "HuggingFace Token" },
      xaiApiKey: { type: "password", description: "xAI (Grok) API key", label: "xAI API Key" },
      nvidiaApiKey: { type: "password", description: "NVIDIA API key", label: "NVIDIA API Key" },
      sambaNovaApiKey: { type: "password", description: "SambaNova API key", label: "SambaNova API Key" },
      hyperbolicApiKey: { type: "password", description: "Hyperbolic API key", label: "Hyperbolic API Key" },
      klusterApiKey: { type: "password", description: "Kluster API key", label: "Kluster API Key" },
      nanogptApiKey: { type: "password", description: "NanoGPT API key", label: "NanoGPT API Key" },
      glhfApiKey: { type: "password", description: "GLHF API key", label: "GLHF API Key" },
      apipieApiKey: { type: "password", description: "APIpie API key", label: "APIpie API Key" },
      unifyApiKey: { type: "password", description: "Unify API key", label: "Unify API Key" },
      openrouterKey: { type: "password", description: "OpenRouter API key", label: "OpenRouter API Key" },
      
      // Azure OpenAI
      azureApiKey: { type: "password", description: "Azure OpenAI API key", label: "Azure API Key" },
      azureOpenaiApiInstanceName: { type: "text", description: "Azure OpenAI instance name", label: "Azure Instance Name" },
      azureOpenaiApiDeploymentName: { type: "text", description: "Azure OpenAI deployment name", label: "Azure Deployment Name" },
      azureOpenaiApiVersion: { type: "text", description: "Azure OpenAI API version", label: "Azure API Version" },
      azureOpenaiModels: { type: "text", description: "Azure OpenAI models", label: "Azure OpenAI Models" },
      
      // AWS Bedrock
      awsAccessKeyId: { type: "password", description: "AWS access key ID", label: "AWS Access Key ID" },
      awsSecretAccessKey: { type: "password", description: "AWS secret access key", label: "AWS Secret Access Key" },
      awsRegion: { type: "text", description: "AWS region", label: "AWS Region" },
      awsBedrockRegion: { type: "text", description: "AWS Bedrock region", label: "AWS Bedrock Region" },
      awsEndpointURL: { type: "text", description: "AWS endpoint URL", label: "AWS Endpoint URL" },
      awsBucketName: { type: "text", description: "AWS S3 bucket name", label: "AWS Bucket Name" },
      
      // File Storage
      fileUploadPath: { type: "text", description: "Local file upload path", label: "File Upload Path" },
      firebaseApiKey: { type: "password", description: "Firebase API key", label: "Firebase API Key" },
      firebaseAuthDomain: { type: "text", description: "Firebase auth domain", label: "Firebase Auth Domain" },
      firebaseProjectId: { type: "text", description: "Firebase project ID", label: "Firebase Project ID" },
      firebaseStorageBucket: { type: "text", description: "Firebase storage bucket", label: "Firebase Storage Bucket" },
      firebaseMessagingSenderId: { type: "text", description: "Firebase messaging sender ID", label: "Firebase Messaging Sender ID" },
      firebaseAppId: { type: "text", description: "Firebase app ID", label: "Firebase App ID" },
      azureStorageConnectionString: { type: "password", description: "Azure storage connection string", label: "Azure Storage Connection String" },
      azureStoragePublicAccess: { type: "boolean", description: "Azure storage public access", label: "Azure Storage Public Access" },
      azureContainerName: { type: "text", description: "Azure container name", label: "Azure Container Name" },
      
      // Search & APIs
      googleSearchApiKey: { type: "password", description: "Google Search API key", label: "Google Search API Key" },
      googleCSEId: { type: "text", description: "Google Custom Search Engine ID", label: "Google CSE ID" },
      bingSearchApiKey: { type: "password", description: "Bing Search API key", label: "Bing Search API Key" },
      openweatherApiKey: { type: "password", description: "OpenWeather API key", label: "OpenWeather API Key" },
      librechatCodeApiKey: { type: "password", description: "LibreChat Code API key", label: "LibreChat Code API Key" },
      
      // RAG API
      ragApiURL: { type: "text", description: "RAG API URL", label: "RAG API URL" },
      ragOpenaiApiKey: { type: "password", description: "RAG OpenAI API key", label: "RAG OpenAI API Key" },
      ragPort: { type: "number", description: "RAG API port", label: "RAG Port" },
      ragHost: { type: "text", description: "RAG API host", label: "RAG Host" },
      collectionName: { type: "text", description: "Collection name", label: "Collection Name" },
      chunkSize: { type: "number", description: "Chunk size", label: "Chunk Size" },
      chunkOverlap: { type: "number", description: "Chunk overlap", label: "Chunk Overlap" },
      embeddingsProvider: { type: "text", description: "Embeddings provider", label: "Embeddings Provider" },
      
      // MeiliSearch
      search: { type: "boolean", description: "Enable search", label: "Enable Search" },
      meilisearchURL: { type: "text", description: "MeiliSearch URL", label: "MeiliSearch URL" },
      meilisearchMasterKey: { type: "password", description: "MeiliSearch master key", label: "MeiliSearch Master Key" },
      meiliNoAnalytics: { type: "boolean", description: "Disable MeiliSearch analytics", label: "No Analytics" },
      
      // Rate & Security
      limitConcurrentMessages: { type: "boolean", description: "Limit concurrent messages", label: "Limit Concurrent Messages" },
      concurrentMessageMax: { type: "number", description: "Max concurrent messages", label: "Concurrent Message Max" },
      banViolations: { type: "boolean", description: "Ban violations", label: "Ban Violations" },
      banDuration: { type: "number", description: "Ban duration", label: "Ban Duration" },
      banInterval: { type: "number", description: "Ban interval", label: "Ban Interval" },
      loginViolationScore: { type: "number", description: "Login violation score", label: "Login Violation Score" },
      registrationViolationScore: { type: "number", description: "Registration violation score", label: "Registration Violation Score" },
      concurrentViolationScore: { type: "number", description: "Concurrent violation score", label: "Concurrent Violation Score" },
      messageViolationScore: { type: "number", description: "Message violation score", label: "Message Violation Score" },
      nonBrowserViolationScore: { type: "number", description: "Non-browser violation score", label: "Non-Browser Violation Score" },
      loginMax: { type: "number", description: "Login max attempts", label: "Login Max" },
      loginWindow: { type: "number", description: "Login window", label: "Login Window" },
      
      // LDAP
      ldapURL: { type: "text", description: "LDAP server URL", label: "LDAP URL" },
      ldapBindDN: { type: "text", description: "LDAP bind DN", label: "LDAP Bind DN" },
      ldapBindCredentials: { type: "password", description: "LDAP bind credentials", label: "LDAP Bind Credentials" },
      ldapSearchBase: { type: "text", description: "LDAP search base", label: "LDAP Search Base" },
      ldapSearchFilter: { type: "text", description: "LDAP search filter", label: "LDAP Search Filter" },
      
      // Turnstile
      turnstileSiteKey: { type: "text", description: "Turnstile site key", label: "Turnstile Site Key" },
      turnstileSecretKey: { type: "password", description: "Turnstile secret key", label: "Turnstile Secret Key" },
      
      // Features
      allowSharedLinks: { type: "boolean", description: "Allow shared links", label: "Allow Shared Links" },
      allowSharedLinksPublic: { type: "boolean", description: "Allow public shared links", label: "Allow Public Shared Links" },
      titleConvo: { type: "boolean", description: "Generate conversation titles", label: "Title Conversations" },
      summaryConvo: { type: "boolean", description: "Generate conversation summaries", label: "Summary Conversations" },
      
      // Caching
      staticCacheMaxAge: { type: "number", description: "Static cache max age", label: "Static Cache Max Age" },
      staticCacheSMaxAge: { type: "number", description: "Static cache s-max-age", label: "Static Cache S-Max-Age" },
      indexCacheControl: { type: "text", description: "Index cache control", label: "Index Cache Control" },
      indexPragma: { type: "text", description: "Index pragma", label: "Index Pragma" },
      indexExpires: { type: "text", description: "Index expires", label: "Index Expires" },
      
      // MCP
      mcpOauthOnAuthError: { type: "text", description: "MCP OAuth on auth error", label: "MCP OAuth On Auth Error" },
      mcpOauthDetectionTimeout: { type: "number", description: "MCP OAuth detection timeout", label: "MCP OAuth Detection Timeout" },
      
      // Users
      uid: { type: "number", description: "User ID", label: "UID" },
      gid: { type: "number", description: "Group ID", label: "GID" },
      
      // Debug
      debugLogging: { type: "boolean", description: "Enable debug logging", label: "Debug Logging" },
      debugConsole: { type: "boolean", description: "Enable debug console", label: "Debug Console" },
      consoleJSON: { type: "boolean", description: "Console JSON format", label: "Console JSON" },
      
      // Miscellaneous
      cdnProvider: { type: "text", description: "CDN provider", label: "CDN Provider" },
    };
    
    return fieldMap[fieldName] || { type: "text", description: `Configuration for ${fieldName}`, label: fieldName };
  };

  return (
    <div className="flex">
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-white shadow-lg border-r border-border h-screen sticky top-16 overflow-y-auto">
        <div className="p-6">
          {/* Search functionality */}
          <div className="relative mb-4">
            <Input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full pl-10"
              data-testid="search-settings"
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          
          <h2 className="text-lg font-semibold text-foreground mb-4">Configuration Categories</h2>
          
          <nav className="space-y-2">
            {filteredTabs.map((tab) => {
              const Icon = tab.icon;
              const progress = getTabProgress(tab.settings);
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  data-testid={`tab-${tab.id}`}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg shadow-sm transition-all ${
                    isActive 
                      ? `bg-gradient-to-r ${tab.color} text-white` 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-left flex-1">
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs opacity-90">{tab.description}</div>
                  </div>
                  <StatusIndicator 
                    status={progress === 100 ? "valid" : progress > 50 ? "pending" : "invalid"}
                    count={`${Math.floor((progress / 100) * tab.settings.length)}/${tab.settings.length}`}
                  />
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Dynamic Tab Content Generation */}
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <div className="space-y-8">
                <Card className="card-hover">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${tab.color.replace('from-', 'from-').replace('to-', 'to-').replace('-500', '-100').replace('-600', '-200')} rounded-lg flex items-center justify-center`}>
                          <tab.icon className={`h-5 w-5 ${tab.color.replace('from-', 'text-').replace('to-', '').replace('-500', '-600').replace('-600', '-700').split(' ')[0]}`} />
                        </div>
                        <div>
                          <CardTitle>{tab.label} Configuration</CardTitle>
                          <CardDescription>{tab.description}</CardDescription>
                        </div>
                      </div>
                      <StatusIndicator 
                        status={getTabProgress(tab.settings) === 100 ? "valid" : getTabProgress(tab.settings) > 50 ? "pending" : "invalid"}
                        count={`${Math.floor((getTabProgress(tab.settings) / 100) * tab.settings.length)}/${tab.settings.length}`}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {tab.settings.map((setting) => {
                      const fieldInfo = getFieldInfo(setting);
                      return (
                        <SettingInput
                          key={setting}
                          label={fieldInfo.label}
                          description={fieldInfo.description}
                          docUrl={fieldInfo.docUrl}
                          docSection={fieldInfo.docSection}
                          type={fieldInfo.type}
                          value={configuration[setting as keyof Configuration] || ""}
                          onChange={(value) => onConfigurationChange({ [setting]: value })}
                          data-testid={`input-${setting}`}
                        />
                      );
                    })}
                    {tab.settings.length === 0 && (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        <tab.icon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>This section will contain configuration options for {tab.label.toLowerCase()}.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}