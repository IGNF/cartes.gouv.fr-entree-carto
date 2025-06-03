# ----------------------------------------------------------------------
#
# build :
# > docker image build -f .docker/Dockerfile --tag cartesgouvfr-entree_carto:latest .
#   choisir un environnement :
#   --build-arg  MODE_ENV="production|development|demo|stage"
#
# run :
# > docker run -d --restart=always  -p 8082:8082 cartesgouvfr-entree_carto:latest
#
# > http://localhost:8082/cartes
#----------------------------------------------------------------------


#----------------------------------------------------------------------
# cartesgouvfr-entree_carto : Génération d'un build statique
#----------------------------------------------------------------------
FROM node:23-alpine AS builder

# Les arguments de construction de l'image
# - BASE_URL : URL de base de l'application
# - MODE_ENV : mode de construction (production, development, demo, qualif)
# - SOURCE_MAP : génère les fichiers de source map (true/false)
ARG BASE_URL="/cartes"
ARG MODE_ENV="production"
ARG SOURCE_MAP="false"

RUN sed -i 's/https/http/' /etc/apk/repositories
RUN apk add bash

WORKDIR /app
COPY . .

# On installe les dépendances, et on builde l'application
# Par defaut, le build est fait en mode production
# On peut choisir le mode de build avec l'argument --build-arg 
# pour une construction dynamique de l'image
RUN npm install \
    && BASE_URL=${BASE_URL} SOURCE_MAP=${SOURCE_MAP} npm run build-only -- --mode ${MODE_ENV}

# On copie le fichier de configuration de l'environnement
# et on le renomme en .env pour que le script le prenne en compte
# On génère le fichier .env.js.template à partir du fichier .env
COPY env/.env.${MODE_ENV} .env
COPY .docker/generate-env-template.sh generate-env-template.sh
RUN chmod +x generate-env-template.sh
RUN /app/generate-env-template.sh

#----------------------------------------------------------------------
# cartesgouvfr-entree_carto : Config d'un serveur statique avec nginx
#----------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:alpine

# Utilisateur par défaut pour nginx
ARG USER_ENV=nginx

COPY --from=builder /app/dist /usr/share/nginx/html/cartes/
COPY .docker/nginx.conf /etc/nginx/nginx.conf

USER ${USER_ENV}

# On copie le script d'entrée qui va realiser le envsubst au demarrage du container nginx
COPY --from=builder /app/.docker/entrypoint.sh /docker-entrypoint.d/50-resolvers-envsubst.sh

# On prevoit de monter un volume sous k8s 
# pour écriture du fichier d'environnement de la webapp
VOLUME ["/usr/share/nginx/html/cartes/env"]

# On copie le fichier de configuration de l'environnement
COPY --from=builder /app/dist/env /app/dist/env

ENTRYPOINT ["/docker-entrypoint.sh"]

# USER nginx
EXPOSE 8082

CMD ["nginx", "-g", "daemon off;"]