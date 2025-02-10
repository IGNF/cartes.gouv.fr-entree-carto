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
    "service:documents:loaded",
    "service:user:loaded",
    // composants
    "catalog:open:clicked",
    // widgets
    "drawing:open:clicked",
    "drawing:edit:clicked",
    "drawing:saved",
    "layerimport:open:clicked",
    "layerimport:vector:saved",
    "layerimport:compute:saved",
    "layerimport:mapbox:saved",
    "layerimport:service:saved"
  ]
};

export default EVENTS;
