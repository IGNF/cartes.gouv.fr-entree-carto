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
export function createBusEvent(options: any): BusEvent;
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
export function useBusEvent(): BusEvent;
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
    constructor(options: any);
    emitter: import("mitt").Emitter<Record<import("mitt").EventType, unknown>>;
    /**
     * Ajout d'un écouteur
     * @param {*} eventName
     * @param {*} callback
     * @public
     */
    public addEventListener(eventName: any, callback: any): void;
    /**
     * Suppression de l'écouteur
     * @param {*} eventName
     * @param {*} callback
     * @public
     */
    public removeEventLstener(eventName: any, callback: any): void;
    /**
     * Envoi d'un evenement
     * @param {*} eventName
     * @param {*} data
     * @public
     */
    public dispatchEvent(eventName: any, data: any): void;
    /**
     * Installation du plugin
     * @param {*} app
     * @example
     * // Utilisation d'un inject/provide
     * var bus = inject('emitter');
     */
    install(app: any): void;
}
