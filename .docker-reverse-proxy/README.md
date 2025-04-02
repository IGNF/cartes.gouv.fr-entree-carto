# Deploiement Docker avec Nginx

Pour ce test d'authentification distante, on utilise les dépôts suivantes :

* <https://github.com/IGNF/cartes.gouv.fr>
* <https://github.com/IGNF/cartes.gouv.fr-entree-carto>

Les 2 projets utilisent un fichier d'environnement (cf. rubrique Env):

* cartes.gouv.fr : `.env.local`
* cartes.gouv.fr-entree-carto : `env/.env.docker-local` ou `env/.env.docker-dev-local`

## Prerequis

docker compose v2.22 pour avoir le mode watch

## Docker

Etapes

* `docker create network web_dev` (facultatif)
  > tous les containers sont sur le même réseau

* dans le dossier du projet **cartes.gouv.fr** : `docker compose -f compose.yml up -d --build`
  > creation du container : `cartesgouvfr-app_dev-1:8000`
  > exposé sur <http://localhost:9092>

* dans le dossier du projet **cartes.gouv.fr-entree-carto** : `docker compose -f .docker/docker-compose.yml up --build -d`
  > creation du container : `cartesgouvfr-entree_carto:8082`
  > exposé sur <http://localhost:8082/cartes>

ou en mode dev

`docker compose -f .docker-dev/docker-compose.yml watch`
  > creation du container : `cartesgouvfr-entree_carto-dev:8083`
  > exposé sur <http://localhost:8083/cartes>

* dans le dossier **/.docker-reverse-proxy/nginx/** du projet **cartes.gouv.fr-entree-carto** : `docker compose -f docker-compose.yml up --build`
  > creation du container : `cartesgouvfr-nginx_proxy:80`

ou en mode dev local

dans le dossier **/.docker-reverse-proxy/nginx-dev/** :
`docker compose -f docker-compose.yml up --build`
  > creation du container : `cartesgouvfr-nginx_proxy-dev:80`

## Env

* cartes.gouv.fr-entree-carto :
  > creation du fichier `env/.env.stage` (déjà dsiponible sur le dépôt)

```ini
# variables are statically replaced at build time !
VITE_GPF_CONF_TECH_URL="data/layers.json"
VITE_GPF_CONF_PRIVATE_URL="data/private.json"
VITE_GPF_CONF_EDITO_URL="data/edito.json"

VITE_GPF_BASE_URL_EXTERNAL="http://localhost:1234" # cartes.gouv.fr installé via docker

VITE_HTTP_MOCK_REQUEST=0
VITE_HTTP_MOCK_REQUEST_SCENARIO="success_data" # success_nodata|success_data|error

IAM_DISABLE=0

# Mode auth local
IAM_URL="https://sso.geopf.fr"
IAM_REALM="geoplateforme"
IAM_CLIENT_ID="**************"
IAM_CLIENT_SECRET="**************"
IAM_ENTREPOT_API_URL="https://data.geopf.fr/api"

# Mode auth remote (proxifié en distant)
IAM_AUTH_MODE="remote" # local|remote
IAM_REDIRECT_REMOTE="http://localhost:1234"
IAM_ENTREPOT_API_URL_REMOTE="http://localhost:1234/api" # proxifié via cartes.gouv.fr installé via docker

BASE_URL="/cartes"
```

* cartes.gouv.fr :
  > creation du fichier `.env.local`

```ini
APP_ENV=dev
APP_SECRET=**************
API_HARVEST_MODE=1
 
# URL publique de l'application
APP_ROOT_URL=https://localhost:9092
 
# chemin public du répertoire de sortie pour webpack
ENCORE_PUBLIC_PATH=/build
 
# Informations pour l'envoi d'emails avec le formulaire de contact
MAILER_DSN=smtp://newsmtp.ign.fr:25?verify_peer=0
MAILER_SENDER_ADDRESS=noreply@ign.fr
MAILER_DEV_DELIVERY_ADDRESS=orka.cruze@ign.fr
SUPPORT_CONTACT_EMAIL=orka.cruze@ign.fr
 
# Proxy sortant pour les requetes http (dont vers l'API)
HTTP_PROXY=http://proxy.ign.fr:3128
HTTPS_PROXY=http://proxy.ign.fr:3128
http_proxy=http://proxy.ign.fr:3128
https_proxy=http://proxy.ign.fr:3128
 
# URLs de l'API entrepôt
API_ENTREPOT_URL=https://data.geopf.fr/api
ANNEXES_URL=https://data.geopf.fr/annexes
CATALOGUE_URL=https://qlf-cartes.ign.fr/catalogue
 
# Information de connexion à l'IAM (Identity and Access Manager)
IAM_URL=https://sso.geopf.fr
IAM_REALM=geoplateforme
IAM_CLIENT_ID==**************
IAM_CLIENT_SECRET=**************
 
API_ENTREPOT_PROC_INT_VECT_FILES_DB=0de8c60b-9938-4be9-aa36-9026b77c3c96
API_ENTREPOT_PROC_CREATE_VECT_PYR=aa5f9391-0bdb-4b97-9209-fcde351b82f6
API_ENTREPOT_PROC_CREATE_RAST_PYR=6a54dc92-fc93-4c8e-9f02-046bf889550e
 
API_ESPACE_COLLABORATIF_URL=https://espacecollaboratif.ign.fr/gcms/api
API_ESPACE_COLLABORATIF_URL=https://qlf-collaboratif.cegedim-hds.fr/collaboratif-develop/gcms/api
 
SANDBOX_COMMUNITY_ID=78068951-cebc-4aec-869c-81677d211d0e
 
SANDBOX_SERVICE_ACCOUNT_CLIENT_ID=bac-a-sable
SANDBOX_SERVICE_ACCOUNT_CLIENT_SECRET=YxKmRSBicu1ahfphlWOmBS8C6syD04l4
 
SANDBOX_PROC_INT_VECT_FILES_DB=5a348542-61a7-4289-a950-8544bb0ce2b8
SANDBOX_PROC_CREATE_VECT_PYR=a07a2d00-2bb3-45cb-a4c3-ac298501148c
SANDBOX_PROC_CREATE_RAST_PYR=2e56e7ba-552b-49b8-abcf-563184dd8c55
```

## Liens utiles

Reverse

* <https://codingwithmanny.medium.com/create-an-nginx-reverse-proxy-with-docker-a1c0aa9078f1>
* <https://stackoverflow.com/questions/62562017/docker-compose-with-nginx-reverse-a-website-and-a-restful-api>
* <https://codingwithmanny.medium.com/deploying-reactjs-with-docker-ac16728c0896>

SSL

* <https://dimuthukasunwp.github.io/Articles/Hosting-multiple-sites-or-applications-using-Docker-and-NGINX-reverse-proxy-with-Letsencrypt-SSL.html>
* <https://www.freecodecamp.org/news/docker-nginx-letsencrypt-easy-secure-reverse-proxy-40165ba3aee2/>

HowTo

<https://pimylifeup.com/docker-nginx-reverse-proxy/#:~:text=In%20this%20tutorial%2C%20we%20will%20show%20you%20how,other%20web%20servers%20and%20handles%20requests%20from%20clients>

Dev

<https://docs.docker.com/compose/how-tos/file-watch/>
