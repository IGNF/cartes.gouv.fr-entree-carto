/**
 * Recherche 
 * @param {Array} array - liste d'objets
 * @param {String} search - clef à rechercher
 * @param {Array} properties - liste de properties de l'objet
 * @returns {Array} - Liste des objets contenant la recherche
 */
export function useSearchInArray(array, search, properties) {
  return array.filter((obj) => {
    const valuesByProp = new Map(Object.entries(obj || {}));
    if (properties.map((prop) => {
      const value = valuesByProp.get(prop);
      if (value && typeof value.toLowerCase === 'function' && value.toLowerCase().includes(search?.toLowerCase())) {
        return true;
      }
      return false;
    }).includes(true)) {
        return obj;
    }
  });
};