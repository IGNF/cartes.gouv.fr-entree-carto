/**
 * Recherche 
 * @param {Array} array - liste d'objets
 * @param {String} search - clef à rechercher
 * @param {Array} properties - liste de properties de l'objet
 * @returns {Array} - Liste des objets contenant la recherche
 */
export function useSearchInArray(array, search, properties) {
  return array.filter((obj) => {
    if (properties.map(prop => {
        if (obj.hasOwnProperty(prop) &&
          obj[prop]?.toLowerCase().includes(search?.toLowerCase()))
          return true;
      }).includes(true)) {
        return obj;
    }
  });
};