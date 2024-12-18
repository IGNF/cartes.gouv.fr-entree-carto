# ----------------------------------------------------------------------
# cf. https://medium.com/h-lab/how-to-deploy-vue-with-nginx-on-sub-path-ed8eadbc1bc5
#
# build :
# > docker image build -f .docker/Dockerfile --tag cartes.gouv.fr-entree-carto:latest .
#   choisir un environnement :
#   --build-arg  MODE_ENV="production|development|test"
#
# run :
# > docker run -d --restart=always  -p 8082:8082 cartes.gouv.fr-entree-carto:latest
#
# > http://localhost:8082/cartes
#----------------------------------------------------------------------


#----------------------------------------------------------------------
# cartes.gouv.fr-entree-carto : Génération d'un build statique
#----------------------------------------------------------------------
FROM node:22-alpine as builder

ARG BASE_URL="/cartes"
ARG MODE_ENV="production"

RUN apk add git

WORKDIR /app
COPY . .

RUN npm install \
    && BASE_URL=${BASE_URL} npm run build-only -- --mode=${MODE_ENV}

#----------------------------------------------------------------------
# cartes.gouv.fr-entree-carto : Config d'un serveur statique avec nginx
#----------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:alpine
COPY --from=builder /app/dist /usr/share/nginx/html/cartes/
COPY .docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8082

USER nginx

CMD ["nginx", "-g", "daemon off;"]