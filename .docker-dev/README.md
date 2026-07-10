# Docker pour le dev

## Prerequis

docker compose v2.22 pour avoir le mode **watch**

## Utilisation en mode rapide

Lancer la commande du répertoire `root`:
`docker compose -f .docker-dev/docker-compose.yml watch`

Naviguer sur <http://localhost:1235>

A chaque modification du code, avec le mode **watch**, le container est reconstruit.

**NOTE1 :**
> utiliser Firefox pour l'authentification à cause des exceptions SSL !

**NOTE2 :**
> installation de docker compose 2.22 : <https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository>

**NOTE3 :**
> les images doivent être construites au prealables !
> sinon, lancer avec l'option `docker compose up --build`

## Fonctionnement

Etapes par étapes :

* `docker network create web_dev` (facultatif)
  > tous les containers sont sur le même réseau

* dans le dossier du projet **cartes.gouv.fr-entree/.docker-dev/cartes** : `docker compose -f docker-compose.yml up -d --build`
  > creation du container : `cartesgouvfr-dev:8000`
  > exposé sur <http://localhost:9092>

:warning: Il faut le fichier .env de cartes.gouv.fr !!!

* dans le dossier du projet **cartes.gouv.fr-entree/.docker-dev/carto** :`docker compose -f docker-compose.yml watch`
  > creation du container : `cartesgouvfr-entree_carto-dev:8083`
  > exposé sur <http://localhost:8083/cartes>

* dans le dossier **racine** du projet **cartes.gouv.fr-entree/.docker-dev/proxy** : `docker compose -f .docker-dev/carto/docker-compose.yml up --build`
  > creation du container : `cartesgouvfr-nginx_proxy:80`
  > exposé sur <http://localhost:1235>

**INFO**
> pour obtenir la mise à jour des images du projet **cartes.gouv.fr**
> `docker pull ghcr.io/ignf/cartes.gouv.fr:latest`

## Env

Pour l'image de **cartes.gouv.fr**, il faut completer le fichier d'environnement avec les bonnes clefs et secrets.

**NOTE :**
> Le fichier **.env.local** est à demander pour un deploiement de production.

## Auth

Sur gitHub, new Personnal Access Token (PAT) de type "Classique"

`-> Settings / Developer Settings / Tokens (Classic) ---> Generate new PAT`

Convertir le PAT en base 64

```bash
echo -n "{{githubUserName}}:{{PAT}}" | base64
```

Dans le fichier ~/.docker/config.json, ajouter :

```json
"auths": {
  "ghcr.io": {
    "auth": "{{PAT en base 64}}"
  }
}
```

## Liens utiles

Reverse Proxy

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
