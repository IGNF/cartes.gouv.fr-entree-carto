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

⚠️ 3 icônes IGN sont présents (non issu de Iconify) dans `src/iconscustom.ts`, ne pas les écraser ! 
```js
{
    prefix : "gpf",
    width: 24,
    height: 24,
    icons: {
      // Icône de l'outil coordonnée (widget)
      "coordonnee" : {
        body: `<path d="M19.96 21L19.43 16.23L18.02 17.64L12.99 12.61V6.75H14.99L11.99 3L8.99 6.75H10.99V12.6L5.94 17.64L4.53 16.23L4 21L8.77 20.47L7.36 19.06L11.98 14.43L16.6 19.06L15.19 20.47L19.96 21Z" fill="currentColor"/>`
      },
      // Icône de l'outil getFeatureInfo (widget)
      "getfeature-fill" : {
        body: `<path d="M11 18.43C11 18.21 11.01 18 11.03 17.78L9.06 16.8L9 16.83V4.24L14.94 7.21L15 7.18V12.11C15.91 11.68 16.92 11.43 18 11.43C19.49 11.43 20.87 11.9 22 12.69V2.76C22 2.69 21.99 2.63 21.96 2.56C21.85 2.31 21.56 2.19 21.3 2.3L15 5L9 2L2 5V21.24C2 21.31 2.01 21.37 2.04 21.44C2.15 21.69 2.44 21.81 2.7 21.7L9 19L11.21 20.11C11.08 19.57 11 19.01 11 18.43Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M18.77 20.29V21.89H17.17V20.29H18.77ZM18.34 13.91C19.8 14.1 20.86 15.4 20.77 16.87C20.67 18.34 19.45 19.49 17.98 19.49H17.18V17.89H17.98C18.61 17.89 19.14 17.4 19.18 16.77C19.22 16.14 18.77 15.58 18.14 15.5C17.51 15.42 16.93 15.83 16.81 16.45L15.24 16.14C15.53 14.69 16.89 13.72 18.35 13.91H18.34Z" fill="currentColor"/>`
      },
      // Icône de l'outil getFeatureInfo (widget)
      "getfeature-line" : {
        body: `<path d="M11 18.43C11 18.21 11.01 18 11.03 17.78L10 17.26V4.74L14 6.74V12.69C14.6 12.27 15.28 11.94 16 11.72V6.75L20 5.04V11.73C20.72 11.95 21.4 12.27 22 12.7V2.76C22 2.69 21.99 2.63 21.96 2.56C21.85 2.31 21.56 2.19 21.3 2.3L15 5L9 2L2 5V21.24C2 21.31 2.01 21.37 2.04 21.44C2.15 21.69 2.44 21.81 2.7 21.7L9 19L11.21 20.11C11.08 19.57 11 19.01 11 18.43ZM8 17.25L4 18.96V6.32L8 4.61V17.26V17.25Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M18.77 20.29V21.89H17.17V20.29H18.77ZM18.34 13.91C19.8 14.1 20.86 15.4 20.77 16.87C20.67 18.34 19.45 19.49 17.98 19.49H17.18V17.89H17.98C18.61 17.89 19.14 17.4 19.18 16.77C19.22 16.14 18.77 15.58 18.14 15.5C17.51 15.42 16.93 15.83 16.81 16.45L15.24 16.14C15.53 14.69 16.89 13.72 18.35 13.91H18.34Z" fill="currentColor"/>`
      }
    }
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

Récupérer la réponse :

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

Générer le fichier de CSS : `ri.css`

```text
https://api.iconify.design/ri.css?icons=compasses-2-line,custom-size,drag-drop-fill,drag-drop-line,draggable,earth-fill,earth-line,file-copy-fill,file-copy-line,file-upload-fill,file-upload-line,flower-fill,flower-line,fullscreen-exit-fill,fullscreen-exit-line,fullscreen-fill,fullscreen-line,function-add-fill,function-add-line,list-check,list-indefinite,map-2-fill,map-2-line,map-pin-5-fill,map-pin-5-line,map-pin-add-fill,map-pin-add-line,map-pin-time-fill,map-pin-time-line,menu-2-line,menu-search-fill,menu-search-line,navigation-fill,navigation-line,pencil-line,play-list-add-fill,play-list-add-line,route-fill,route-line,ruler-line,share-2-fill,share-2-line,shining-2-fill,shining-2-line,signpost-fill,signpost-line,text,tree-fill,tree-line
```

Utilisation des icones :

```html
<span class="icon--ri icon--ri--signpost-line"></span>
```
