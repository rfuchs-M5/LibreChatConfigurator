# LibreChat RC4 Configuration Parameters

This document lists ALL configuration parameters available in LibreChat v0.8.0-RC4, organized by category, with their current UI implementation status.

## Legend
- ✅ **Implemented**: Parameter has full UI support
- ❌ **Missing**: Parameter is not implemented in UI
- ⚠️ **Partial**: Parameter is partially implemented

---

## Core Settings

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `version` | string | LibreChat version identifier | ❌ | Core Settings |
| `cache` | boolean | Enable/disable caching | ❌ | Core Settings |
| `fileStrategy` | string/object | File storage strategy | ❌ | Core Settings |
| `secureImageLinks` | boolean | Use secure image links | ❌ | Core Settings |
| `imageOutputType` | enum | Image output format (png/webp/jpeg/url) | ❌ | Core Settings |
| `filteredTools` | array | Tools to filter out | ❌ | Core Settings |
| `includedTools` | array | Tools to include | ❌ | Core Settings |
| `temporaryChatRetention` | number | Temp chat retention hours | ❌ | Core Settings |
| `basePath` | string | Subdirectory hosting path | ❌ | Core Settings |
| `appUrl` | string | Application URL | ❌ | Core Settings |
| `publicSubPath` | string | Public subdirectory path | ❌ | Core Settings |

---

## App Settings

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `appTitle` | string | Application title | ✅ | App Settings |
| `customWelcome` | string | Custom welcome message | ✅ | App Settings |
| `customFooter` | string | Custom footer text | ✅ | App Settings |
| `helpAndFAQURL` | string | Help and FAQ URL | ✅ | App Settings |

---

## Server Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `host` | string | Server host | ✅ | Server |
| `port` | number | Server port | ✅ | Server |
| `nodeEnv` | enum | Node environment | ✅ | Server |
| `domainClient` | string | Client domain | ✅ | Server |
| `domainServer` | string | Server domain | ✅ | Server |
| `noIndex` | boolean | Disable search engine indexing | ✅ | Server |

---

## Security Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `jwtSecret` | string | JWT secret key | ✅ | Security |
| `jwtRefreshSecret` | string | JWT refresh secret | ✅ | Security |
| `credsKey` | string | Credentials encryption key | ✅ | Security |
| `credsIV` | string | Credentials initialization vector | ✅ | Security |
| `minPasswordLength` | number | Minimum password length | ✅ | Security |
| `sessionExpiry` | number | Session expiry time | ✅ | Security |
| `refreshTokenExpiry` | number | Refresh token expiry | ✅ | Security |

---

## Database Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `mongoUri` | string | MongoDB connection URI | ✅ | Database |
| `mongoRootUsername` | string | MongoDB root username | ✅ | Database |
| `mongoRootPassword` | string | MongoDB root password | ✅ | Database |
| `mongoDbName` | string | MongoDB database name | ✅ | Database |
| `redisUri` | string | Redis connection URI | ✅ | Database |
| `redisUsername` | string | Redis username | ✅ | Database |
| `redisPassword` | string | Redis password | ✅ | Database |
| `redisKeyPrefix` | string | Redis key prefix | ✅ | Database |
| `redisKeyPrefixVar` | string | Redis key prefix variable | ✅ | Database |
| `redisMaxListeners` | number | Redis max listeners | ✅ | Database |
| `redisPingInterval` | number | Redis ping interval | ✅ | Database |
| `redisUseAlternativeDNSLookup` | boolean | Redis alternative DNS lookup | ✅ | Database |

---

## Authentication Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `allowRegistration` | boolean | Allow user registration | ✅ | Authentication |
| `allowEmailLogin` | boolean | Allow email login | ✅ | Authentication |
| `allowSocialLogin` | boolean | Allow social login | ✅ | Authentication |
| `allowSocialRegistration` | boolean | Allow social registration | ✅ | Authentication |
| `allowPasswordReset` | boolean | Allow password reset | ✅ | Authentication |

### Registration Object (MISSING)
| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `registration.socialLogins` | array | Enabled social providers | ❌ | Authentication |
| `registration.allowedDomains` | array | Domain whitelist | ❌ | Authentication |

---

## Email Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `emailService` | string | Email service provider | ✅ | Email |
| `emailUsername` | string | Email username | ✅ | Email |
| `emailPassword` | string | Email password | ✅ | Email |
| `emailFrom` | string | From email address | ✅ | Email |
| `emailFromName` | string | From name | ✅ | Email |
| `mailgunApiKey` | string | Mailgun API key | ✅ | Email |
| `mailgunDomain` | string | Mailgun domain | ✅ | Email |
| `mailgunHost` | string | Mailgun host | ✅ | Email |

---

## OAuth Providers Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `googleClientId` | string | Google client ID | ✅ | OAuth Providers |
| `googleClientSecret` | string | Google client secret | ✅ | OAuth Providers |
| `googleCallbackURL` | string | Google callback URL | ✅ | OAuth Providers |
| `githubClientId` | string | GitHub client ID | ✅ | OAuth Providers |
| `githubClientSecret` | string | GitHub client secret | ✅ | OAuth Providers |
| `githubCallbackURL` | string | GitHub callback URL | ✅ | OAuth Providers |
| `discordClientId` | string | Discord client ID | ✅ | OAuth Providers |
| `discordClientSecret` | string | Discord client secret | ✅ | OAuth Providers |
| `discordCallbackURL` | string | Discord callback URL | ✅ | OAuth Providers |
| `facebookClientId` | string | Facebook client ID | ✅ | OAuth Providers |
| `facebookClientSecret` | string | Facebook client secret | ✅ | OAuth Providers |
| `facebookCallbackURL` | string | Facebook callback URL | ✅ | OAuth Providers |
| `appleClientId` | string | Apple client ID | ✅ | OAuth Providers |
| `applePrivateKey` | string | Apple private key | ✅ | OAuth Providers |
| `appleKeyId` | string | Apple key ID | ✅ | OAuth Providers |
| `appleTeamId` | string | Apple team ID | ✅ | OAuth Providers |
| `appleCallbackURL` | string | Apple callback URL | ✅ | OAuth Providers |
| `openidURL` | string | OpenID URL | ✅ | OAuth Providers |
| `openidClientId` | string | OpenID client ID | ✅ | OAuth Providers |
| `openidClientSecret` | string | OpenID client secret | ✅ | OAuth Providers |
| `openidCallbackURL` | string | OpenID callback URL | ✅ | OAuth Providers |
| `openidScope` | string | OpenID scope | ✅ | OAuth Providers |
| `openidSessionSecret` | string | OpenID session secret | ✅ | OAuth Providers |
| `openidIssuer` | string | OpenID issuer | ✅ | OAuth Providers |
| `openidButtonLabel` | string | OpenID button label | ✅ | OAuth Providers |
| `openidImageURL` | string | OpenID image URL | ✅ | OAuth Providers |

---

## Core AI APIs

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `openaiApiKey` | string | OpenAI API key | ✅ | Core AI APIs |
| `anthropicApiKey` | string | Anthropic API key | ✅ | Core AI APIs |
| `googleApiKey` | string | Google API key | ✅ | Core AI APIs |
| `groqApiKey` | string | Groq API key | ✅ | Core AI APIs |
| `mistralApiKey` | string | Mistral API key | ✅ | Core AI APIs |

---

## Extended AI APIs

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `deepseekApiKey` | string | DeepSeek API key | ✅ | Extended AI APIs |
| `perplexityApiKey` | string | Perplexity API key | ✅ | Extended AI APIs |
| `fireworksApiKey` | string | Fireworks API key | ✅ | Extended AI APIs |
| `togetheraiApiKey` | string | Together AI API key | ✅ | Extended AI APIs |
| `huggingfaceToken` | string | Hugging Face token | ✅ | Extended AI APIs |
| `xaiApiKey` | string | xAI API key | ✅ | Extended AI APIs |
| `nvidiaApiKey` | string | NVIDIA API key | ✅ | Extended AI APIs |
| `sambaNovaApiKey` | string | SambaNova API key | ✅ | Extended AI APIs |
| `hyperbolicApiKey` | string | Hyperbolic API key | ✅ | Extended AI APIs |
| `klusterApiKey` | string | Kluster API key | ✅ | Extended AI APIs |
| `nanogptApiKey` | string | NanoGPT API key | ✅ | Extended AI APIs |
| `glhfApiKey` | string | GLHF API key | ✅ | Extended AI APIs |
| `apipieApiKey` | string | API Pie API key | ✅ | Extended AI APIs |
| `unifyApiKey` | string | Unify API key | ✅ | Extended AI APIs |
| `openrouterKey` | string | OpenRouter key | ✅ | Extended AI APIs |

---

## Azure OpenAI Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `azureApiKey` | string | Azure API key | ✅ | Azure OpenAI |
| `azureOpenaiApiInstanceName` | string | Azure instance name | ✅ | Azure OpenAI |
| `azureOpenaiApiDeploymentName` | string | Azure deployment name | ✅ | Azure OpenAI |
| `azureOpenaiApiVersion` | string | Azure API version | ✅ | Azure OpenAI |
| `azureOpenaiModels` | string | Azure OpenAI models | ✅ | Azure OpenAI |

---

## AWS Bedrock Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `awsAccessKeyId` | string | AWS access key ID | ✅ | AWS Bedrock |
| `awsSecretAccessKey` | string | AWS secret access key | ✅ | AWS Bedrock |
| `awsRegion` | string | AWS region | ✅ | AWS Bedrock |
| `awsBedrockRegion` | string | AWS Bedrock region | ✅ | AWS Bedrock |
| `awsEndpointURL` | string | AWS endpoint URL | ✅ | AWS Bedrock |
| `awsBucketName` | string | AWS bucket name | ✅ | AWS Bedrock |

---

## File Storage Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `fileUploadPath` | string | Local file upload path | ✅ | File Storage |
| `firebaseApiKey` | string | Firebase API key | ✅ | File Storage |
| `firebaseAuthDomain` | string | Firebase auth domain | ✅ | File Storage |
| `firebaseProjectId` | string | Firebase project ID | ✅ | File Storage |
| `firebaseStorageBucket` | string | Firebase storage bucket | ✅ | File Storage |
| `firebaseMessagingSenderId` | string | Firebase messaging sender ID | ✅ | File Storage |
| `firebaseAppId` | string | Firebase app ID | ✅ | File Storage |
| `azureStorageConnectionString` | string | Azure storage connection | ✅ | File Storage |
| `azureStoragePublicAccess` | boolean | Azure storage public access | ✅ | File Storage |
| `azureContainerName` | string | Azure container name | ✅ | File Storage |

### File Config Object (MISSING)
| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `fileConfig.endpoints` | object | Per-endpoint file limits | ❌ | File Storage |
| `fileConfig.serverFileSizeLimit` | number | Server file size limit | ❌ | File Storage |
| `fileConfig.avatarSizeLimit` | number | Avatar size limit | ❌ | File Storage |
| `fileConfig.clientImageResize.enabled` | boolean | Enable client image resize | ❌ | File Storage |
| `fileConfig.clientImageResize.maxWidth` | number | Max width for resize | ❌ | File Storage |
| `fileConfig.clientImageResize.maxHeight` | number | Max height for resize | ❌ | File Storage |
| `fileConfig.clientImageResize.quality` | number | Resize quality | ❌ | File Storage |
| `fileConfig.clientImageResize.compressFormat` | enum | Compression format | ❌ | File Storage |

---

## Search & APIs Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `googleSearchApiKey` | string | Google Search API key | ✅ | Search & APIs |
| `googleCSEId` | string | Google CSE ID | ✅ | Search & APIs |
| `bingSearchApiKey` | string | Bing Search API key | ✅ | Search & APIs |
| `openweatherApiKey` | string | OpenWeather API key | ✅ | Search & APIs |
| `librechatCodeApiKey` | string | LibreChat Code API key | ✅ | Search & APIs |

### Web Search Object (MOSTLY MISSING)
| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `webSearch.serperApiKey` | string | Serper API key | ❌ | Search & APIs |
| `webSearch.searxngInstanceUrl` | string | SearXNG instance URL | ❌ | Search & APIs |
| `webSearch.searxngApiKey` | string | SearXNG API key | ❌ | Search & APIs |
| `webSearch.firecrawlApiKey` | string | Firecrawl API key | ❌ | Search & APIs |
| `webSearch.firecrawlApiUrl` | string | Firecrawl API URL | ❌ | Search & APIs |
| `webSearch.jinaApiKey` | string | Jina API key | ❌ | Search & APIs |
| `webSearch.cohereApiKey` | string | Cohere API key | ❌ | Search & APIs |
| `webSearch.braveApiKey` | string | Brave API key | ❌ | Search & APIs |
| `webSearch.tavilyApiKey` | string | Tavily API key | ❌ | Search & APIs |
| `webSearch.searchProvider` | enum | Search provider | ❌ | Search & APIs |
| `webSearch.scraperType` | enum | Scraper type | ❌ | Search & APIs |
| `webSearch.rerankerType` | enum | Reranker type | ❌ | Search & APIs |
| `webSearch.scraperTimeout` | number | Scraper timeout | ❌ | Search & APIs |
| `webSearch.safeSearch` | boolean | Safe search | ❌ | Search & APIs |

---

## RAG API Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `ragApiURL` | string | RAG API URL | ✅ | RAG API |
| `ragOpenaiApiKey` | string | RAG OpenAI API key | ✅ | RAG API |
| `ragPort` | number | RAG port | ✅ | RAG API |
| `ragHost` | string | RAG host | ✅ | RAG API |
| `collectionName` | string | Collection name | ✅ | RAG API |
| `chunkSize` | number | Chunk size | ✅ | RAG API |
| `chunkOverlap` | number | Chunk overlap | ✅ | RAG API |
| `embeddingsProvider` | string | Embeddings provider | ✅ | RAG API |

---

## MeiliSearch Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `search` | boolean | Enable search | ✅ | MeiliSearch |
| `meilisearchURL` | string | MeiliSearch URL | ✅ | MeiliSearch |
| `meilisearchMasterKey` | string | MeiliSearch master key | ✅ | MeiliSearch |
| `meiliNoAnalytics` | boolean | Disable analytics | ✅ | MeiliSearch |

---

## Rate & Security Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `limitConcurrentMessages` | boolean | Limit concurrent messages | ✅ | Rate & Security |
| `concurrentMessageMax` | number | Max concurrent messages | ✅ | Rate & Security |
| `banViolations` | boolean | Ban violations | ✅ | Rate & Security |
| `banDuration` | number | Ban duration | ✅ | Rate & Security |
| `banInterval` | number | Ban interval | ✅ | Rate & Security |
| `loginViolationScore` | number | Login violation score | ✅ | Rate & Security |
| `registrationViolationScore` | number | Registration violation score | ✅ | Rate & Security |
| `concurrentViolationScore` | number | Concurrent violation score | ✅ | Rate & Security |
| `messageViolationScore` | number | Message violation score | ✅ | Rate & Security |
| `nonBrowserViolationScore` | number | Non-browser violation score | ✅ | Rate & Security |
| `loginMax` | number | Login max attempts | ✅ | Rate & Security |
| `loginWindow` | number | Login window | ✅ | Rate & Security |

### Rate Limits Object (COMPLETELY MISSING)
| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `rateLimits.fileUploads.ipMax` | number | File upload IP max | ❌ | Rate & Security |
| `rateLimits.fileUploads.ipWindowInMinutes` | number | File upload IP window | ❌ | Rate & Security |
| `rateLimits.fileUploads.userMax` | number | File upload user max | ❌ | Rate & Security |
| `rateLimits.fileUploads.userWindowInMinutes` | number | File upload user window | ❌ | Rate & Security |
| `rateLimits.conversationsImport.ipMax` | number | Conversations import IP max | ❌ | Rate & Security |
| `rateLimits.conversationsImport.ipWindowInMinutes` | number | Conversations import IP window | ❌ | Rate & Security |
| `rateLimits.conversationsImport.userMax` | number | Conversations import user max | ❌ | Rate & Security |
| `rateLimits.conversationsImport.userWindowInMinutes` | number | Conversations import user window | ❌ | Rate & Security |
| `rateLimits.stt.ipMax` | number | STT IP max | ❌ | Rate & Security |
| `rateLimits.stt.ipWindowInMinutes` | number | STT IP window | ❌ | Rate & Security |
| `rateLimits.stt.userMax` | number | STT user max | ❌ | Rate & Security |
| `rateLimits.stt.userWindowInMinutes` | number | STT user window | ❌ | Rate & Security |
| `rateLimits.tts.ipMax` | number | TTS IP max | ❌ | Rate & Security |
| `rateLimits.tts.ipWindowInMinutes` | number | TTS IP window | ❌ | Rate & Security |
| `rateLimits.tts.userMax` | number | TTS user max | ❌ | Rate & Security |
| `rateLimits.tts.userWindowInMinutes` | number | TTS user window | ❌ | Rate & Security |

---

## LDAP Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `ldapURL` | string | LDAP server URL | ✅ | LDAP |
| `ldapBindDN` | string | LDAP bind DN | ✅ | LDAP |
| `ldapBindCredentials` | string | LDAP bind credentials | ✅ | LDAP |
| `ldapSearchBase` | string | LDAP search base | ✅ | LDAP |
| `ldapSearchFilter` | string | LDAP search filter | ✅ | LDAP |

---

## Turnstile Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `turnstileSiteKey` | string | Turnstile site key | ✅ | Turnstile |
| `turnstileSecretKey` | string | Turnstile secret key | ✅ | Turnstile |

---

## Features Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `allowSharedLinks` | boolean | Allow shared links | ✅ | Features |
| `allowSharedLinksPublic` | boolean | Allow public shared links | ✅ | Features |
| `titleConvo` | boolean | Generate titles | ✅ | Features |
| `summaryConvo` | boolean | Generate summaries | ✅ | Features |

### Interface Object (MASSIVE MISSING SECTION)
| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `interface.fileSearch` | boolean | Enable file search | ❌ | Features |
| `interface.uploadAsText` | boolean | Upload as text feature | ❌ | Features |
| `interface.privacyPolicy.externalUrl` | string | Privacy policy URL | ❌ | Features |
| `interface.privacyPolicy.openNewTab` | boolean | Open in new tab | ❌ | Features |
| `interface.termsOfService.externalUrl` | string | Terms of service URL | ❌ | Features |
| `interface.termsOfService.openNewTab` | boolean | Open in new tab | ❌ | Features |
| `interface.termsOfService.modalAcceptance` | boolean | Modal acceptance | ❌ | Features |
| `interface.termsOfService.modalTitle` | string | Modal title | ❌ | Features |
| `interface.termsOfService.modalContent` | string | Modal content | ❌ | Features |
| `interface.endpointsMenu` | boolean | Show endpoints menu | ❌ | Features |
| `interface.modelSelect` | boolean | Show model select | ❌ | Features |
| `interface.parameters` | boolean | Show parameters | ❌ | Features |
| `interface.sidePanel` | boolean | Show side panel | ❌ | Features |
| `interface.presets` | boolean | Show presets | ❌ | Features |
| `interface.prompts` | boolean | Show prompts | ❌ | Features |
| `interface.bookmarks` | boolean | Show bookmarks | ❌ | Features |
| `interface.multiConvo` | boolean | Multi-conversation | ❌ | Features |
| `interface.agents` | boolean | Show agents | ❌ | Features |
| `interface.peoplePicker.users` | boolean | People picker users | ❌ | Features |
| `interface.peoplePicker.groups` | boolean | People picker groups | ❌ | Features |
| `interface.peoplePicker.roles` | boolean | People picker roles | ❌ | Features |
| `interface.marketplace.use` | boolean | Use marketplace | ❌ | Features |
| `interface.fileCitations` | boolean | File citations | ❌ | Features |

---

## Caching Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `staticCacheMaxAge` | number | Static cache max age | ✅ | Caching |
| `staticCacheSMaxAge` | number | Static cache s-max-age | ✅ | Caching |
| `indexCacheControl` | string | Index cache control | ✅ | Caching |
| `indexPragma` | string | Index pragma | ✅ | Caching |
| `indexExpires` | string | Index expires | ✅ | Caching |

---

## MCP Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `mcpOauthOnAuthError` | string | OAuth on auth error | ✅ | MCP |
| `mcpOauthDetectionTimeout` | number | OAuth detection timeout | ✅ | MCP |

### MCP Servers Object (COMPLETELY MISSING)
| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `mcpServers` | object/array | MCP server configurations | ❌ | MCP |
| `mcpServers[].type` | enum | Server type (stdio/websocket/sse/streamable-http) | ❌ | MCP |
| `mcpServers[].command` | string | Command to run | ❌ | MCP |
| `mcpServers[].args` | array | Command arguments | ❌ | MCP |
| `mcpServers[].url` | string | Server URL | ❌ | MCP |
| `mcpServers[].timeout` | number | Server timeout | ❌ | MCP |
| `mcpServers[].initTimeout` | number | Init timeout | ❌ | MCP |
| `mcpServers[].headers` | object | HTTP headers | ❌ | MCP |
| `mcpServers[].serverInstructions` | boolean/string | Server instructions | ❌ | MCP |
| `mcpServers[].iconPath` | string | Icon path | ❌ | MCP |
| `mcpServers[].chatMenu` | boolean | Show in chat menu | ❌ | MCP |
| `mcpServers[].customUserVars` | object | Custom user variables | ❌ | MCP |

---

## Users Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `uid` | number | User ID | ✅ | Users |
| `gid` | number | Group ID | ✅ | Users |

---

## Debug Configuration

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `debugLogging` | boolean | Enable debug logging | ✅ | Debug |
| `debugConsole` | boolean | Enable debug console | ✅ | Debug |
| `consoleJSON` | boolean | Console JSON format | ✅ | Debug |

---

## Miscellaneous

| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `cdnProvider` | string | CDN provider | ✅ | Miscellaneous |

---

## COMPLETELY MISSING CONFIGURATION SECTIONS

### OCR Configuration (NEW TAB NEEDED)
| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `ocr.apiKey` | string | OCR API key | ❌ | OCR |
| `ocr.baseURL` | string | OCR base URL | ❌ | OCR |
| `ocr.strategy` | enum | OCR strategy (mistral_ocr/custom_ocr) | ❌ | OCR |
| `ocr.mistralModel` | string | Mistral model for OCR | ❌ | OCR |

### Speech-to-Text Configuration (NEW TAB NEEDED)
| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `stt.provider` | enum | STT provider | ❌ | Speech-to-Text |
| `stt.model` | string | STT model | ❌ | Speech-to-Text |
| `stt.apiKey` | string | STT API key | ❌ | Speech-to-Text |
| `stt.baseURL` | string | STT base URL | ❌ | Speech-to-Text |
| `stt.language` | string | STT language | ❌ | Speech-to-Text |
| `stt.streaming` | boolean | Enable STT streaming | ❌ | Speech-to-Text |
| `stt.punctuation` | boolean | Enable punctuation | ❌ | Speech-to-Text |
| `stt.profanityFilter` | boolean | Enable profanity filter | ❌ | Speech-to-Text |

### Text-to-Speech Configuration (NEW TAB NEEDED)
| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `tts.provider` | enum | TTS provider | ❌ | Text-to-Speech |
| `tts.model` | string | TTS model | ❌ | Text-to-Speech |
| `tts.voice` | string | TTS voice | ❌ | Text-to-Speech |
| `tts.apiKey` | string | TTS API key | ❌ | Text-to-Speech |
| `tts.baseURL` | string | TTS base URL | ❌ | Text-to-Speech |
| `tts.speed` | number | Speech speed | ❌ | Text-to-Speech |
| `tts.quality` | enum | Audio quality | ❌ | Text-to-Speech |
| `tts.streaming` | boolean | Enable streaming | ❌ | Text-to-Speech |

### Assistants Configuration (NEW TAB NEEDED)
| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `endpoints.assistants.disableBuilder` | boolean | Disable assistant builder | ❌ | Assistants |
| `endpoints.assistants.pollIntervalMs` | number | Polling interval (ms) | ❌ | Assistants |
| `endpoints.assistants.timeoutMs` | number | Timeout (ms) | ❌ | Assistants |
| `endpoints.assistants.supportedIds` | array | Supported assistant IDs | ❌ | Assistants |
| `endpoints.assistants.excludedIds` | array | Excluded assistant IDs | ❌ | Assistants |
| `endpoints.assistants.privateAssistants` | boolean | Private assistants | ❌ | Assistants |
| `endpoints.assistants.retrievalModels` | array | Retrieval models | ❌ | Assistants |
| `endpoints.assistants.capabilities` | array | Assistant capabilities | ❌ | Assistants |

### Agents Configuration (NEW TAB NEEDED)
| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `endpoints.agents.recursionLimit` | number | Recursion limit | ❌ | Agents |
| `endpoints.agents.maxRecursionLimit` | number | Max recursion limit | ❌ | Agents |
| `endpoints.agents.disableBuilder` | boolean | Disable agent builder | ❌ | Agents |
| `endpoints.agents.maxCitations` | number | Max citations | ❌ | Agents |
| `endpoints.agents.maxCitationsPerFile` | number | Max citations per file | ❌ | Agents |
| `endpoints.agents.minRelevanceScore` | number | Min relevance score | ❌ | Agents |
| `endpoints.agents.capabilities` | array | Agent capabilities | ❌ | Agents |

### Actions Configuration (NEW TAB NEEDED)
| Parameter | Type | Description | UI Status | Tab Location |
|-----------|------|-------------|-----------|--------------|
| `actions.allowedDomains` | array | Allowed domains for actions | ❌ | Actions |

### Endpoints Configuration (COMPLEX NESTED OBJECTS - NOT IMPLEMENTED)
This includes provider-specific configurations for:
- OpenAI endpoints
- Azure OpenAI endpoints  
- Anthropic endpoints
- Google endpoints
- AWS Bedrock endpoints
- Custom endpoints
- And many more provider-specific settings

---

## Summary

### Implementation Status
- **Total Schema Parameters**: ~300+ parameters
- **Currently Implemented in UI**: ~150 parameters (50%)
- **Missing from UI**: ~150 parameters (50%)

### Major Missing Areas:
1. **Complex Objects**: fileConfig, rateLimits, interface, registration, webSearch, mcpServers, endpoints
2. **New Configuration Areas**: OCR, STT, TTS, Assistants, Agents, Actions
3. **Core Settings**: version, cache, fileStrategy, secureImageLinks, etc.

### Critical Action Items:
1. ❌ Add missing fields to existing tabs (Authentication, File Storage, Search & APIs, Rate & Security, Features, MCP)
2. ❌ Create completely missing tabs (Core Settings, OCR, STT, TTS, Assistants, Agents, Actions)
3. ❌ Implement complex object handling (nested configurations)
4. ❌ Add proper field definitions with types, descriptions, and validation