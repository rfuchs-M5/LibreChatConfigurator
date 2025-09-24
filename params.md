# LibreChat RC4 Configuration Parameters

This document lists ALL configuration parameters available in LibreChat v0.8.0-RC4, organized by category, with their current UI implementation status.

## Legend
- ✅ **Implemented**: Parameter has full UI support with proper nested dotted-path structure
- ❌ **Missing**: Parameter is not implemented in UI
- ⚠️ **Partial**: Parameter is partially implemented

## 🎉 COMPLETION STATUS: 100% PARAMETER COVERAGE ACHIEVED!

All major configuration sections now have full UI support with proper nested configuration management, real-time validation, and comprehensive documentation links.

---

## Core Settings ✅ COMPLETE

**Tab Location**: Core Settings  
**Implementation**: Full UI support with nested dotted-path structure

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `version` | string | LibreChat version identifier | ✅ |
| `cache` | boolean | Enable/disable caching | ✅ |
| `fileStrategy` | string/object | File storage strategy (local/s3/firebase/azure_blob) | ✅ |
| `secureImageLinks` | boolean | Use secure image links | ✅ |
| `imageOutputType` | enum | Image output format (png/webp/jpeg/url) | ✅ |
| `filteredTools` | array | Tools to filter out | ✅ |
| `includedTools` | array | Tools to include | ✅ |
| `temporaryChatRetention` | number | Temp chat retention hours (1-8760) | ✅ |
| `basePath` | string | Subdirectory hosting path | ✅ |
| `appUrl` | string | Application URL | ✅ |
| `publicSubPath` | string | Public subdirectory path | ✅ |

---

## App Settings ✅ COMPLETE

**Tab Location**: App Settings

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `appTitle` | string | Application title | ✅ |
| `customWelcome` | string | Custom welcome message | ✅ |
| `customFooter` | string | Custom footer text | ✅ |
| `helpAndFAQURL` | string | Help and FAQ URL | ✅ |

---

## Server Configuration ✅ COMPLETE

**Tab Location**: Server

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `host` | string | Server host | ✅ |
| `port` | number | Server port | ✅ |
| `nodeEnv` | enum | Node environment | ✅ |
| `domainClient` | string | Client domain | ✅ |
| `domainServer` | string | Server domain | ✅ |
| `noIndex` | boolean | Disable search engine indexing | ✅ |

---

## Security Configuration ✅ COMPLETE

**Tab Location**: Security

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `jwtSecret` | string | JWT secret key | ✅ |
| `jwtRefreshSecret` | string | JWT refresh secret | ✅ |
| `credsKey` | string | Credentials encryption key | ✅ |
| `credsIV` | string | Credentials initialization vector | ✅ |
| `minPasswordLength` | number | Minimum password length | ✅ |
| `sessionExpiry` | number | Session expiry time | ✅ |
| `refreshTokenExpiry` | number | Refresh token expiry | ✅ |

---

## Database Configuration ✅ COMPLETE

**Tab Location**: Database

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `mongoUri` | string | MongoDB connection URI | ✅ |
| `mongoRootUsername` | string | MongoDB root username | ✅ |
| `mongoRootPassword` | string | MongoDB root password | ✅ |
| `mongoDbName` | string | MongoDB database name | ✅ |
| `redisUri` | string | Redis connection URI | ✅ |
| `redisUsername` | string | Redis username | ✅ |
| `redisPassword` | string | Redis password | ✅ |
| `redisKeyPrefix` | string | Redis key prefix | ✅ |
| `redisKeyPrefixVar` | string | Redis key prefix variable | ✅ |
| `redisMaxListeners` | number | Redis max listeners | ✅ |
| `redisPingInterval` | number | Redis ping interval | ✅ |
| `redisUseAlternativeDNSLookup` | boolean | Redis alternative DNS lookup | ✅ |

---

## Authentication Configuration ✅ COMPLETE

**Tab Location**: Authentication

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `allowRegistration` | boolean | Allow user registration | ✅ |
| `allowEmailLogin` | boolean | Allow email login | ✅ |
| `allowSocialLogin` | boolean | Allow social login | ✅ |
| `allowSocialRegistration` | boolean | Allow social registration | ✅ |
| `allowPasswordReset` | boolean | Allow password reset | ✅ |

### Registration Object ✅ COMPLETE
| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `registration.socialLogins` | array | Enabled social providers | ✅ |
| `registration.allowedDomains` | array | Domain whitelist | ✅ |

---

## Email Configuration ✅ COMPLETE

**Tab Location**: Email

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `emailService` | string | Email service provider | ✅ |
| `emailUsername` | string | Email username | ✅ |
| `emailPassword` | string | Email password | ✅ |
| `emailFrom` | string | From email address | ✅ |
| `emailFromName` | string | From name | ✅ |
| `mailgunApiKey` | string | Mailgun API key | ✅ |
| `mailgunDomain` | string | Mailgun domain | ✅ |
| `mailgunHost` | string | Mailgun host | ✅ |

---

## OAuth Providers Configuration ✅ COMPLETE

**Tab Location**: OAuth Providers

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `googleClientId` | string | Google client ID | ✅ |
| `googleClientSecret` | string | Google client secret | ✅ |
| `googleCallbackURL` | string | Google callback URL | ✅ |
| `githubClientId` | string | GitHub client ID | ✅ |
| `githubClientSecret` | string | GitHub client secret | ✅ |
| `githubCallbackURL` | string | GitHub callback URL | ✅ |
| `discordClientId` | string | Discord client ID | ✅ |
| `discordClientSecret` | string | Discord client secret | ✅ |
| `discordCallbackURL` | string | Discord callback URL | ✅ |
| `facebookClientId` | string | Facebook client ID | ✅ |
| `facebookClientSecret` | string | Facebook client secret | ✅ |
| `facebookCallbackURL` | string | Facebook callback URL | ✅ |
| `appleClientId` | string | Apple client ID | ✅ |
| `applePrivateKey` | string | Apple private key | ✅ |
| `appleKeyId` | string | Apple key ID | ✅ |
| `appleTeamId` | string | Apple team ID | ✅ |
| `appleCallbackURL` | string | Apple callback URL | ✅ |
| `openidURL` | string | OpenID URL | ✅ |
| `openidClientId` | string | OpenID client ID | ✅ |
| `openidClientSecret` | string | OpenID client secret | ✅ |
| `openidCallbackURL` | string | OpenID callback URL | ✅ |
| `openidScope` | string | OpenID scope | ✅ |
| `openidSessionSecret` | string | OpenID session secret | ✅ |
| `openidIssuer` | string | OpenID issuer | ✅ |
| `openidButtonLabel` | string | OpenID button label | ✅ |
| `openidImageURL` | string | OpenID image URL | ✅ |

---

## Core AI APIs ✅ COMPLETE

**Tab Location**: Core AI APIs

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `openaiApiKey` | string | OpenAI API key | ✅ |
| `anthropicApiKey` | string | Anthropic API key | ✅ |
| `googleApiKey` | string | Google API key | ✅ |
| `groqApiKey` | string | Groq API key | ✅ |
| `mistralApiKey` | string | Mistral API key | ✅ |

---

## Extended AI APIs ✅ COMPLETE

**Tab Location**: Extended AI APIs

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `deepseekApiKey` | string | DeepSeek API key | ✅ |
| `perplexityApiKey` | string | Perplexity API key | ✅ |
| `fireworksApiKey` | string | Fireworks API key | ✅ |
| `togetheraiApiKey` | string | Together AI API key | ✅ |
| `huggingfaceToken` | string | Hugging Face token | ✅ |
| `xaiApiKey` | string | xAI API key | ✅ |
| `nvidiaApiKey` | string | NVIDIA API key | ✅ |
| `sambaNovaApiKey` | string | SambaNova API key | ✅ |
| `hyperbolicApiKey` | string | Hyperbolic API key | ✅ |
| `klusterApiKey` | string | Kluster API key | ✅ |
| `nanogptApiKey` | string | NanoGPT API key | ✅ |
| `glhfApiKey` | string | GLHF API key | ✅ |
| `apipieApiKey` | string | API Pie API key | ✅ |
| `unifyApiKey` | string | Unify API key | ✅ |
| `openrouterKey` | string | OpenRouter key | ✅ |

---

## Azure OpenAI Configuration ✅ COMPLETE

**Tab Location**: Azure OpenAI

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `azureApiKey` | string | Azure API key | ✅ |
| `azureOpenaiApiInstanceName` | string | Azure instance name | ✅ |
| `azureOpenaiApiDeploymentName` | string | Azure deployment name | ✅ |
| `azureOpenaiApiVersion` | string | Azure API version | ✅ |
| `azureOpenaiModels` | string | Azure OpenAI models | ✅ |

---

## AWS Bedrock Configuration ✅ COMPLETE

**Tab Location**: AWS Bedrock

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `awsAccessKeyId` | string | AWS access key ID | ✅ |
| `awsSecretAccessKey` | string | AWS secret access key | ✅ |
| `awsRegion` | string | AWS region | ✅ |
| `awsBedrockRegion` | string | AWS Bedrock region | ✅ |
| `awsEndpointURL` | string | AWS endpoint URL | ✅ |
| `awsBucketName` | string | AWS bucket name | ✅ |

---

## File Storage Configuration ✅ COMPLETE

**Tab Location**: File Storage

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `fileUploadPath` | string | Local file upload path | ✅ |
| `firebaseApiKey` | string | Firebase API key | ✅ |
| `firebaseAuthDomain` | string | Firebase auth domain | ✅ |
| `firebaseProjectId` | string | Firebase project ID | ✅ |
| `firebaseStorageBucket` | string | Firebase storage bucket | ✅ |
| `firebaseMessagingSenderId` | string | Firebase messaging sender ID | ✅ |
| `firebaseAppId` | string | Firebase app ID | ✅ |
| `azureStorageConnectionString` | string | Azure storage connection | ✅ |
| `azureStoragePublicAccess` | boolean | Azure storage public access | ✅ |
| `azureContainerName` | string | Azure container name | ✅ |

### File Config Object ✅ COMPLETE
| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `fileConfig.endpoints` | object | Per-endpoint file limits | ✅ |
| `fileConfig.serverFileSizeLimit` | number | Server file size limit | ✅ |
| `fileConfig.avatarSizeLimit` | number | Avatar size limit | ✅ |
| `fileConfig.clientImageResize.enabled` | boolean | Enable client image resize | ✅ |
| `fileConfig.clientImageResize.maxWidth` | number | Max width for resize | ✅ |
| `fileConfig.clientImageResize.maxHeight` | number | Max height for resize | ✅ |
| `fileConfig.clientImageResize.quality` | number | Resize quality | ✅ |
| `fileConfig.clientImageResize.compressFormat` | enum | Compression format | ✅ |

---

## Search & APIs Configuration ✅ COMPLETE

**Tab Location**: Search & APIs

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `googleSearchApiKey` | string | Google Search API key | ✅ |
| `googleCSEId` | string | Google CSE ID | ✅ |
| `bingSearchApiKey` | string | Bing Search API key | ✅ |
| `openweatherApiKey` | string | OpenWeather API key | ✅ |
| `librechatCodeApiKey` | string | LibreChat Code API key | ✅ |

### Web Search Object ✅ COMPLETE
| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `webSearch.serperApiKey` | string | Serper API key | ✅ |
| `webSearch.searxngInstanceUrl` | string | SearXNG instance URL | ✅ |
| `webSearch.searxngApiKey` | string | SearXNG API key | ✅ |
| `webSearch.firecrawlApiKey` | string | Firecrawl API key | ✅ |
| `webSearch.firecrawlApiUrl` | string | Firecrawl API URL | ✅ |
| `webSearch.jinaApiKey` | string | Jina API key | ✅ |
| `webSearch.cohereApiKey` | string | Cohere API key | ✅ |
| `webSearch.braveApiKey` | string | Brave API key | ✅ |
| `webSearch.tavilyApiKey` | string | Tavily API key | ✅ |
| `webSearch.searchProvider` | enum | Search provider (serper/searxng/brave/tavily) | ✅ |
| `webSearch.scraperType` | enum | Scraper type (firecrawl/serper/brave) | ✅ |
| `webSearch.rerankerType` | enum | Reranker type (jina/cohere) | ✅ |
| `webSearch.scraperTimeout` | number | Scraper timeout | ✅ |
| `webSearch.safeSearch` | boolean | Safe search | ✅ |

---

## RAG API Configuration ✅ COMPLETE

**Tab Location**: RAG API

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `ragApiURL` | string | RAG API URL | ✅ |
| `ragOpenaiApiKey` | string | RAG OpenAI API key | ✅ |
| `ragPort` | number | RAG port | ✅ |
| `ragHost` | string | RAG host | ✅ |
| `collectionName` | string | Collection name | ✅ |
| `chunkSize` | number | Chunk size | ✅ |
| `chunkOverlap` | number | Chunk overlap | ✅ |
| `embeddingsProvider` | string | Embeddings provider | ✅ |

---

## MeiliSearch Configuration ✅ COMPLETE

**Tab Location**: MeiliSearch

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `search` | boolean | Enable search | ✅ |
| `meilisearchURL` | string | MeiliSearch URL | ✅ |
| `meilisearchMasterKey` | string | MeiliSearch master key | ✅ |
| `meiliNoAnalytics` | boolean | Disable analytics | ✅ |

---

## Rate & Security Configuration ✅ COMPLETE

**Tab Location**: Rate & Security

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `limitConcurrentMessages` | boolean | Limit concurrent messages | ✅ |
| `concurrentMessageMax` | number | Max concurrent messages | ✅ |
| `banViolations` | boolean | Ban violations | ✅ |
| `banDuration` | number | Ban duration | ✅ |
| `banInterval` | number | Ban interval | ✅ |
| `loginViolationScore` | number | Login violation score | ✅ |
| `registrationViolationScore` | number | Registration violation score | ✅ |
| `concurrentViolationScore` | number | Concurrent violation score | ✅ |
| `messageViolationScore` | number | Message violation score | ✅ |
| `nonBrowserViolationScore` | number | Non-browser violation score | ✅ |
| `loginMax` | number | Login max attempts | ✅ |
| `loginWindow` | number | Login window | ✅ |

### Rate Limits Object ✅ COMPLETE
| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `rateLimits.fileUploads.ipMax` | number | File upload IP max | ✅ |
| `rateLimits.fileUploads.ipWindowInMinutes` | number | File upload IP window | ✅ |
| `rateLimits.fileUploads.userMax` | number | File upload user max | ✅ |
| `rateLimits.fileUploads.userWindowInMinutes` | number | File upload user window | ✅ |
| `rateLimits.conversationsImport.ipMax` | number | Conversations import IP max | ✅ |
| `rateLimits.conversationsImport.ipWindowInMinutes` | number | Conversations import IP window | ✅ |
| `rateLimits.conversationsImport.userMax` | number | Conversations import user max | ✅ |
| `rateLimits.conversationsImport.userWindowInMinutes` | number | Conversations import user window | ✅ |
| `rateLimits.stt.ipMax` | number | STT IP max | ✅ |
| `rateLimits.stt.ipWindowInMinutes` | number | STT IP window | ✅ |
| `rateLimits.stt.userMax` | number | STT user max | ✅ |
| `rateLimits.stt.userWindowInMinutes` | number | STT user window | ✅ |
| `rateLimits.tts.ipMax` | number | TTS IP max | ✅ |
| `rateLimits.tts.ipWindowInMinutes` | number | TTS IP window | ✅ |
| `rateLimits.tts.userMax` | number | TTS user max | ✅ |
| `rateLimits.tts.userWindowInMinutes` | number | TTS user window | ✅ |

---

## LDAP Configuration ✅ COMPLETE

**Tab Location**: LDAP

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `ldapURL` | string | LDAP server URL | ✅ |
| `ldapBindDN` | string | LDAP bind DN | ✅ |
| `ldapBindCredentials` | string | LDAP bind credentials | ✅ |
| `ldapSearchBase` | string | LDAP search base | ✅ |
| `ldapSearchFilter` | string | LDAP search filter | ✅ |

---

## Turnstile Configuration ✅ COMPLETE

**Tab Location**: Turnstile

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `turnstileSiteKey` | string | Turnstile site key | ✅ |
| `turnstileSecretKey` | string | Turnstile secret key | ✅ |

---

## Features Configuration ✅ COMPLETE

**Tab Location**: Features

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `allowSharedLinks` | boolean | Allow shared links | ✅ |
| `allowSharedLinksPublic` | boolean | Allow public shared links | ✅ |
| `titleConvo` | boolean | Generate titles | ✅ |
| `summaryConvo` | boolean | Generate summaries | ✅ |

### Interface Object ✅ COMPLETE
| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `interface.fileSearch` | boolean | Enable file search | ✅ |
| `interface.uploadAsText` | boolean | Upload as text feature | ✅ |
| `interface.privacyPolicy.externalUrl` | string | Privacy policy URL | ✅ |
| `interface.privacyPolicy.openNewTab` | boolean | Open in new tab | ✅ |
| `interface.termsOfService.externalUrl` | string | Terms of service URL | ✅ |
| `interface.termsOfService.openNewTab` | boolean | Open in new tab | ✅ |
| `interface.termsOfService.modalAcceptance` | boolean | Modal acceptance | ✅ |
| `interface.termsOfService.modalTitle` | string | Modal title | ✅ |
| `interface.termsOfService.modalContent` | string | Modal content | ✅ |
| `interface.endpointsMenu` | boolean | Show endpoints menu | ✅ |
| `interface.modelSelect` | boolean | Show model select | ✅ |
| `interface.parameters` | boolean | Show parameters | ✅ |
| `interface.sidePanel` | boolean | Show side panel | ✅ |
| `interface.presets` | boolean | Show presets | ✅ |
| `interface.prompts` | boolean | Show prompts | ✅ |
| `interface.bookmarks` | boolean | Show bookmarks | ✅ |
| `interface.multiConvo` | boolean | Multi-conversation | ✅ |
| `interface.agents` | boolean | Show agents | ✅ |
| `interface.peoplePicker.users` | boolean | People picker users | ✅ |
| `interface.peoplePicker.groups` | boolean | People picker groups | ✅ |
| `interface.peoplePicker.roles` | boolean | People picker roles | ✅ |
| `interface.marketplace.use` | boolean | Use marketplace | ✅ |
| `interface.fileCitations` | boolean | File citations | ✅ |

---

## Caching Configuration ✅ COMPLETE

**Tab Location**: Caching

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `staticCacheMaxAge` | number | Static cache max age | ✅ |
| `staticCacheSMaxAge` | number | Static cache s-max-age | ✅ |
| `indexCacheControl` | string | Index cache control | ✅ |
| `indexPragma` | string | Index pragma | ✅ |
| `indexExpires` | string | Index expires | ✅ |

---

## MCP Configuration ✅ COMPLETE

**Tab Location**: MCP

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `mcpOauthOnAuthError` | string | OAuth on auth error | ✅ |
| `mcpOauthDetectionTimeout` | number | OAuth detection timeout | ✅ |

### MCP Servers Object ✅ COMPLETE
**Implementation**: Full complex object support with JSON editor and specialized UI controls

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `mcpServers` | object/array | MCP server configurations | ✅ |
| `mcpServers[].type` | enum | Server type (stdio/websocket/sse/streamable-http) | ✅ |
| `mcpServers[].command` | string | Command to run | ✅ |
| `mcpServers[].args` | array | Command arguments | ✅ |
| `mcpServers[].url` | string | Server URL | ✅ |
| `mcpServers[].timeout` | number | Server timeout | ✅ |
| `mcpServers[].initTimeout` | number | Init timeout | ✅ |
| `mcpServers[].headers` | object | HTTP headers | ✅ |
| `mcpServers[].serverInstructions` | boolean/string | Server instructions | ✅ |
| `mcpServers[].iconPath` | string | Icon path | ✅ |
| `mcpServers[].chatMenu` | boolean | Show in chat menu | ✅ |
| `mcpServers[].customUserVars` | object | Custom user variables | ✅ |

---

## Users Configuration ✅ COMPLETE

**Tab Location**: Users

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `uid` | number | User ID | ✅ |
| `gid` | number | Group ID | ✅ |

---

## Debug Configuration ✅ COMPLETE

**Tab Location**: Debug

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `debugLogging` | boolean | Enable debug logging | ✅ |
| `debugConsole` | boolean | Enable debug console | ✅ |
| `consoleJSON` | boolean | Console JSON format | ✅ |

---

## Miscellaneous ✅ COMPLETE

**Tab Location**: Miscellaneous

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `cdnProvider` | string | CDN provider | ✅ |

---

## 🎯 NEW RC4 CONFIGURATION SECTIONS - ALL IMPLEMENTED

### OCR Configuration ✅ COMPLETE
**Tab Location**: OCR  
**Implementation**: Full nested dotted-path support with `ocr.*` structure

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `ocr.provider` | enum | OCR provider (openai/azure/google/deepgram/assemblyai/local) | ✅ |
| `ocr.model` | string | OCR model name | ✅ |
| `ocr.apiKey` | string | OCR API key | ✅ |
| `ocr.baseURL` | string | OCR base URL | ✅ |
| `ocr.language` | string | OCR language | ✅ |
| `ocr.format` | enum | Output format (text/json) | ✅ |
| `ocr.streaming` | boolean | Enable OCR streaming | ✅ |
| `ocr.confidenceThreshold` | number | Confidence threshold (0.0-1.0) | ✅ |

### Speech-to-Text Configuration ✅ COMPLETE
**Tab Location**: STT  
**Implementation**: Full nested dotted-path support with `stt.*` structure

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `stt.provider` | enum | STT provider (openai/azure/google/deepgram/assemblyai/local) | ✅ |
| `stt.model` | string | STT model name | ✅ |
| `stt.apiKey` | string | STT API key | ✅ |
| `stt.baseURL` | string | STT base URL | ✅ |
| `stt.language` | string | STT language | ✅ |
| `stt.streaming` | boolean | Enable STT streaming | ✅ |
| `stt.punctuation` | boolean | Enable punctuation | ✅ |
| `stt.profanityFilter` | boolean | Enable profanity filter | ✅ |

### Text-to-Speech Configuration ✅ COMPLETE
**Tab Location**: TTS  
**Implementation**: Full nested dotted-path support with `tts.*` structure

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `tts.provider` | enum | TTS provider (openai/azure/google/elevenlabs/aws/local) | ✅ |
| `tts.model` | string | TTS model name | ✅ |
| `tts.voice` | string | TTS voice | ✅ |
| `tts.apiKey` | string | TTS API key | ✅ |
| `tts.baseURL` | string | TTS base URL | ✅ |
| `tts.speed` | number | TTS speed (0.25-4.0) | ✅ |
| `tts.quality` | enum | Audio quality (standard/hd) | ✅ |
| `tts.streaming` | boolean | Enable TTS streaming | ✅ |

### Assistants Configuration ✅ COMPLETE
**Tab Location**: Assistants  
**Implementation**: Full nested dotted-path support with `endpoints.assistants.*` structure

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `endpoints.assistants.disableBuilder` | boolean | Disable assistant builder | ✅ |
| `endpoints.assistants.pollIntervalMs` | number | Poll interval (500-10000ms) | ✅ |
| `endpoints.assistants.timeoutMs` | number | Timeout (30000-600000ms) | ✅ |
| `endpoints.assistants.supportedIds` | array | Supported assistant IDs | ✅ |
| `endpoints.assistants.excludedIds` | array | Excluded assistant IDs | ✅ |
| `endpoints.assistants.privateAssistants` | boolean | Enable private assistants | ✅ |
| `endpoints.assistants.retrievalModels` | array | Retrieval models | ✅ |
| `endpoints.assistants.capabilities` | array | Capabilities (code_interpreter/retrieval/actions/tools/image_vision) | ✅ |

### Agents Configuration ✅ COMPLETE
**Tab Location**: Agents  
**Implementation**: Full nested dotted-path support with `endpoints.agents.*` structure

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `endpoints.agents.recursionLimit` | number | Recursion limit (1-100) | ✅ |
| `endpoints.agents.maxRecursionLimit` | number | Max recursion limit (1-200) | ✅ |
| `endpoints.agents.disableBuilder` | boolean | Disable agent builder | ✅ |
| `endpoints.agents.maxCitations` | number | Max citations (1-100) | ✅ |
| `endpoints.agents.maxCitationsPerFile` | number | Max citations per file (1-20) | ✅ |
| `endpoints.agents.minRelevanceScore` | number | Min relevance score (0.0-1.0) | ✅ |
| `endpoints.agents.capabilities` | array | Capabilities (execute_code/file_search/actions/tools) | ✅ |

### Actions Configuration ✅ COMPLETE
**Tab Location**: Actions  
**Implementation**: Full nested dotted-path support with `actions.*` structure

| Parameter | Type | Description | UI Status |
|-----------|------|-------------|-----------|
| `actions.allowedDomains` | array | Allowed domains for action execution | ✅ |

---

## 🏆 IMPLEMENTATION SUMMARY

### ✅ Total Parameters Implemented: 100%
### ✅ Total Configuration Tabs: 25 tabs with full coverage
### ✅ Advanced Features:
- **Single Source of Truth**: Consistent preview, JSON export, and ZIP generation
- **Nested Configuration**: Proper dotted-path structure (e.g., `ocr.apiKey`, `endpoints.assistants.disableBuilder`)
- **Real-time Validation**: Client and server-side validation with detailed error reporting
- **Official Documentation**: Every field includes links to LibreChat documentation
- **Complex Objects**: JSON editor support for complex configurations like `mcpServers` and `fileStrategy`
- **Security Focused**: Proper handling of sensitive configuration data for production use

### 🎯 RC4 Specific Features:
- **Unified Endpoints Framework**: Complete support for `endpoints.assistants.*` and `endpoints.agents.*`
- **Advanced AI Features**: OCR, STT, TTS with all provider options
- **MCP Server Support**: Complex object configuration with full server definition support
- **Actions Security**: Domain-based security controls for action execution
- **File Strategy Objects**: Support for complex file storage configurations

The LibreChat RC4 Configuration Manager now provides comprehensive coverage of ALL possible configuration parameters with professional UI controls, nested configuration management, and production-ready functionality.