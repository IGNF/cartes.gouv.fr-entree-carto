# Scripts de maintenance

## Icones

Note explicative :
<https://vue-ds.fr/guide/icones#eviter-les-appels-reseaux-optionnel-pour-les-applications-internes>

### Procédure via le script

Ajouter le nom des icones de type remixicons (sans le prefixe 'ri') :

```js
// scripts/icons.js
const riIconNames = [
  "custom-size",
  "drag-drop-fill"
]
```

Exectuter la commande :

```bash
npm run icons
```

Copier le resultat du script (`icons-collections.ts`) dans `src/iconscustom.ts` :

```js
// scripts/icons-collections.ts
{
    prefix: "ri",
    icons: {
      "custom-size": {
        body: '...',
      },
      "drag-drop-fill": {
        body: '...',
      }
    },
    width: 24,
    height: 24,
}
```

### Procedure manuelle

Lancer le site :

```bash
npm run dev
```

Ouvrir le panneau de developpement du navigateur.

Identifier dans l'onglet _réseau_ les téléchargements d'icones :

```text
https://api.iconify.design/ion.json?icons=close
```

Récuperer la reponse :

```json
{
    "prefix": "ion",
    "lastModified": 1754899739,
    "aliases": {},
    "width": 512,
    "height": 512,
    "icons": {
        "close": {
            "body": "<path fill=\"currentColor\" d=\"m289.94 256l95-95A24 24 0 0 0 351 127l-95 95l-95-95a24 24 0 0 0-34 34l95 95l-95 95a24 24 0 1 0 34 34l95-95l95 95a24 24 0 0 0 34-34Z\"/>"
        }
    }
}
```

Copier cette réponse dans le fichier `src/iconscustom.ts`

## Classes CSS / SVG Remixicon pour les extensions

Usage : <https://iconify.design/docs/usage/css/no-code/>

Génerer le fichier de CSS : `ri.css`

```text
https://api.iconify.design/ri.css?icons=custom-size,drag-drop-fill,drag-drop-line,draggable,earth-fill,earth-line,file-copy-fill,file-copy-line,file-upload-fill,file-upload-line,flower-fill,flower-line,fullscreen-exit-fill,fullscreen-exit-line,fullscreen-fill,fullscreen-line,function-add-fill,function-add-line,list-indefinite,map-2-fill,map-2-line,map-pin-5-fill,map-pin-5-line,map-pin-add-fill,map-pin-add-line,map-pin-time-fill,map-pin-time-line,menu-search-fill,menu-search-line,navigation-fill,navigation-line,pencil-line,play-list-add-fill,play-list-add-line,route-fill,route-line,share-2-fill,share-2-line,shining-2-fill,shining-2-line,signpost-fill,signpost-line,text,tree-fill,tree-line
```

Utilisation des icones :

```html
<span class="icon--ri icon--ri--signpost-line"></span>
```
