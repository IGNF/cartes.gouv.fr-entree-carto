# Déroulement de l'authentification

> Utilisation des routes '/', '/login' et '/logout' dans l'authentification
> selon le mode 'local' ou 'remote'

## En mode local

On charge la spa
`/ : main : isAccessValided avec query vide () === no-auth`

On clique sur 'Se connecter'
`/login : mount -> appel sso --> redirect`

La spa est rechargée à cause de la validation sso avec redirection vers

```text
/login?sso -> 
  main : isAccessValided (sso) === login -> mount --> /?from=login&success=1
  main : isAccessValided (sso) === error -> mount --> /?from=login&success=0
```

---

On clique sur 'Se deconnecter'
`/logout :  mount -> sso --> redirect`

La spa est rechargée à cause de la validation sso avec redirection vers
`/logout?sso -> main : isAccessValided (sso) === logout -> mount --> /?from=logout&success=1`

## En mode remote

On charge la spa
`/ : main : isAccessValided avec query vide () === no-auth`

On clique sur 'Se connecter'
`/login : mount --> cartes.gouv.fr/login/?app=entree-carto -> appel sso --> redirect`

On recharge la spa à cause de la validation sso avec redirection vers

```text
/login?authentication_failed=0|1 -> 
  main : isAccessValided ( authentication_failed=0 ) === login -> mount --> /?from=login&success=1
  main : isAccessValided ( authentication_failed=1 ) === error -> mount --> /?from=login&success=0
```

---

On clique sur 'Se deconnecter'
`/logout :  cartes.gouv.fr/logout/?app=entree-carto -> appel sso --> redirect`

La spa est rechargée à cause de la validation sso avec redirection vers
`/logout?success=1 -> main : isAccessValided (success=1) === logout -> mount --> /?from=logout&success=1`
