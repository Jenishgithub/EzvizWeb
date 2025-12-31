#!/bin/bash
# Quick setup script for GitHub Pages deployment

echo "🎥 EZVIZ Camera Stream - GitHub Pages Setup"
echo "==========================================\n"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Initialize git repo if not already done
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git config user.name "Your Name"
    git config user.email "your.email@example.com"
    echo "✅ Git initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if mediamtx.yml exists
if [ ! -f "mediamtx.yml" ]; then
    echo "\n⚠️  mediamtx.yml not found!"
    echo "Please create mediamtx.yml with your EZVIZ camera settings"
    exit 1
fi

# Check if we're using the GitHub Pages version
if [ -f "index-github-pages.html" ] && [ ! -f "index.html" ]; then
    echo "\n📝 Renaming index-github-pages.html to index.html..."
    mv index-github-pages.html index.html
    echo "✅ Renamed"
fi

# Stage files
echo "\n📤 Staging files for git..."
git add index.html .gitignore DEPLOYMENT_OPTIONS.md GITHUB_PAGES_SETUP.md DYNAMIC_IP_DISCOVERY.md README.md 2>/dev/null

# Show status
echo "\n📊 Files to commit:"
git status

echo "\n" 
echo "🚀 Next steps:"
echo "1. Run: git commit -m 'Initial commit for GitHub Pages'"
echo "2. Go to https://github.com/new and create a public repository"
echo "3. Run: git remote add origin https://github.com/YOUR_USERNAME/ezviz_browser.git"
echo "4. Run: git branch -M main"
echo "5. Run: git push -u origin main"
echo "6. Go to repository Settings → Pages → Deploy from branch → main"
echo "7. Run MediaMTX: mediamtx mediamtx.yml"
echo "8. Visit: https://YOUR_USERNAME.github.io/ezviz_browser/"
echo "\n"
