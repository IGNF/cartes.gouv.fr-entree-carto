#!/bin/sh

# Remplacer les placeholders dans env.js.template par les variables d'environnement
envsubst < /app/env/env.js.template > /app/env/env.js

# Copie dans le volume (emptyDir)
cp /app/env/env.js /usr/share/nginx/html/cartes/env/env.js
cp /app/env/env.js.template /usr/share/nginx/html/cartes/env/env.js.template

exec "$@"