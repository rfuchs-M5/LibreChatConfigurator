# LibreChat Configuration Tool

A web-based interface to configure LibreChat v0.8.0 easily with progressive disclosure and 100% parameter coverage.

## Quick Start

1. **Clone this repository**
   ```bash
   git clone [this repo]
   cd [repo-name]
   ```

2. **Install and run**
   ```bash
   npm install && npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:5000
   ```

4. **Configure your settings**
   - Use the clean tabbed interface with progressive disclosure
   - Configure only the providers you need (OAuth, Email, File Storage, etc.)
   - Set your AI API keys, database settings, and features

5. **Download your config files**
   - Get your `.env` file with environment variables
   - Get your `librechat.yaml` configuration file  
   - Get complete deployment package with Docker setup

## Features

- **Progressive Disclosure**: Choose providers first, then see only relevant configuration fields
- **100% Parameter Coverage**: All 73+ LibreChat v0.8.0 configuration options supported
- **Clean Interface**: Organized into logical tabs with search functionality
- **Real-time Validation**: Immediate feedback on configuration issues
- **Profile Management**: Save and load different configuration profiles
- **Complete Package Generation**: Ready-to-deploy files including Docker setup

## For Developers

- **Frontend**: `/client` - React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: `/server` - Express.js with TypeScript
- **Shared**: `/shared` - Common types and schemas

Feel free to modify and improve! The codebase uses modern patterns and is designed to be easily extensible.

## License

MIT License - Feel free to use, modify, and share!