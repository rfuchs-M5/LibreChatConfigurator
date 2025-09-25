#!/bin/bash

# Prepare repository for GitHub community release
# This script temporarily swaps vite.config.ts for a clean community version

echo "🔄 Preparing clean repository for GitHub..."

# Backup current Replit config if not already done
if [ ! -f "vite.config.replit.ts" ]; then
    echo "📋 Backing up Replit config..."
    cp vite.config.ts vite.config.replit.ts
fi

# Replace with community config
echo "🧹 Installing clean community config..."
cp vite.config.community.ts vite.config.ts

echo "✅ Repository is now ready for GitHub push!"
echo ""
echo "Next steps:"
echo "1. Run: git add ."
echo "2. Run: git commit -m 'Community release - clean configuration'"
echo "3. Run: git push origin main"
echo ""
echo "⚠️  After pushing, restore your Replit config with:"
echo "   ./scripts/restore-replit-config.sh"