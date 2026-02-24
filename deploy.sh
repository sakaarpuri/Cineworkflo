#!/bin/bash

# Deploy CineWorkflow to Netlify
# Run this after building

echo "Deploying CineWorkflow to Netlify..."

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Build the project
echo "Building project..."
npm run build

# Deploy to Netlify
# You'll need to authenticate first: netlify login
echo "Deploying..."
netlify deploy --prod --dir=dist

echo ""
echo "✓ Deployed! Now update DNS:"
echo "1. Go to Netlify dashboard"
echo "2. Find your site"
echo "3. Add custom domain: cineworkflo.com"
echo "4. Update Hostinger DNS as instructed"