#!/bin/bash

# Restore Replit-specific configuration after GitHub push

echo "🔄 Restoring Replit development configuration..."

if [ ! -f "vite.config.replit.ts" ]; then
    echo "❌ No Replit config backup found!"
    exit 1
fi

# Restore Replit config
cp vite.config.replit.ts vite.config.ts

echo "✅ Replit configuration restored!"
echo "🚀 Your local development environment is ready to use."