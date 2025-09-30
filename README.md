# LibreChat Configuration Tool

## 🎥 Video Demo

[![LibreChat Configuration Tool Demo](https://img.youtube.com/vi/7NOCdZaukuM/maxresdefault.jpg)](https://youtu.be/7NOCdZaukuM?si=lRFjX0mcHJpOT5Ey)

**[▶️ Watch the full demo video](https://youtu.be/7NOCdZaukuM?si=lRFjX0mcHJpOT5Ey)** - See the LibreChat Configuration Tool in action!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)

## Why This Exists

**LibreChat is incredibly powerful, but configuring it shouldn't require a PhD in YAML.**

Setting up LibreChat involves managing 100+ configuration options across environment variables, YAML files, OAuth providers, database connections, AI API keys, file storage backends, email services, and more. The official docs are comprehensive but scattered across dozens of pages, making it easy to miss critical settings or misconfigure complex integrations.

**This tool solves that.** Whether you're configuring LibreChat for your own use or creating installation packages to share with others, you get:

- **Progressive disclosure** - Pick your providers first, then see only the relevant fields
- **Real-time validation** - Catch configuration errors before deployment
- **Complete packages** - Generate all files needed for deployment in one click
- **Beginner-friendly** - No need to understand YAML syntax or environment variable conventions

**Built by the community, for the community.** As LibreChat evolves and adds new features, this tool evolves with it. Missing a new provider or configuration option? The codebase is designed to make adding support straightforward - just update the schemas and the UI follows automatically.

**Help make LibreChat accessible to everyone.** Whether you're fixing a bug, adding support for a new AI provider, or improving the user experience, your contributions help more people deploy and enjoy LibreChat without the configuration headaches.

## How to Use

**This tool serves two main purposes:**

1. **🔧 Configure LibreChat Settings** - Use the intuitive interface to set up all LibreChat configuration options
2. **📦 Create One-Click Installation Packages** - Generate complete deployment packages that others can download and run immediately

### 🌐 Use Online (Limited Features)

**[Launch LibreChat Configuration Tool](https://librechatconfigurator.netlify.app/)**

- ✅ Configure all LibreChat settings  
- ✅ Download individual files (.env, librechat.yaml, JSON config)
- ❌ **ZIP package generation will fail** - no backend on Netlify

### 💻 Run Locally (Full Features)

**Prerequisites:** Node.js 20+ ([download here](https://nodejs.org/))

**Quick Start:**
```bash
git clone https://github.com/Fritsl/LibreChatConfigurator.git
cd LibreChatConfigurator
npm install
npm run dev
# Open http://localhost:5000 in your browser
```

**What you get locally:**
- ✅ Configure all LibreChat settings with the clean tabbed interface
- ✅ Download individual files (.env, librechat.yaml, JSON config)
- ✅ Generate complete installation ZIP packages with Docker setup and scripts
- ✅ Share ready-to-deploy packages with others

## Production Build

For production deployment:

```bash
npm run build
npm start
```

The app will build and serve on port 5000 in production mode.

## Features

- **Progressive Disclosure**: Choose providers first, then see only relevant configuration fields
- **Comprehensive Coverage**: Supports all LibreChat v0.8.0 settings - see mapping below
- **Clean Interface**: Organized into logical tabs with search functionality
- **Real-time Validation**: Immediate feedback on configuration issues
- **Profile Management**: Save and load different configuration profiles

## Supported Configuration Settings

This tool aims to support all LibreChat v0.8.0 configuration options. Here's what's currently covered:

**Based on [LibreChat Documentation](https://www.librechat.ai/docs/)**

> **📝 Note about Documentation Links:** The LibreChat documentation site has a URL structure issue where `docs.librechat.ai` URLs redirect to `www.librechat.ai/docs`. All links below use the correct `www.librechat.ai` domain that actually works. If you encounter any broken links, simply replace `docs.librechat.ai` with `www.librechat.ai` in the URL.

### Core Settings (.env)
| Setting | Type | Documentation |
|---------|------|---------------|
| `APP_TITLE` | String | [Configuration](https://www.librechat.ai/docs/configuration/dotenv) |
| `CUSTOM_FOOTER` | String | [Configuration](https://www.librechat.ai/docs/configuration/dotenv) |
| `DOMAIN_CLIENT`, `DOMAIN_SERVER` | String | [Configuration](https://www.librechat.ai/docs/configuration/dotenv) |
| `HOST`, `PORT` | Server | [Configuration](https://www.librechat.ai/docs/configuration/dotenv) |
| `MONGO_URI`, `REDIS_URI` | Database | [Database Setup](https://www.librechat.ai/docs/configuration/mongodb) |
| `JWT_SECRET`, `JWT_REFRESH_SECRET` | Security | [Security](https://www.librechat.ai/docs/configuration/dotenv) |
| `ALLOW_REGISTRATION`, `ALLOW_EMAIL_LOGIN` | Auth | [Authentication](https://www.librechat.ai/docs/configuration/authentication) |

### AI Provider API Keys (.env)
| Provider | Environment Variables | Documentation |
|----------|----------------------|---------------|
| OpenAI | `OPENAI_API_KEY` | [Providers](https://www.librechat.ai/docs/configuration/pre_configured_ai/openai) |
| Anthropic | `ANTHROPIC_API_KEY` | [Providers](https://www.librechat.ai/docs/configuration/pre_configured_ai/anthropic) |
| Google | `GOOGLE_API_KEY` | [Providers](https://www.librechat.ai/docs/configuration/pre_configured_ai/google) |
| Azure OpenAI | `AZURE_OPENAI_*` | [Azure Setup](https://www.librechat.ai/docs/configuration/azure) |
| AWS Bedrock | `AWS_*` | [Bedrock Setup](https://www.librechat.ai/docs/configuration/pre_configured_ai/bedrock) |
| 15+ Others | Various API keys | [AI Providers](https://www.librechat.ai/docs/configuration/pre_configured_ai) |

### OAuth Providers (.env)
| Provider | Fields | Documentation |
|----------|--------|---------------|
| Google OAuth | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | [OAuth Setup](https://www.librechat.ai/docs/configuration/authentication/OAuth2-OIDC/google) |
| GitHub OAuth | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | [OAuth Setup](https://www.librechat.ai/docs/configuration/authentication/OAuth2-OIDC/github) |
| Discord, Facebook, Apple | Client credentials | [OAuth Setup](https://www.librechat.ai/docs/configuration/authentication/OAuth2-OIDC) |
| OpenID Connect | Custom OIDC configuration | [OAuth Setup](https://www.librechat.ai/docs/configuration/authentication/OAuth2-OIDC) |

### File Storage (.env)
| Strategy | Configuration | Documentation |
|----------|---------------|---------------|
| Local | `FILE_UPLOAD_PATH` | [File Handling](https://www.librechat.ai/docs/configuration/librechat_yaml/object_structure/file_config) |
| Firebase | `FIREBASE_*` credentials | [File Handling](https://www.librechat.ai/docs/configuration/librechat_yaml/object_structure/file_config) |
| Azure Blob | `AZURE_STORAGE_*` | [File Handling](https://www.librechat.ai/docs/configuration/cdn/azure) |
| Amazon S3 | `S3_*` credentials | [File Handling](https://www.librechat.ai/docs/configuration/cdn) |

### Email Configuration (.env)
| Service | Fields | Documentation |
|---------|--------|---------------|
| SMTP | `EMAIL_SERVICE`, `EMAIL_USERNAME`, `EMAIL_PASSWORD` | [Email Setup](https://www.librechat.ai/docs/configuration/authentication/email_setup) |
| Mailgun | `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` | [Email Setup](https://www.librechat.ai/docs/configuration/authentication/email_setup) |

### Search & RAG (librechat.yaml)
| Feature | Configuration | Documentation |
|---------|---------------|---------------|
| Web Search | `webSearch` providers (Serper, Brave, Tavily, etc.) | [Search](https://www.librechat.ai/docs/configuration/librechat_yaml/object_structure/config) |
| MeiliSearch | `search`, `meilisearch*` settings | [Search](https://www.librechat.ai/docs/configuration/meilisearch) |
| RAG API | `ragApiURL`, RAG configuration | [RAG](https://www.librechat.ai/docs/configuration/rag_api) |

### Advanced Features (librechat.yaml)
| Category | Settings | Documentation |
|----------|----------|---------------|
| Interface | `interface.*` UI toggles and customization | [Configuration](https://www.librechat.ai/docs/configuration/librechat_yaml/object_structure/interface) |
| Rate Limiting | `rateLimits.*` comprehensive limits | [Configuration](https://www.librechat.ai/docs/configuration/librechat_yaml/object_structure/config) |
| File Config | `fileConfig.*` upload limits and processing | [File Handling](https://www.librechat.ai/docs/configuration/librechat_yaml/object_structure/file_config) |
| Registration | `registration.*` domain restrictions | [Authentication](https://www.librechat.ai/docs/configuration/authentication) |
| Caching | Cache headers and static file settings | [Configuration](https://www.librechat.ai/docs/configuration/dotenv) |
| MCP Servers | `mcpServers.*` Model Context Protocol | [MCP](https://www.librechat.ai/docs/configuration/librechat_yaml/object_structure/mcp_servers) |

**Missing something?** Please open a PR! This tool is community-driven and welcomes contributions as LibreChat evolves.

**📚 Documentation Reference:**
- [LibreChat Configuration Guide](https://www.librechat.ai/docs/configuration/)
- [Quick Start](https://www.librechat.ai/docs/installation/docker_compose)
- [Authentication Setup](https://www.librechat.ai/docs/configuration/authentication)
- [RAG API](https://www.librechat.ai/docs/configuration/rag_api)

## 🤝 Sharing Configurations with Others

**The LibreChat Configuration Tool makes it easy to share complete configurations with other users.**

### How to Share Your Configuration

1. **Configure your LibreChat setup** using the tool interface
2. **Go to "Package → Preview files..."** to review your settings
3. **Click the "Download" button** on the **"LibreChat Configuration Settings (JSON)"** tab
   - This downloads a file named `librechat-config-v0.8.0-rc4.json`
   - The filename includes the tool version for compatibility tracking
4. **Share the JSON file** with other users via:
   - Direct file sharing
   - GitHub Issues/PRs
   - Community forums
   - Team communication channels

### How to Use Someone Else's Configuration

**🚧 Import functionality is under development. For now, you can manually reference shared configurations:**

1. **Download** the shared JSON configuration file (e.g., `librechat-config-v0.8.0-rc4.json`)
2. **Open the file** to view the configuration structure
3. **Manually apply settings** to your own LibreChat Configuration Tool:
   - Copy relevant settings from the JSON to your tool
   - Add your own API keys and credentials
   - Adjust paths and server settings for your environment

### 🔄 Version Compatibility (Foundation)

**All shared configurations now include version metadata for future compatibility checking:**

- Each exported JSON includes `configVersion` and `generatedDate` fields
- Version format follows semantic versioning (e.g., `0.8.0-rc4`)
- Foundation is in place for automatic import validation in future versions

**When import functionality is added, the tool will automatically detect version mismatches and provide upgrade guidance.**

### 💡 Best Practices for Sharing

**✅ Do:**
- Remove sensitive information (API keys, passwords) before sharing
- Include descriptive comments about your setup
- Test your configuration before sharing
- Mention any custom requirements or dependencies

**❌ Don't:**
- Share configurations with real API keys or secrets
- Assume others have the same file paths or domain setup
- Share untested configurations

### 🛡️ Security Note

**Never share configurations containing:**
- Real API keys (OpenAI, Anthropic, Google, etc.)
- JWT secrets or encryption keys
- Database connection strings with credentials  
- OAuth client secrets
- Email service passwords

**Always sanitize sensitive data before sharing. Recipients should add their own credentials after importing.**

## Architecture

This project follows a modern full-stack TypeScript architecture with clear separation of concerns:

```
LibreChat Configuration Tool
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # UI Components (Tabs, Forms, Inputs)
│   │   ├── lib/           # Utilities & Defaults
│   │   ├── hooks/         # React Hooks (useConfiguration)
│   │   └── pages/         # Route Components
│   └── index.html
├── server/                 # Express Backend
│   ├── routes.ts          # API Endpoints
│   ├── storage.ts         # Data Layer (Memory/Database)
│   └── vite.ts            # Development Server
├── shared/                 # Shared Types & Schemas
│   └── schema.ts          # Zod Validation Schemas
└── scripts/               # Build & Release Scripts
```

### Data Flow

1. **User Input** → Frontend validates via Zod schemas
2. **Configuration State** → Managed by React hooks with real-time validation
3. **API Requests** → Backend processes and validates configuration data
4. **File Generation** → Server creates `.env`, `librechat.yaml`, and Docker files
5. **Download** → User receives complete deployment package

### Key Components

- **Frontend**: React 18 + TypeScript, progressive disclosure UI, real-time validation
- **Backend**: Express.js API, Zod validation, pluggable storage interface
- **Shared**: Type-safe schemas ensuring frontend/backend consistency
- **Package Generation**: Server-side `.env`, `librechat.yaml`, and Docker file creation

## For Developers

- **Frontend**: `/client` - React with TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: `/server` - Express.js with TypeScript and Zod validation
- **Shared**: `/shared` - Common types and schemas used by both frontend and backend
- **Scripts**: `/scripts` - Build, release, and development automation

### Development Commands

```bash
npm run dev          # Start development server (frontend + backend)
npm run frontend-dev # Frontend only (Vite dev server)
npm run backend-dev  # Backend only (Express server)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Adding New Configuration Options

1. **Update Schema**: Add new fields to `/shared/schema.ts`
2. **Update UI**: Add form components in `/client/src/components/`
3. **Update Backend**: Modify generation logic in `/server/routes.ts`
4. **Test**: Verify end-to-end functionality

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-provider`
3. Make your changes and test thoroughly
4. Submit a pull request with a clear description

### Areas We Need Help

- **New AI Providers**: Add support for emerging AI services
- **UI/UX Improvements**: Enhance the user experience
- **Documentation**: Improve setup guides and examples
- **Testing**: Add comprehensive test coverage
- **Internationalization**: Add support for multiple languages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **LibreChat Team**: For creating an amazing open-source AI chat platform
- **Contributors**: Everyone who has helped improve this configuration tool
- **Community**: Users who provide feedback and report issues

---

**Made with ❤️ by the LibreChat community**