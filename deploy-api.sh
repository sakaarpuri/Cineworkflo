#!/bin/bash

# Deploy to Netlify using the token
TOKEN="nfp_9nUrYPfcuZk1X6PCGrqCAEGb2pS3xqedeef7"

# First, create a zip of the dist folder
cd /data/.openclaw/workspace/cineworkflo
echo "Creating deployment archive..."
zip -r deploy.zip dist/ netlify.toml

# Use Netlify API to deploy
echo "Deploying to Netlify..."
curl -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/zip" \
     --data-binary "@deploy.zip" \
     https://api.netlify.com/api/v1/sites

echo ""
echo "Deployment complete! Check your Netlify dashboard for the site URL."