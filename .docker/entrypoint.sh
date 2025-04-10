#!/bin/sh

# Remplacer les placeholders dans env.js.template par les variables d'environnement
envsubst < /tmp/env/env.js.template > /tmp/env/env.js

# Copie dans le volume (emptyDir)
cp /tmp/env/env.js /usr/share/nginx/html/cartes/env/env.js
cp /tmp/env/env.js.template /usr/share/nginx/html/cartes/env/env.js.template

exec "$@"