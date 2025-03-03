# Les DataStores

## serviceStore

le store est connecté au plugin 'pinia-plugin-store',
ce qui va enregistrer les properties de la classe **Services** dans le localStorage.

Ex. de configuration stocké dans la cled **service**

```json
{
  "connexion":{
    "authenticated":true,
    "user":{
      "first_name":"jean-philippe",
      "last_name":"bazonnais"
    },
    "documents":{
        "drawing":[],
        "compute":[],
        "import":[
            {
              "name":"livrables.geojson",
              "size":18268,
              "_id":"...",
              "labels":["geojson","import","cartes.gouv.fr"],"description":"livrables",
              "mime_type":"application/geo+json",
              "extra":{
                "id":"...",
                "format":"geojson",
                "date":"03/03/2025"
              }
            }
          ],
          "service":[],
          "carte":[]
      },
      "error":{},
      "mode":"remote",
      "url":"http://localhost:1234/cartes",
      "api":"http://localhost:1234/api"
    }
  }
}
```

Toutes manipulations des documents de l'espace personnel declenchent une mise à jour du localStorage.
