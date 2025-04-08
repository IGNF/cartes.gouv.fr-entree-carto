#!/bin/sh

set -x

# Remplacer les placeholders dans env.js.template par les variables d'environnement
envsubst < /usr/share/nginx/html/cartes/env.js.template > /usr/share/nginx/html/cartes/env.js

set +x

exit 0