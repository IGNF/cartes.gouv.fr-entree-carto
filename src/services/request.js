
/**
 * @description
 * Fonction générique pour executer une requête
 * 
 * @param {*} url - url
 * @param {*} settings - configuration de la requête
 * @todo utiliser https://vueuse.org/core/useFetch/
 * @example
 * useRequest(url, { method: "GET"})
 *   .then((res) => {})
 *   .catch((e) => { console.error(e.message); });
*/
export async function useRequest(url, settings) {
  // On peut ajouter les infos dans le header de la requête
  // si on a une authentification
  if (localStorage) {
    var key = localStorage.getItem("auth");
    if (key) {
      console.debug("get auth from localStorage", key);
      var auth = JSON.parse(key).authenticated;
      if (auth && Object.keys(auth).length !== 0) {
        var authToken = auth.access_token;
        var authType  = "Bearer";
        settings.headers['Authorization'] = authType + " " + authToken;
      }
    }
  }

  return fetch(url, settings)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP status error : ${response.status}`);
      }
      return response.json()
        .then((data) => {
          console.debug("response request from " + url, data);
          return data;
        })
        .catch((e) => {
          throw new Error(`Fetch parsing error : ${e.message}`);
        })
        .finally(() => {
          // ...
        });
    })
    .catch((e) => {
      throw new Error(`Error : ${e.message}`);
    });
};