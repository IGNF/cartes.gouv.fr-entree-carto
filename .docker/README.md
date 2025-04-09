# Gestion des variables d'environnement pour chaque instance de deploiement

Dans un projet **ViteJS**, les variables d’environnement sont injectées **au moment du build**, ce qui pose un problème si tu veux modifier les variables lors du **runtime** (ex: selon le déploiement Kubernetes).

Donc, l'idée est :
✅ Les variables sont chargées **au runtime**, pas au build.  
✅ On peut modifier `env.js` sans reconstruire l’image Docker.  
✅ Kubernetes permet d’injecter dynamiquement les variables selon l’environnement.  

## Liens utiles

plugin : <https://www.npmjs.com/package/vite-plugin-runtime>

<https://www.baeldung.com/ops/vuejs-pass-environment-variables-runtime>
<https://github.com/Baeldung/ops-tutorials/tree/main/docker-modules/passing-env-vars-to-vue-app-at-runtime/vue-env-vars-complete>

<https://medium.com/quadcode-life/vite-nginx-and-environment-variables-for-a-static-website-at-runtime-f3d0b2995fc7>
<https://github.com/dipiash/vite-nginx-dynamic-env-variables-example/tree/main>

<https://vsupalov.com/docker-arg-vs-env/>

## Mise en place

Merci ChatGPT :
<https://chatgpt.com/share/67ee67db-935c-8007-a88b-1de727c09cfa>

### Résumé

- via un plugin : creer un fichier env.js et substituer les variables avec celles de env.js dans le bundle
- avec docker : entrypoint de creation d'un fichier env.js templatisé à partir d'un .env et lancement de nginx
- avec docker-compose / k8s : positionner les variables d'environnements pour env.js

Un build *vitejs* va créer un *env.js* complété via l’env sélectionné avec `--mode`
> injection de variables en **buildtime**

Dans une image docker, le fichier *env.js* est peuplé par des variables d’environnement. Ces variables ont des valeurs par défaut fournies par l’env sélectionnée avec `--mode`
L’image est dynamique si on renseigne les *args* pour surcharger le mode.

Pour une image statique, on utilise par défaut l’env de production pour peupler les variables d’environnement.

Avec *docker compose* ou *k8s*, ces variables d’environnement sont définies à l’exécution de *nginx* par substitution avec les valeurs déclarées dans la configuration
> injection de variable en **runtime**

---

`npm run build-only -- --mode production`

Le plugin va creer un fichier *env.js* dans le répertoire `/dist` à partir de l'env de build (ex. `--mode production`) et va ensuite substituer les variables dans le code avec celles du fichier *env.js*

Ce fichier est complété avec les clefs/valeurs du fichier .env de build

Dans le dossier `dist/`, on a le fichier `env.js` :

```javascript
window.__ENV__ = {
  VITE_API_URL: "https://api.example.com"
};
```

Et, l'appel de ce script est ajouté dans le fichier `index.html`

Dans le projet ViteJS, au lieu d’utiliser `import.meta.env.VITE_API_URL`, le plugin procède à une substitution dans le code :

```javascript
const API_URL = window.__ENV__?.VITE_API_URL || "http://default-url.com";
```

---

Pour modifier le fichier `env.js` avec les variables d’environnement au moment du **runtime**, on utilise un **entrypoint**, on procéde comme suit :

On va créer un template de fichier `env.js` dans l'image Docker. Ce fichier va contenir des placeholders (balises de remplacement) que l'entrypoint pourra remplir avec les valeurs des variables d’environnement passées au runtime.

```javascript
window.__ENV__ = {
  VITE_API_URL: "${VITE_API_URL}"
};
```

Ici, on remplace les valeurs des variables d'environnement par des placeholders (`${VITE_API_URL}`).

L'**entrypoint** de Docker va être un script shell qui va remplacer les placeholders dans `env.js` par les valeurs des variables d’environnement au moment où le conteneur démarre :

- `envsubst` est une commande qui remplace les variables d'environnement dans un fichier template et écrit le résultat dans un fichier cible.
- Le fichier `env.js.template` est le modèle de fichier, et `env.js` sera généré avec les bonnes valeurs des variables d'environnement.

Le fichier `env.js.template` est généré automatiquement à partir du fichier `.env` en utilisant un script qui lit les variables du fichier `.env` et crée un template dynamique à partir de ces variables.

---

Pour injecter des variables d’environnement dans le fichier `env.js` au moment où le conteneur démarre, on met en place une configuration dans Kubernetes

> Utilisation de ConfigMap et de variables d'environnement dans le conteneur Kubernetes

On injecte directement des variables d'environnement dans le conteneur Docker au runtime via un `ConfigMap`

1. Créer un ConfigMap pour stocker les variables d'environnement

  ```yaml
   apiVersion: v1
   kind: ConfigMap
   metadata:
     name: app-config
   data:
     VITE_API_URL: "https://api.example.com"
  ```

2. Monter ce ConfigMap dans le conteneur

  ```yaml
   spec:
     containers:
       - name: my-vite-app
         image: my-vite-image
         envFrom:
           - configMapRef:
               name: app-config
  ```

ou définir les variables d'environnement au runtime ainsi :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-vite-app
spec:
  replicas: 1
  template:
    spec:
      containers:
      - name: my-vite-app
        image: my-vite-image
        env:
          - name: VITE_API_URL
            value: "https://api.example.com"
```

---

Le container de nginx est en lecture seule !
Il faut donc monter un volume temporaire pour l'écriture des fichiers d'env.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-vite-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: my-vite-app
  template:
    metadata:
      labels:
        app: my-vite-app
    spec:
      containers:
        - name: my-vite-app
          image: nginx:latest
          volumeMounts:
            - name: env-volume
              mountPath: /usr/share/nginx/html/cartes/env
              readOnly: false  # Montage en lecture-écriture du répertoire "env/"
      volumes:
        - name: env-volume
          emptyDir: {}  # Répertoire temporaire et modifiable
```

Et, une gestion des droits sur le montage du volume avec `securityContext` pour les fichiers copiés ou créés dans ce volume ?
