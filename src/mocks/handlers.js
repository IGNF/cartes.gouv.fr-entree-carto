import { http, HttpResponse } from 'msw'
// https://mswjs.io/docs/

/**
 * les scenarios : error ou success
 * le type de scenario est configuré dans le fichier d'environnement
 */
export const handlers = {
  success : [
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
            "last_name": "dupont",
            "first_name": "antoine"
      })
    })
  ],
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
    })
  ]
}