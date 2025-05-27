#!/bin/sh
echo "Building with VITE_LANGUAGETOOL_API_URL=$VITE_LANGUAGETOOL_API_URL"
echo "VITE_LANGUAGETOOL_API_URL=$VITE_LANGUAGETOOL_API_URL" > .env.production

npm run build

npx serve -s dist -l 3000