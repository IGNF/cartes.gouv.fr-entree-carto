# Deploiement Docker avec traefik

> failed...

## build

* cartes.gouv.fr

```bash
composer install
yarn install
yarn build:dev
docker compose -f compose.yml up -d --build
```

cf. <https://localhost:9092>

## run

Lancer les commandes :

* `docker create network web_dev` (facultatif)

* dans le dossier traefik : `docker compose up -d`

* dans le dossier cartes.gouv.fr (branche main) : `docker compose -f compose[.prod].yml up -d --build`

Tu peux maintenant accéder à cartes.gouv.fr au <https://cartesgouvfr-[dev|prod].docker.localhost> (le site fonctionnera sur chrome du coup)

Après il faut voir comment mettre l'entree-carto derrière traefik

## Liens utiles

...
