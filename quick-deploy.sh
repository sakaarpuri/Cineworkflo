#!/bin/bash
# Quick deploy to Netlify

echo "Installing Netlify CLI if needed..."
if ! command -v netlify &> /dev/null; then
    npm install -g netlify-cli
fi

echo "Deploying to Netlify..."
netlify deploy --prod --dir=dist --auth=$NETLIFY_TOKEN

echo "Done! Check your Netlify dashboard for the site URL."