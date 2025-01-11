import { http, HttpResponse } from 'msw'
// https://mswjs.io/docs/

var success = [
  /**
   * obtenir le token
   */
  http.post('https://sso.geopf.fr/realms/geoplateforme/protocol/openid-connect/token', async ({ request }) => {
    return HttpResponse.json({
      "access_token": 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiiSldUIiwia2lkIiA6ICJuQTM1bFJNeWVEMnU3WGJDTk9UbTRORjE0eTNoYlBMcGw4TXQtVzR3STJnIn0.eyJleHAiOjE3MzE2MTkwMDksImlhdCI6MTczMTU3NTgwOSwianRpIjoiZWFkOTNjMTAtNTRlMi00NmJkLTkwYjQtNzg5ZDFhYWFlZDJmIiwiaXNzIjoiaHR0cHM6Ly9zc28uZ2VvcGYuZnIvcmVhbG1zL2dlb3BsYXRlZm9ybWUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMzE3MGViOGYtMWIzNS00ZWZhLWEwZjktY2E0Mjk0OTMzNGY0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiY2FydGVzLWdvdXYtZGV2IiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWdlb3BsYXRlZm9ybWUiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwiZGVsZXRlLWFjY291bnQiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJjbGllbnRJZCI6ImNhcnRlcy1nb3V2LWRldiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJjbGllbnRIb3N0IjoiODIuMTQyLjIzLjQzIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWNhcnRlcy1nb3V2LWRldiIsImdpdmVuX25hbWUiOiIiLCJjbGllbnRBZGRyZXNzIjoiODIuMTQyLjIzLjQzIiwiZmFtaWx5X25hbWUiOiIiLCJlbWFpbCI6InNlcnZpY2UtYWNjb3VudC1jYXJ0ZXMtZ291di1kZXZAbm8tcmVwbHkuZnIifQ.bVsPFTWz0dY2YmEVjUyJY3wcXXUNF4vR48Z03s4pps8zQg-93dR8c_xjfrSVvLKwW8M-ynZAoAzgrjJydlaoA26wgZlfkxJu8zVKwfnQk_TFeYg-liXiv8YoES8JPL5vRPo-Yaz4JSy-vojJfdFTGx9Sw9UI2ZEfPEgxwuUL3OBuCTqVPG4N_imElCbAFYG6y1fgoGmO8FxGpamfOk16ev9-G8hy1J1heVSzeLWzQtQRuL0bMYWFmLaa0cjrvm8Hemp7Rwe5EHQ9McyQ2_Buu6IsWEYRoaqhqHUrn5MyIKnuAJZ3cZmp8bb_Gu0wFPjzrzh0J8rSy3D60ySai7RS2g',
      "expires_in": 43200,
      "refresh_expires_in": 0,
      "token_type": 'Bearer',
      "not-before-policy": 0,
      "scope": 'profile email'
    })
  }),
  /**
   * obtenir les informations de l'utilisateur
   */
  http.get('https://data.geopf.fr/api/users/me', async ({ request }) => {
    return HttpResponse.json({
          "email": "antoine.dupont@ign.fr",
          "creation": "2024-01-10T11:21:28.618783Z",
          "last_call": "2024-11-05T13:43:56.168033Z",
          "communities_member": [
              {
                  "rights": [
                      "UPLOAD",
                      "ANNEX",
                      "BROADCAST",
                      "PROCESSING"
                  ],
                  "community": {
                      "name": "Découverte",
                      "technical_name": "sandbox",
                      "datastore": "122b878c-aad7-4507-87b2-465e664467d3",
                      "supervisor": "e175d6c4-a03e-4ade-a769-86e8dd2bed58",
                      "public": false,
                      "_id": "78068951-cebc-4aec-869e-81677d211d0e"
                  }
              }
          ],
          "documents_quota": 500000000,
          "documents_use": 8610,
          "keys_quota": 10,
          "keys_use": 0,
          "technical": false,
          "administrator": false,
          "_id": "09e091dc-51d5-4c04-963d-3045df5ce477",
          "last_name": "Dupont",
          "first_name": "Antoine"
    })
  })
];
/**
 * les scenarios : error ou success_[data|nodata]
 * le type de scenario est configuré dans le fichier d'environnement
 */
export const handlers = {
  success_nodata : success.concat(
    /**
     * obtenir les documents de l'utilisateur (vide)
     */
    http.get('https://data.geopf.fr/api/users/me/documents', async ({ request }) => {
      const url = new URL(request.url);
      const labels = url.searchParams.getAll('labels');
      
      var response = null;
      if (labels.includes("drawing") &&
      labels.includes("import") &&
      labels.includes("carte") &&
      labels.includes("compute")&&
      labels.includes("service")) {
        response = [];
      }
      return HttpResponse.json(response);
    })
  ),
  success_data : success.concat(
    /**
     * obtenir les documents de l'utilisateur
     */
    http.get('https://data.geopf.fr/api/users/me/documents', async ({ request }) => {
      const url = new URL(request.url);
      const labels = url.searchParams.getAll('labels');
      
      var response = null;
      if (labels.includes("carte")) {
        response = [{
          "name": "academie",
          "size": 495,
          "_id": "3fa85f64-5717-4562-b3fc-2c963f66aba0"
        },{
          "name": "insee",
          "size": 497,
          "_id": "3fa85f64-5717-4562-b3fc-2c963f66aba1"
        }];
      }
      if (labels.includes("compute")) {
        response = [{
          "name": "Profil altimétrique.geojson",
          "size": 20935,
          "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa0"
        },{
          "name": "isocurve (pieton).geojson",
          "size": 58050,
          "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa1"
        },{
          "name": "itineraire (voiture).geojson",
          "size": 8916,
          "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa2"
        }];
      }
      if (labels.includes("drawing")) {
        response = [{
          "name": "croquis1.kml",
          "size": 2621,
          "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa3"
        },{
          "name": "croquis2.kml",
          "size": 3652,
          "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa4"
        }];
      }
      if (labels.includes("import")) {
        response = [{
          "name": "regions.geojson",
          "size": 529739,
          "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa5"
        },
        {
          "name": "rando_corse.gpx",
          "size": 70165,
          "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        },
        {
          "name": "decoupage_top100.kml",
          "size": 142017,
          "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa7"
        },
        {
          "name": "regions.json",
          "size": 142017,
          "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa8"
        }];
      }
      if (labels.includes("service")) {
        response = [{
          "name": "wms.json",
          "size": 0,
          "_id": "3fa85f64-5717-4562-b3fc-2c963f66afb0"
        },
        {
          "name": "wmts.json",
          "size": 0,
          "_id": "3fa85f64-5717-4562-b3fc-2c963f66afb1"
        },
        {
          "name": "mapbox1.json",
          "size": 0,
          "_id": "3fa85f64-5717-4562-b3fc-2c963f66afb2"
        },
        {
          "name": "mapbox2.json",
          "size": 0,
          "_id": "3fa85f64-5717-4562-b3fc-2c963f66afb3"
        }];
      }

      return HttpResponse.json(response);
    }),
    /**
     * obtenir les informations d'un document
     */
    http.get('https://data.geopf.fr/api/users/me/documents/:id', async ({ params }) => {
      const { id } = params;
      var response = null;
      // cartes
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66aba0') {
        response = HttpResponse.json({
          "name": "academie",
          "description": "Thematique des academies",
          "size": 495,
          "mime_type": "application/json",
          "labels": [
            "cartes.gouv.fr",
            "carte",
            "external"
          ],
          "_id": id
        });
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66aba1') {
        response = HttpResponse.json({
          "name": "insee",
          "description": "Thematique insee sur les logements sociaux",
          "size": 497,
          "mime_type": "application/json",
          "labels": [
            "cartes.gouv.fr",
            "carte",
            "external"
          ],
          "_id": id
        });
      }
      // compute
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa0') {
        response = new HttpResponse("Not yet implemented !", { status: 501 });
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa1') {
        response = new HttpResponse("Not yet implemented !", { status: 501 });
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa2') {
        response = new HttpResponse("Not yet implemented !", { status: 501 });
      }
      // drawing
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa3') {
        response = HttpResponse.json({
          "name": "croquis1.kml",
          "description": "croquis avec un icone, une ligne et une surface",
          "size": 3485,
          "mime_type": "application/octet-stream",
          "labels": [
            "cartes.gouv.fr",
            "drawing",
            "kml"
          ],
          "_id": id
        });
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa4') {
        response = HttpResponse.json({
          "name": "croquis2.kml",
          "description": "croquis avec un icone et un label",
          "size": 3485,
          "mime_type": "application/octet-stream",
          "labels": [
            "cartes.gouv.fr",
            "drawing",
            "kml"
          ],
          "_id": id
        });
      }
      // import
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa5') {
        response = HttpResponse.json({
          "name": "regions.geojson",
          "description": "carte des regions",
          "size": 529739,
          "mime_type": "application/geo+json",
          "labels": [
            "cartes.gouv.fr",
            "import",
            "geojson",
            "internal"
          ],
          "_id": id
        });
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa6') {
        response = HttpResponse.json({
          "name": "rando_corse.gpx",
          "description": "ma rando",
          "size": 70165,
          "mime_type": "application/gpx+xml",
          "labels": [
            "cartes.gouv.fr",
            "import",
            "gpx",
            "internal"
          ],
          "_id": id
        });
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa7') {
        response = HttpResponse.json({
          "name": "decoupage_top100.kml",
          "description": "decoupage TOP100",
          "size": 142017,
          "mime_type": "application/octet-stream",
          "labels": [
            "cartes.gouv.fr",
            "import",
            "kml",
            "internal"
          ],
          "_id": id
        });
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa8') {
        response = HttpResponse.json({
          "name": "regions.json",
          "description": "carte des regions",
          "size": 529739,
          "mime_type": "application/json",
          "labels": [
            "cartes.gouv.fr",
            "import",
            "geojson",
            "external"
          ],
          "_id": id
        });
      }
      // service
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afb0') {
        response = HttpResponse.json({
          "name": "wms.json",
          "description": "wms",
          "size": 142017,
          "mime_type": "application/json",
          "labels": [
            "cartes.gouv.fr",
            "service",
            "wms",
            "external"
          ],
          "_id": id
        });
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afb1') {
        response = HttpResponse.json({
          "name": "wmts.json",
          "description": "wmts",
          "size": 142017,
          "mime_type": "application/json",
          "labels": [
            "cartes.gouv.fr",
            "service",
            "wmts",
            "external"
          ],
          "_id": id
        });
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afb2') {
        response = HttpResponse.json({
          "name": "mapbox1.json",
          "description": "mapbox",
          "size": 142017,
          "mime_type": "application/json",
          "labels": [
            "cartes.gouv.fr",
            "service",
            "mapbox",
            "internal"
          ],
          "_id": id
        });
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afb3') {
        response = HttpResponse.json({
          "name": "mapbox2.json",
          "description": "mapbox",
          "size": 142017,
          "mime_type": "application/json",
          "labels": [
            "cartes.gouv.fr",
            "service",
            "mapbox",
            "external"
          ],
          "_id": id
        });
      }
      return response;
    }),
    /**
     * telecharger le document
     */
    http.get('https://data.geopf.fr/api/users/me/documents/:id/file', async ({ params }) => {
      const { id } = params;
      var response = null;
      // cartes
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66aba0') {
        const buffer = await fetch('./mocks/academie.json').then(
          (response) => response.json()
        );
        response = HttpResponse.json(buffer);
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66aba1') {
        const buffer = await fetch('./mocks/insee.json').then(
          (response) => response.json()
        );
        response = HttpResponse.json(buffer);
      }
      // compute
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa0') {
        const buffer = await fetch('./mocks/Profil altimétrique.geojson').then(
          (response) => response.json()
        );
        response = HttpResponse.json(buffer);
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa1') {
        const buffer = await fetch('./mocks/isocurve (pieton).geojson').then(
          (response) => response.json()
        );
        response = HttpResponse.json(buffer);
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa2') {
        const buffer = await fetch('./mocks/itineraire (voiture).geojson').then(
          (response) => response.json()
        );
        response = HttpResponse.json(buffer);
      }
      // drawing
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa3') {
        const buffer = await fetch('./mocks/croquis1.kml').then(
          (response) => response.text()
        );
        response = HttpResponse.xml(buffer);
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa4') {
        const buffer = await fetch('./mocks/croquis2.kml').then(
          (response) => response.text()
        );
        response = HttpResponse.xml(buffer);
      }
      // import
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa5') {
        const buffer = await fetch('./mocks/regions.geojson').then(
          (response) => response.json()
        );
        response = HttpResponse.json(buffer);
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa6') {
        const buffer = await fetch('./mocks/rando_corse.gpx').then(
          (response) => response.text()
        );
        response = HttpResponse.xml(buffer);
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa7') {
        const buffer = await fetch('./mocks/decoupage_top100.kml').then(
          (response) => response.text()
        );
        response = HttpResponse.xml(buffer);
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afa8') {
        const buffer = await fetch('./mocks/regions.json').then(
          (response) => response.json()
        );
        response = HttpResponse.json(buffer);
      }
      // service
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afb0') {
        const buffer = await fetch('./mocks/wms.json').then(
          (response) => response.json()
        );
        response = HttpResponse.json(buffer);
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afb1') {
        const buffer = await fetch('./mocks/wmts.json').then(
          (response) => response.json()
        );
        response = HttpResponse.json(buffer);
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afb2') {
        const buffer = await fetch('./mocks/mapbox1.json').then(
          (response) => response.json()
        );
        response = HttpResponse.json(buffer);
      }
      if (id === '3fa85f64-5717-4562-b3fc-2c963f66afb3') {
        const buffer = await fetch('./mocks/mapbox2.json').then(
          (response) => response.json()
        );
        response = HttpResponse.json(buffer);
      }
      return response;
    })
  ),
  error : [
    /**
     * echec sur l'obtention du token
     */
    http.post('https://sso.geopf.fr/realms/geoplateforme/protocol/openid-connect/token', async ({ request }) => {
      return new HttpResponse(null, { status: 404 })
    }),
    /**
     * echec sur l'obtention des informations de l'utilisateur
     */
    http.get('https://data.geopf.fr/api/users/me', async ({ request }) => {
      return new HttpResponse(null, { status: 401 })
    }),
    /**
     * echec sur l'obtention des documents de l'utilisateur
     */
    http.get('https://data.geopf.fr/api/users/documents', async ({ request }) => {
      return new HttpResponse(null, { status: 401 })
    })
  ]
}