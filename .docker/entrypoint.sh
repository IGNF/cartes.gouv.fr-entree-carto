#!/bin/sh

# Remplacer les placeholders dans env.js.template par les variables d'environnement
envsubst < /app/dist/env/env.js.template > /app/dist/env/env.js

# Copie dans le volume (emptyDir)
cp /app/dist/env/env.js /usr/share/nginx/html/cartes/env/env.js
cp /app/dist/env/env.js.template /usr/share/nginx/html/cartes/env/env.js.template

exec "$@"