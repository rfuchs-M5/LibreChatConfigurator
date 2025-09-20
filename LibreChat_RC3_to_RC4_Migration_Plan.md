# LibreChat v0.8.0-RC3 to RC4 Migration Plan

## Project Overview

This document outlines the migration plan for upgrading the LibreChat Configuration Manager application from LibreChat v0.8.0-RC3 to v0.8.0-RC4. The current project is a React/Express configuration management tool that generates LibreChat configurations, deployment packages, and manages configuration profiles.

## Current Project Features

### 1. Configuration Management System
- **Status**: ✅ Working
- **Description**: Comprehensive configuration schema covering all LibreChat RC3 features
- **Files**: `shared/schema.ts`, `server/storage.ts`
- **Current Version**: `configVer: "0.8.0-rc3"`

### 2. Configuration Categories Supported
- ✅ Global Core Settings (cache, fileStrategy, secureImageLinks)
- ✅ UI/Visibility Settings (showModelSelect, showParameters, etc.)
- ✅ Model Specifications & Defaults
- ✅ Agent Configuration (recursion limits, providers, capabilities)
- ✅ File Configuration (size limits, MIME types, client resize)
- ✅ Rate Limits (conversations, messages, file uploads)
- ✅ Authentication Settings (registration, login)
- ✅ Memory System Settings
- ✅ Search Configuration (web search, file search)
- ✅ OCR Settings
- ✅ Actions & Tools Configuration
- ✅ MCP Server Configuration
- ✅ Security Settings
- ✅ Database Configuration
- ✅ Session Management

### 3. Profile Management
- **Status**: ✅ Working
- **Description**: Create, read, update, delete configuration profiles
- **Files**: `server/storage.ts`, `server/routes.ts`

### 4. Configuration Validation
- **Status**: ✅ Working
- **Description**: Zod-based validation for all configuration options
- **Files**: `shared/schema.ts`

### 5. Package Generation
- **Status**: ✅ Working
- **Description**: Generate deployment packages (env, yaml, docker-compose, scripts)
- **Files**: `server/routes.ts`

### 6. Deployment Management
- **Status**: ✅ Working
- **Description**: Manage deployments to Railway, Vercel, DigitalOcean
- **Files**: `shared/schema.ts`, `server/storage.ts`

### 7. Frontend UI
- **Status**: ✅ Working
- **Description**: React-based UI with shadcn/ui components
- **Files**: `client/src/App.tsx`, `client/src/pages/home.tsx` (assumed)

## RC4 Changes Impact Analysis

### 🔴 High Impact Changes

#### 1. Configuration Version Update
- **Current**: `configVer: "0.8.0-rc3"`
- **Required**: `configVer: "0.8.0-rc4"`
- **Impact**: Core schema update needed
- **Files to Update**: `shared/schema.ts`

#### 2. Streamlined Endpoints Framework
- **Change**: All endpoints unified under LibreChat Agents framework
- **Impact**: May affect endpoint configuration structure
- **Action Required**: Research new endpoint configuration schema
- **Files to Review**: `shared/schema.ts` (endpoint configurations)

#### 3. Enhanced MCP (Model Context Protocol) Integration
- **New Features**: 
  - Multi-user MCP connections
  - Lazy connection management
  - Request placeholders for MCP headers
  - Enhanced MCP tool caching
- **Impact**: MCP configuration schema may need updates
- **Files to Update**: `shared/schema.ts` (MCP section)

### 🟡 Medium Impact Changes

#### 4. New Environment Variables
- **New**: `REDIS_PING_INTERVAL`
- **New**: `MIN_PASSWORD_LENGTH` (configurable minimum password length)
- **Impact**: Add to environment variable generation
- **Files to Update**: Package generation logic in `server/routes.ts`

#### 5. Enhanced File Upload System
- **New Features**:
  - Upload as Text Support (plaintext, audio, RAG)
  - Enhanced token limits
  - Client-side image resizing improvements
- **Impact**: File configuration schema updates
- **Files to Update**: `shared/schema.ts` (file configuration section)

#### 6. SubDirectory Hosting Support
- **New Feature**: Deploy LibreChat in subdirectories
- **Impact**: May need new deployment configuration options
- **Files to Update**: `shared/schema.ts` (deployment section)

#### 7. Audio & Speech Features
- **New Features**:
  - Cumulative Transcription Support
  - External STT support
  - GPT-4o Transcribe Models
- **Impact**: Audio configuration schema updates
- **Files to Update**: `shared/schema.ts` (audio/speech section)

### 🟢 Low Impact Changes

#### 8. Language Support
- **New**: Tibetan and Ukrainian language support
- **Impact**: UI language options update (if applicable)

#### 9. Security Enhancements
- **New**: Enhanced OIDC username claims
- **New**: User ID metadata for Anthropic API
- **New**: Agent email validation
- **Impact**: Minor security configuration updates

## Migration Tasks Checklist

### Phase 1: Research & Documentation
- [ ] **1.1** Study RC4 configuration documentation in detail
- [ ] **1.2** Compare RC3 vs RC4 configuration schemas
- [ ] **1.3** Identify all new configuration options
- [ ] **1.4** Document breaking changes and deprecated options
- [ ] **1.5** Research new endpoint framework structure

### Phase 2: Schema Updates
- [ ] **2.1** Update `configVer` from "0.8.0-rc3" to "0.8.0-rc4"
- [ ] **2.2** Add new MCP configuration options
  - [ ] Multi-user MCP connections
  - [ ] Request placeholders for MCP headers
  - [ ] Enhanced MCP tool caching options
- [ ] **2.3** Update file configuration schema
  - [ ] Upload as Text Support options
  - [ ] Enhanced token limits
  - [ ] Client-side image resizing improvements
- [ ] **2.4** Add new environment variables
  - [ ] `REDIS_PING_INTERVAL` option
  - [ ] `MIN_PASSWORD_LENGTH` option
- [ ] **2.5** Update endpoint configuration for unified framework
- [ ] **2.6** Add SubDirectory hosting configuration options
- [ ] **2.7** Update audio/speech configuration schema
- [ ] **2.8** Add security enhancement options

### Phase 3: Backend Updates
- [ ] **3.1** Update default configuration generation (`server/storage.ts`)
- [ ] **3.2** Update package generation for new environment variables
- [ ] **3.3** Update validation logic for new schema
- [ ] **3.4** Test configuration validation with RC4 samples
- [ ] **3.5** Update deployment configuration handling

### Phase 4: Frontend Updates
- [ ] **4.1** Update UI components for new configuration options
- [ ] **4.2** Add form fields for new MCP features
- [ ] **4.3** Add form fields for new file upload options
- [ ] **4.4** Add form fields for new environment variables
- [ ] **4.5** Update validation error handling
- [ ] **4.6** Add help text and tooltips for new features

### Phase 5: Testing & Validation
- [ ] **5.1** Create RC4 test configuration profiles
- [ ] **5.2** Test package generation with RC4 configurations
- [ ] **5.3** Validate generated configurations against RC4 standards
- [ ] **5.4** Test deployment package generation
- [ ] **5.5** Test profile import/export functionality
- [ ] **5.6** Performance testing with new features

### Phase 6: Documentation & Migration
- [ ] **6.1** Update internal documentation
- [ ] **6.2** Create RC3 to RC4 migration guide for users
- [ ] **6.3** Add RC4 feature explanations to UI
- [ ] **6.4** Update example configurations
- [ ] **6.5** Create migration script for existing RC3 profiles

## Technical Implementation Details

### Schema Changes Required

#### 1. Core Configuration Update
```typescript
// Update version
configVer: z.string().default("0.8.0-rc4")
```

#### 2. New Environment Variables
```typescript
// Add new environment variable options
redisConfig: z.object({
  pingInterval: z.number().min(1000).max(300000).default(30000), // REDIS_PING_INTERVAL
}).optional(),

security: z.object({
  // existing security options...
  minPasswordLength: z.number().min(6).max(128).default(8), // MIN_PASSWORD_LENGTH
}).optional(),
```

#### 3. Enhanced MCP Configuration
```typescript
mcpServers: z.array(z.object({
  // existing MCP options...
  multiUserConnections: z.boolean().default(false),
  lazyConnection: z.boolean().default(true),
  requestPlaceholders: z.record(z.string()).optional(),
  toolCaching: z.object({
    enabled: z.boolean().default(true),
    maxSize: z.number().default(1000),
    ttl: z.number().default(3600),
  }).optional(),
})).optional(),
```

#### 4. Enhanced File Configuration
```typescript
filesConfig: z.object({
  // existing file options...
  uploadAsText: z.object({
    enabled: z.boolean().default(false),
    supportedTypes: z.array(z.string()).default(['text/plain']),
    maxTokens: z.number().default(100000),
  }).optional(),
  clientResize: z.object({
    enabled: z.boolean().default(true),
    maxWidth: z.number().default(1920),
    maxHeight: z.number().default(1080),
    quality: z.number().min(0.1).max(1).default(0.8),
    compressFormat: z.enum(['jpeg', 'png', 'webp']).default('jpeg'),
  }).optional(),
}).optional(),
```

#### 5. SubDirectory Hosting
```typescript
hosting: z.object({
  subDirectory: z.object({
    enabled: z.boolean().default(false),
    path: z.string().optional(), // e.g., '/chat'
    baseUrl: z.string().optional(),
  }).optional(),
}).optional(),
```

### Package Generation Updates

#### Environment File Generation
```typescript
// Add new environment variables to generation
const envContent = `
# Existing variables...
${config.redisConfig?.pingInterval ? `REDIS_PING_INTERVAL=${config.redisConfig.pingInterval}` : ''}
${config.security?.minPasswordLength ? `MIN_PASSWORD_LENGTH=${config.security.minPasswordLength}` : ''}
`;
```

## Risk Assessment

### High Risk
- **Endpoint Framework Changes**: The unified endpoints framework may introduce breaking changes to endpoint configurations
- **MCP Schema Changes**: Enhanced MCP features may not be backward compatible

### Medium Risk
- **File Upload Schema**: New file upload features may conflict with existing configurations
- **Environment Variables**: New environment variables need careful handling in existing deployments

### Low Risk
- **UI Updates**: Most UI changes are additive
- **Language Support**: No impact on existing functionality

## Rollback Plan

1. **Backup Strategy**: Ensure all existing RC3 configurations are backed up
2. **Version Toggle**: Implement ability to switch between RC3 and RC4 schemas
3. **Configuration Migration**: Provide tools to migrate RC4 back to RC3 if needed
4. **Database Backup**: Backup configuration profiles before migration

## Success Criteria

- [ ] All existing RC3 configurations can be migrated to RC4
- [ ] New RC4 features are configurable through the UI
- [ ] Generated packages work with LibreChat RC4
- [ ] Performance is maintained or improved
- [ ] No data loss during migration
- [ ] Comprehensive test coverage for new features

## Timeline Estimate

- **Phase 1 (Research)**: 2-3 days
- **Phase 2 (Schema Updates)**: 3-4 days  
- **Phase 3 (Backend Updates)**: 2-3 days
- **Phase 4 (Frontend Updates)**: 4-5 days
- **Phase 5 (Testing)**: 3-4 days
- **Phase 6 (Documentation)**: 2-3 days

**Total Estimated Time**: 16-22 days

## Dependencies

- LibreChat v0.8.0-RC4 official documentation
- RC4 configuration schema specifications
- Testing environment with LibreChat RC4
- Access to RC4 sample configurations

## Next Steps

1. Begin with Phase 1 research to get detailed RC4 configuration documentation
2. Set up testing environment with LibreChat RC4
3. Create backup of all existing configurations
4. Start schema analysis and comparison between RC3 and RC4

---

**Document Status**: Draft  
**Created**: {current_date}  
**Last Updated**: {current_date}  
**Version**: 1.0