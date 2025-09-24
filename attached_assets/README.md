# LibreChat Configuration

This package contains a complete LibreChat v0.8.0-RC4 installation with your custom configuration (using configuration schema vundefined).

## 📋 Package Contents

- `.env` - Environment variables configuration
- `librechat.yaml` - Main LibreChat configuration file
- `docker-compose.yml` - Docker services orchestration
- `install_dockerimage.sh` - Docker-based installation script
- `profile.json` - Configuration profile for easy re-import
- `README.md` - This documentation file

## 🚀 Quick Start

1. **Prerequisites**
   - Docker and Docker Compose installed
   - At least 4GB RAM and 10GB disk space
   - Open ports: 3080, 27017 (MongoDB)

2. **Installation**
   ```bash
   chmod +x install_dockerimage.sh
   ./install_dockerimage.sh
   ```

3. **Access**
   - Open your browser to: http://localhost:3080
   - Register an account (disabled)

## ⚙️ Configuration Summary

### Core Settings
- **LibreChat Version**: v0.8.0-RC4
- **Configuration Schema**: vundefined
- **Host**: 0.0.0.0:3080
- **Registration**: Disabled
- **Debug Logging**: Enabled

### AI Models
- **Default Model**: undefined
- **Model Selection UI**: Hidden
- **Parameters UI**: Hidden

### Features Enabled
- ❌ AI Agents
- ❌ Web Search
- ❌ File Search
- ❌ Presets
- ❌ Custom Prompts
- ❌ Bookmarks
- ❌ Memory System

### File Upload Settings
- **Max File Size**: undefinedMB
- **Max Files per Request**: undefined
- **Allowed Types**: Not configured

### Rate Limits
- **Per User**: undefined requests
- **Per IP**: undefined requests
- **Uploads**: undefined per window
- **TTS**: undefined per window
- **STT**: undefined per window

### MCP Servers
No MCP servers configured

## 🔧 Manual Configuration

### Environment Variables (.env)
Key security and application settings are stored in the `.env` file:
- JWT secrets for authentication
- Database credentials
- API keys
- Session timeouts

### LibreChat YAML (librechat.yaml)
The main configuration file controls:
- AI model endpoints
- UI feature visibility
- Agent capabilities
- File handling rules
- Rate limiting policies

### Profile File (profile.json)
A complete configuration profile that can be re-imported into the LibreChat Configuration Interface:
- Full configuration backup
- Easy re-loading for future modifications
- Compatible with the Profile → Import Profile feature

## 🐳 Docker Commands

### Basic Operations
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f librechat
```

### Maintenance
```bash
# Update images
docker-compose pull
docker-compose up -d

# Backup database
docker-compose exec mongodb mongodump --out /backup

# Clean up unused images
docker system prune -f
```

## 🔐 Security Notes

1. **Change Default Passwords**: Update MongoDB credentials in `.env`
2. **Secure API Keys**: Protect your OpenAI and other API keys
3. **JWT Secrets**: Use strong, unique JWT secrets (provided in config)
4. **Network Access**: Configure firewall rules for production use
5. **HTTPS**: Use a reverse proxy with SSL/TLS in production

## 🌐 Production Deployment

For production use, consider:

1. **Reverse Proxy**: Use Nginx or Caddy for HTTPS termination
2. **Domain Setup**: Configure proper domain name and SSL certificates
3. **Monitoring**: Set up log aggregation and monitoring
4. **Backups**: Regular database and configuration backups
5. **Updates**: Keep LibreChat and dependencies updated

## 📚 Additional Resources

- **LibreChat Documentation**: https://docs.librechat.ai
- **GitHub Repository**: https://github.com/danny-avila/LibreChat
- **Community Support**: https://discord.gg/uDyZ5Tzhct
- **Configuration Guide**: https://docs.librechat.ai/install/configuration

## 🆘 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Change port in .env file
   PORT=3081
   ```

2. **Database Connection Issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   ```

3. **Permission Errors**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Getting Help

If you encounter issues:
1. Check the logs: `docker-compose logs`
2. Verify your configuration files
3. Check the LibreChat documentation
4. Ask for help in the community Discord

---

**Generated on**: 2025-09-24
**LibreChat Version**: v0.8.0-RC4
**Configuration Schema**: vundefined
**Support**: https://docs.librechat.ai
