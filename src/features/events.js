/**
 * Registre des evenements globaux
 * 
 * @example
 * const emitter = inject('emitter');
 * emitter.addEventListener("test:clicked", (e) => { console.log(e); });
 * emitter.dispatchEvent("test:clicked", { data : "ceci est un test !" });
 */
var EVENTS = {
  /**
   * Verifier si l'évenement est dans le registre
   * @param {*} eventName 
   * @returns {Boolean}
   */
  isNotRegistered: (eventName) => {
    return !EVENTS.eventsName.includes(eventName);
  },

  /**
   * Liste des evenements
   * @fixme convention d'écriture ? ex. componentname:eventtype
   */
  eventsName: [
    "test:clicked",
    // service
    "service:changed",
    "service:documents:loaded",
    "service:user:loaded",
    // document
    "document:saved",
    "document:updated",
    "document:deleted",
    "document:exported",
    "document:shared",
    // widgets
    "catalog:open:clicked",
    "drawing:open:clicked",
    "layerimport:open:clicked",
    "searchengine:open:displayed",
    // edition
    "vector:edit:clicked",
    "mapbox:edit:clicked",
    "service:edit:clicked",
    "compute-route:edit:clicked",
    "compute-isocurve:edit:clicked",
    "compute-profil:edit:clicked"
  ]
};

export default EVENTS;
