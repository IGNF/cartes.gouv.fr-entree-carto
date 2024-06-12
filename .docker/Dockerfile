# ----------------------------------------------------------------------
# cf. https://medium.com/h-lab/how-to-deploy-vue-with-nginx-on-sub-path-ed8eadbc1bc5
# build :
# > docker image build -f .docker/Dockerfile --tag cartes.gouv.fr-entree-carto:latest .
# run :
# > docker run -d --restart=always -p 8082:8082 cartes.gouv.fr-entree-carto:latest
# > http://localhost:8082/cartes
#----------------------------------------------------------------------
#----------------------------------------------------------------------
# cartes.gouv.fr-entree-carto : Génération d'un build statique
#----------------------------------------------------------------------
FROM node:20-alpine as builder

RUN apk add git

WORKDIR /app
COPY . .

RUN npm install \
    && BASE_URL="/cartes" npm run build-only

#----------------------------------------------------------------------
# cartes.gouv.fr-entree-carto : Config d'un serveur statique avec nginx
#----------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:alpine
COPY --from=builder /app/dist /usr/share/nginx/html/cartes/
COPY .docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8082

USER nginx

CMD ["nginx", "-g", "daemon off;"]