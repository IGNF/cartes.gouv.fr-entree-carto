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

Identifier dans l'onget _reseau_ les téléchargements d'icones :

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

Copier cette reponse dans le fichier `src/iconscustom.ts`
