import { inject } from 'vue';
import { onMounted, onUnmounted } from 'vue';

import mitt from 'mitt';
import events from '@/features/events';

/**
 * Nom du plugin
 */
const busEventSymbol = Symbol('vue-bus-event-plugin');

/**
 * Gestion des evenements globaux via un bus
 * @see https://github.com/developit/mitt
 * @todo liste des evenements definis
 */
export class BusEvent {
  /**
   * constructeur
   * @param {*} options
   */
  constructor(options) {
    console.debug("bus", options);
    this.emitter = mitt();
    return this;
  }

  /**
   * Ajout d'un écouteur
   * @param {*} eventName 
   * @param {*} callback 
   * @public
   */
  addEventListener(eventName, callback) {
    if (events.isNotRegistered(eventName)) {
      return;
    }
    onMounted(() => this.emitter.on(eventName, callback));
    onUnmounted(() => this.emitter.off(eventName, callback));
  }

  /**
   * Suppression de l'écouteur
   * @param {*} eventName 
   * @param {*} callback 
   * @public
   */
  removeEventLstener(eventName, callback) {
    if (events.isNotRegistered(eventName)) {
      return;
    }
    this.emitter.off(eventName, callback);
  }

  /**
   * Envoi d'un evenement
   * @param {*} eventName 
   * @param {*} data 
   * @public
   */
  dispatchEvent(eventName, data) {
    if (events.isNotRegistered(eventName)) {
      console.error("L'évenement n'a pas été enregistré dans le registre !");
      return;
    }
    console.debug("dispatchEvent", eventName, this);
    this.emitter.emit(eventName, data);
  }

  /**
   * Installation du plugin
   * @param {*} app 
   * @example
   * // Utilisation d'un inject/provide
   * var bus = inject('emitter');
   */
  install(app) {
    app.provide(busEventSymbol, this);
    app.config.globalProperties.$emitter = this;
    app.provide('emitter', this);
  }
}

/**
 * Creation d'une instance
 * @param {*} options 
 * @returns {BusEvent}
 * @public
 * @example
 * import { createBusEvent } from 'vue-bus-event-plugin';
 * 
 * const bus = createBusEvent()
 * 
 * createApp(App)
 *  .use(bus)
 *  .mount('#app');
 */
export function createBusEvent(options) {
  return new BusEvent(options);
}

/**
 * Utilisation d'une instance
 * @returns {BusEvent}
 * 
 * @public
 * @example
 * import { useBusEvent } from 'vue-bus-event-plugin';
 * 
 * const bus = useBusEvent();
 * bus.addEventListener("event", (e) => {...})
 * bus.dispatchEvent("event", {})
 */
export function useBusEvent() {
  const busEvent = inject(busEventSymbol);
  return busEvent;
}
