#!/bin/bash

echo "Génération du fichier env.js.template à partir de .env"

# Créer ou vider le fichier env.js.template
> /app/dist/env.js.template

# Ajouter le début du contenu de env.js.template
echo "window.__ENV__ = {" >> /app/dist/env.js.template

# Lire chaque ligne du fichier .env et ajouter les variables à env.js.template
while IFS='=' read -r key value; do
  # Ignore les lignes vides et les commentaires
  if [[ ! -z "$key" && ! "$key" =~ ^# ]]; then
    # Écrire une ligne dans env.js.template avec le format attendu
    echo "  $key: \"\${$key}\"," >> /app/dist/env.js.template
  fi
done < .env

# Supprimer la dernière virgule pour respecter la syntaxe JavaScript
sed -i '$ s/,$//' /app/dist/env.js.template

# Ajouter la fermeture de la structure JavaScript
echo "};" >> /app/dist/env.js.template

# Ajouter un complement
echo "Object.freeze(window.__ENV__);" >> /app/dist/env.js.template
echo "Object.defineProperty(window,"__ENV__",{configurable:false,writable:false,});"  >> /app/dist/env.js.template
