/**
 * Composable pour la gestion du nettoyage du localStorage.
 * Usage :
 * - incrementer la VERSION dans appStore
 * - puis, configurer les clefs à nettoyer.
 * 
 * Attention : il est important que appStore soit toujours appelé avant d'utiliser
 * mapStore, car ce dernier dépend des informations initialisées par appStore !
 */

/** 
 * Suppression complète du localStorage (si clearAllItems = true)
 * @private
 */
const clearAllItems = false;

/** 
 * Liste des clefs à nettoyer par thème
 * - clean : indique si les clefs doivent être nettoyées ou non.
 * - ns : indique si les clefs sont préfixées par un namespace.
 * - value : liste des clefs à supprimer.
 * @private
 * @fixme impossible de nettoyer certaines clefs comme les logs !
 * @fixme pourquoi nettoyer les customisations clientes ? ex. noLoginInformation ou vue-dsfr-scheme
 */
const customItems = {
  view : {
    clean : false,
    ns : true,
    value : ["center", "geolocation", "x", "y", "zoom", "lon", "lat", "permalink", "permalinkShare"]
  },
  layers :  {
    clean : false,
    ns : true,
    value : ["layers", "bookmarks"],
  },
  widgets :  {
    clean : false,
    ns : true,
    value : ["controls"],
  },
  logs :  {
    clean : false,
    ns : false,
    value : ["loglevel:*"], // !?
  },
  service :  {
    clean : false,
    ns : false,
    value : ["service"], // "noLoginInformation" ?
  },
  territories :  {
    clean : false,
    ns : true,
    value : ["territories"],
  },
  theme :  {
    clean : false,
    ns : true,
    value : ["isHeaderCompact"] // "vue-dsfr-scheme" ?
  }
};

/**
 * Nettoie le localStorage en fonction d'un préfixe donné.
 * ex. "loglevel:*"
 * @param {string} item - L'item (avec éventuellement un *) des clefs à supprimer du localStorage.
 * @private
 */
const clearItemsByPrefix = (item) => {
  var prefix = item.replace('*', '');
  Object.keys(localStorage)
    .filter((key) => key.startsWith(prefix))
    .forEach((key) => localStorage.removeItem(key));
}

/**
 * Nettoie le localStorage en fonction de la configuration.
 * - Si clearAllItems = true, tout le localStorage est effacé.
 * - Sinon, seules les clefs spécifiées dans items sont vidées.
 * @param {string} namespace - Le préfixe à utiliser pour les clefs du localStorage.
 * @public
 */
export function useClearStorage(namespace) {
  if (clearAllItems) {
    localStorage.clear();
  } else {
    for (const key in customItems) {
      if (customItems[key] && customItems[key].clean) {
        customItems[key].value.forEach((item) => {
          if (customItems[key].ns) {
            localStorage.removeItem(namespace + '.' + item);
          } else {
            if (item.includes('*')) {
              clearItemsByPrefix(item);
            } else {
              localStorage.removeItem(item);
            }
          }
        });
      }
    }
  }
}