#!/bin/bash

# Cut a new release for LibreChat Configuration Tool
# Usage: ./scripts/cut-release.sh v0.1.0

VERSION=${1:-"v0.1.0"}
VERSION_NUMBER=${VERSION#v}  # Remove 'v' prefix for package.json

echo "🚀 Cutting release $VERSION..."

# Update package.json version (would need manual edit due to restrictions)
echo "📝 Note: Please manually update package.json version to $VERSION_NUMBER"
echo "   Change: \"version\": \"1.0.0\" to \"version\": \"$VERSION_NUMBER\""
echo "   Change: \"name\": \"rest-express\" to \"name\": \"librechat-config-tool\""

# Prepare for git operations
echo "📋 Preparing clean repository for release..."
if [ -f "scripts/prepare-github-push.sh" ]; then
    bash scripts/prepare-github-push.sh
fi

echo "🏷️  Ready to create git tag $VERSION"
echo ""
echo "Next steps:"
echo "1. Manually update package.json as noted above"
echo "2. Run: git add ."
echo "3. Run: git commit -m 'Release $VERSION'"
echo "4. Run: git tag $VERSION"
echo "5. Run: git push origin main"
echo "6. Run: git push origin $VERSION"
echo "7. Run: ./scripts/restore-replit-config.sh"
echo ""
echo "🎉 Release $VERSION will be complete!"