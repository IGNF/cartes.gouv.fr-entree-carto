/**
 * @description
 * Fonction générique pour executer une requête
 * 
 * @param {*} url - url
 * @param {*} settings - configuration de la requête
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
      var auth = JSON.parse(key).authenticated;
      if (auth && Object.keys(auth).length !== 0) {
        var authToken = auth.access_token;
        var authType  = "Bearer";
        settings.headers['Authorization'] = authType + " " + authToken;
      }
    }
  }

  try {
    const response = await fetch(url, settings);
    if (response.ok) {
      response.json()
        .then(function (data) {
          console.log(data);
          return data;
        })
        .catch(function (error) {
          throw new Error('Fetch parsing error : ' + error.message);
        });
    } else {
      // FIXME 
      // throw new Error('Not handled exception !?');
    }
  } catch (error) {
    throw error;
  }
};