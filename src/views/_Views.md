# Les vues principales (routes)

## Déroulement de l'authentification

Lors de l'authentification, les routes '/', '/login' et '/logout' sont utilisée.

Au chargement de la page, la route, la classe et la méthode suivantes sont appelées :
`/ : Main.vue : service.isAccessValided() === 'no-auth'`

Lors d'un clic sur le bouton **Se connecter**, la route `/login` est appelée :
`/login : Login.vue : mount() -> appel sso --> redirection`
Ceci declenche un appel vers le SSO, et une redirection lors de la validation
de ses identifiants de connexion.

La validation SSO appelle la route `/login` avec les paramètres d'url issus du SSO :
`/login?sso : Main.vue : service.isAccessValided (sso) === login -> Login.vue : mount() --> /?from=login&success=1`
ou
`/login?sso : Main.vue : service.isAccessValided (sso) === error -> Login.vue : mount() --> /?from=login&success=0`

Lors d'un clic sur le bouton **Se deconnecter**, la route `/logout` est appelée :
`/logout : Logout.vue : mount() -> appel sso --> redirection`

Ceci declenche un appel vers le SSO, et une redirection lors de la validation de la deconnexion :
`/logout?sso -> Main.vue : service.isAccessValided (sso) === logout -> Logout.vue : mount() --> /?from=logout&success=1`

La méthode publique `service.isAccessValided()` permet de valider l'authentification et la deconnexion.

**Note :**

Le mode d'authentification distante fonctionne sur le même principe avec quelques particularités

**Se connecter** :

- redirection vers la route de cartes.gouv.fr :
  `/login : Login.vue : mount() --> cartes.gouv.fr/login/?app=entree-carto -> appel sso --> redirect`

- validation par cartes.gouv.fr et redirection vers l'entrée carto :
  `/login?success=1 -> Main.vue : service.isAccessValided ( success=1 ) === login -> mount() --> /?from=login&success=1`

- échec de la validation :
  `/login?authentication_failed=1 -> Main.vue : service.isAccessValided ( authentication_failed=1 ) === login -> mount() --> /?from=login&success=0`

**Se deconnecter** :

- redirection vers la route de cartes.gouv.fr :
  `/logout : Logout.vue : mount() --> cartes.gouv.fr/logout/?app=entree-carto -> appel sso --> redirect`

- validation par cartes.gouv.fr et redirection vers l'entrée carto :
  `/logout?success=1 -> Main.vue : service.isAccessValided ( success=1 ) === logout -> mount() --> /?from=logout&success=1`
