# Refonte de l'authentification

2 modes :

* remote : proxification via cartes.gouv.fr
* local

en mode remote,

* pas d'auth0
* pas de client
* pas de wrapper fetch car pas besoin de gerer le token dans les requêtes !

> on récupère les reponses, le token est géré par cartes.gouv.fr !

par contre, on a besoin d'écrire dans le localstorage pour la persistance des informations

* authentificate : true | false
* sso : information uniquement en local
* token : information uniquement en local
* user
* documents

## Les méthodes

getFetch() :
  local -> fetchWrapper
  remote -> fetch standard

getClient() est utilisé dans les metchodes publiques en mode local :

* getLogginAccess -> route /login
* getTokenAccess -> route Main via isAccessValid()
* getLogoutAccess -> route /logout

Et, ces routes /login & /logout sont utilisées pour rediriger vers cartes.gouv.fr en remote

isAccessValided() permet d'appeler getUserMe() & getDocuments() ou reninitialiser le service
mais à definir les conditions de la reussite du login / logout
  local -> ?
  remote -> ?

## Impl

classe ServiceBase de type abstract
<https://medium.com/@yuribett/javascript-abstract-method-with-es6-5dbea4b00027>

puis, on étend pour ServiceLocal et ServiceRemote

<https://medium.com/@nile.bits/javascript-factory-design-pattern-a-comprehensive-guide-9266b726ee5c>
et, on appele un singleton ou factory : service = factory.createService(mode, options)

## docker

pour l'authentification, il faut que le back-end et front soient sur le même domaine.

1. The code in the browser requests your web service backend.
2. Your web service backend calls the Server POST API
3. Your web service backend returns data to the frontend code.

TODO
> mettre un serveur nginx en frontal pour rediriger le client (url du browser)
  localhost/cartes --> localhost:5173
  localhost/cartes.gouv.fr --> localhost:9092

### Liens utiles

> nginx / docker / webapp

How to deploy Vue with Nginx on sub-path

* <https://medium.com/h-lab/how-to-deploy-vue-with-nginx-on-sub-path-ed8eadbc1bc5>
* <https://cli.vuejs.org/guide/deployment.html#docker-nginx>

Hosting Multiple Web Apps and APIs with Nginx Reverse Proxies

* <https://levelup.gitconnected.com/hosting-multiple-web-apps-and-apis-with-nginx-reverse-proxies-29f674965297>

Petite lecture sur le back/front sur le même domaine :
> Vue.js Authentication System with Node.js Backend
> same-domain authentication — this is the case when the front-end and the back-end are both running on the same domain.

* <https://jscrambler.com/blog/vue-js-authentication-system-with-node-js-backend>

reverse proxy avec nginx :

* <https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/>

middleware express :

* <https://www.geeksforgeeks.org/middleware-in-express-js/>
