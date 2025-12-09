#!/bin/sh

# Remplacer les placeholders dans env.js.template par les variables d'environnement
envsubst < /app/dist/env/env.js.template > /usr/share/nginx/html/explorer-les-cartes/env/env.js

exec "$@"