# Workflow git pour l'entrée cartographique de Cartes.gouv.fr

# Presentation générale du workflow

La **branche main** est la pierre angulaire de ce workflow :
- On tirera des **branches features** depuis main pour developper les features.
- On tirera aussi des **branches releases** depuis main.

Les **branches releases** sont destinées uniquement aux releases.

Nous nous retrouvons donc avec 3 types de branches distinctes.

# Convention de nommage

## Les branches

**Les branches features :**
*feature/myfeature*

**Les branches release :**
*release/x.y.z*


## Les commits

Voir : https://buzut.net/git-bien-nommer-ses-commits/


Le template de commit est disponible dans docs/git-commit-template

Pour l'installer, le déposer sur sa machine (exemple : à la racine)


1 - Se placer à la racine du projet entree-carto 


2 - Configurer le git projet pour utiliser le template voulu lors des commits
~~~
git config commit.template ~/.git-commit-template
~~~


**Explication du template des commits :**

~~~ text

<TYPE><(SCOPE (facultatif))> : <SUJET>

<DESCRIPTION (facultatif)>

<FOOTER (facultatif)>
~~~




**Les TYPES** :

Ils sont détaillés dans le lien (build, fix, feat, refactor...)


**Le SCOPE :**

*Facultatif* - Il va dépendre du projet, et est facultatif, car n'est pas forcément pertinent :
- Interface
- Base
- Controls
- Layers
- VectorTiles
- View
- CSS
- Listeners
- Utils
- ...

**Le SUJET :**

Se limiter à 50 caractères pour donner une idée claire de l'objectif du commit, avec une forme active. Compléter si besoin dans la description.

**La DESCRIPTION :**

*Facultatif* - Sauter une ligne entre le sujet et la description. Dans la description on détaillera eventuellement plus en détails les actions réalisées par le commit. On pourra notamment passer par une liste.

**Le FOOTER :**

*Facultatif* - Sauter une ligne entre le footer et le bloc précédent. Permet de linker un ticket par exemple, pour un commit correctif.


**EXEMPLES**

Un commit qui répond au ticket #65 sur l'ajout d'un bouton de Géolocalisation sur l'entrée cartographique :

~~~ text
feat(Widget:Geoloc): Ajoute un bouton de permettant la géolocalisation

#65
~~~

Un commit qui corrige le ticket #79 sur le rendu du profil altimétrique :

~~~ text
fix(Widget:Alti) : Recentre le tracé du profil alti dans sa modale

#79

~~~

# Commandes du workflow

## Developpement d'une fonctionnalité

1 - Créer une branche de type **"feature"** à partir de **main**

~~~
git checkout main
git checkout -b feature/MYFEATURE
~~~

2 - Je travaille sur ma branche 

3 - Quand j'ai fini, je rapatrie main sur ma branche feature
~~~
git merge main
~~~

4 - J'ai fini : J'ouvre une PR depuis main sur ma branche feature-MYFEATURE 

5 - Je fais les eventuelles corrections soulevées par la review de PR sur ma branche

6 - Je tiens à jour le CHANGELOG.md

7 - Tout est OK : je valide la PR et rapatrie donc ma branche feature sur main. Je squash and merge la branche feature.

## Bug Fix et Refacto

Les bugs fixs se font directement sur main s'ils ne sont pas liés au développement d'une feature (sinon sur la branche feature liée).

Attention à bien nommer le commit selon la convention de nommage "fix".

Les "gros" bug fixes ou refacto sont à considérer comme des features: c'est à dire à réaliser sur des branches tirées depuis main.

## Release

1 - Tirer une branche de type **"release"** à partir de **main**

~~~
git checkout main
git checkout -b release-X.Y.Z
git push origin release-X.Y.Z
~~~

2 - Sur cette branche, modifier le package.json pour incrémenter numéro de version et la date

3 - Réaliser sur cette branche release les tests habituels liés à la publication d'une release (npm run test, npm run sample:serve)

4 - Si on trouve des bugs, on les corrige directement sur cette branche release (plusieurs membres de l'équipe peuvent réaliser les verifications/corrections en parrallèle sur la branche release)

~~~
git commit --> "fix(scope) : corrige le probleme"
~~~

5 - Quand on estime que tout est ok, on prépare la future publication npm en construisant les binaires :
* modifier date et version dans les package.json
* vérifier que le CHANGELOG est à jour
* git commit
* git push

**Renommer le commit "release X.Y.Z"**


6 - Quand on estime que la release est OK, on merge la branche sans fast-forward sur **main**

~~~
git checkout main
git merge release-X.Y.Z --no-ff
~~~

7 - Quand on estime que la release est OK, on tag la version sur **release**

~~~
git tag x.y.z
git push origin x.y.z
~~~

TODO 
Pousser le tag va déclencher automatiquement les étapes de **deploy and publish de l'image docker** via les githubs actions

8 - Vérification de la publication :
* suivre en direct via les githubs actions
* vérifier page de publication de la release github
* vérifier page de publication de la release npm
