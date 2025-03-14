# ----------------------------------------------------------------------
# cf. https://medium.com/h-lab/how-to-deploy-vue-with-nginx-on-sub-path-ed8eadbc1bc5
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
FROM node:22-alpine AS builder

ARG BASE_URL="/cartes"
ARG MODE_ENV="production"
ARG SOURCE_MAP="false"

RUN sed -i 's/https/http/' /etc/apk/repositories
RUN apk add git

WORKDIR /app
COPY . .

RUN npm install \
    && BASE_URL=${BASE_URL} SOURCE_MAP=${SOURCE_MAP} npm run build-only -- --mode=${MODE_ENV}

#----------------------------------------------------------------------
# cartesgouvfr-entree_carto : Config d'un serveur statique avec nginx
#----------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:alpine
COPY --from=builder /app/dist /usr/share/nginx/html/cartes/
COPY .docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8082

USER nginx

CMD ["nginx", "-g", "daemon off;"]