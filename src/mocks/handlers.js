import { http, HttpResponse } from 'msw'
// https://mswjs.io/docs/
export const handlers = [
  /**
   * obtenir le token
   */
  http.post('https://sso.geopf.fr/realms/geoplateforme/protocol/openid-connect/token', async ({ request }) => {
    return HttpResponse.json({
      "access_token": 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJuQTM1bFJNeWVEMnU3WGJDTk9UbTRORjE0eTNoYlBMcGw4TXQtVzR3STJnIn0.eyJleHAiOjE3MzE2MTkwMDksImlhdCI6MTczMTU3NTgwOSwianRpIjoiZWFkOTNjMTAtNTRlMi00NmJkLTkwYjQtNzg5ZDFhYWFlZDJmIiwiaXNzIjoiaHR0cHM6Ly9zc28uZ2VvcGYuZnIvcmVhbG1zL2dlb3BsYXRlZm9ybWUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMzE3MGViOGYtMWIzNS00ZWZhLWEwZjktY2E0Mjk0OTMzNGY0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiY2FydGVzLWdvdXYtZGV2IiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWdlb3BsYXRlZm9ybWUiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwiZGVsZXRlLWFjY291bnQiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJjbGllbnRJZCI6ImNhcnRlcy1nb3V2LWRldiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJjbGllbnRIb3N0IjoiODIuMTQyLjIzLjQzIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWNhcnRlcy1nb3V2LWRldiIsImdpdmVuX25hbWUiOiIiLCJjbGllbnRBZGRyZXNzIjoiODIuMTQyLjIzLjQzIiwiZmFtaWx5X25hbWUiOiIiLCJlbWFpbCI6InNlcnZpY2UtYWNjb3VudC1jYXJ0ZXMtZ291di1kZXZAbm8tcmVwbHkuZnIifQ.bVsPFTWz0dY2YmEVjUyJY3wcXXUNF4vR48Z03s4pps8zQg-93dR8c_xjfrSVvLKwW8M-ynZAoAzgrjJydlaoA26wgZlfkxJu8zVKwfnQk_TFeYg-liXiv8YoES8JPL5vRPo-Yaz4JSy-vojJfdFTGx9Sw9UI2ZEfPEgxwuUL3OBuCTqVPG4N_imElCbAFYG6y1fgoGmO8FxGpamfOk16ev9-G8hy1J1heVSzeLWzQtQRuL0bMYWFmLaa0cjrvm8Hemp7Rwe5EHQ9McyQ2_Buu6IsWEYRoaqhqHUrn5MyIKnuAJZ3cZmp8bb_Gu0wFPjzrzh0J8rSy3D60ySai7RS2g',
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
    // FIXME pourquoi cette réponse !?
    // {
    //   "email": "service-account-cartes-gouv-dev@no-reply.fr",
    //   "creation": "2023-06-26T14:23:22.129728Z",
    //   "last_call": "2024-11-27T22:35:02.538240Z",
    //   "communities_member": [
    //       {
    //           "rights": [
    //               "BROADCAST",
    //               "UPLOAD",
    //               "PROCESSING",
    //               "ANNEX"
    //           ],
    //           "community": {
    //               "name": "cartes.gouv - dev",
    //               "technical_name": "cartes-gouv-dev",
    //               "datastore": "3f2efe28-bb0e-4a51-99c8-73fcdead4092",
    //               "supervisor": "e175d6c4-a03d-4ade-a769-86e8dd2bed58",
    //               "public": false,
    //               "_id": "7d583746-e3ed-4d56-b8fd-2f136014281e"
    //           }
    //       }
    //   ],
    //   "documents_quota": 500000000,
    //   "documents_use": 0,
    //   "keys_quota": 10,
    //   "keys_use": 0,
    //   "administrator": false,
    //   "technical": false,
    //   "_id": "3170eb8f-1b35-4efa-a0f9-ca42949334f4"
    // }
    return HttpResponse.json({
          "email": "jean-philippe.bazonnais@ign.fr",
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
                      "datastore": "122b878c-aad8-4507-87b2-465e664467d3",
                      "supervisor": "e175d6c4-a03d-4ade-a769-86e8dd2bed58",
                      "public": false,
                      "_id": "78068951-cebc-4aec-869c-81677d211d0e"
                  }
              },
              {
                  "rights": [
                      "UPLOAD",
                      "PROCESSING",
                      "COMMUNITY",
                      "BROADCAST",
                      "ANNEX"
                  ],
                  "community": {
                      "name": "cartes.gouv.fr-config",
                      "technical_name": "cartes.gouv.fr-config",
                      "datastore": "5cb4fdb0-6f6c-4422-893d-e04564bfcc10",
                      "supervisor": "09e091dc-51d5-4c04-9637-3045df5ce477",
                      "public": false,
                      "_id": "f7d7279b-043f-413f-a3a3-317f1c6b5b07"
                  }
              }
          ],
          "documents_quota": 500000000,
          "documents_use": 8610,
          "keys_quota": 10,
          "keys_use": 0,
          "technical": false,
          "administrator": false,
          "_id": "09e091dc-51d5-4c04-9637-3045df5ce477",
          "last_name": "bazonnais",
          "first_name": "jean-philippe"
    })
  })
]