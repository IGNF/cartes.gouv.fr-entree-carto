/**
 *  Creation d'une instance
 *
 * @param {*} options
 * @returns {Eulerian}
 * @public
 * @example
 * import { createEulerian } from 'vue-eulerian-plugin';
 *
 * const eulerian = createEulerian({
 *  domain: "exemple.com", // domaine de tracking Eulerian
 *  site: {
 *    environment: isProduction ? "production" : "development",
 *    entity: "Exemple"
 *   }
 * })
 *
 * createApp(App)
 *  .use(eulerian)
 *  .mount('#app');
 */
export function createEulerian(options: any): Eulerian;
/**
 * Utilisation d'une instance
 *
 * @returns {Eulerian}
 * @public
 * @example
 * import { useEulerian } from 'vue-eulerian-plugin';
 *
 * const eulerian = useEulerian();
 * eulerian.enable();
 * eulerian.disable();
 * eulerian.isDisabled();
 * eulerian.getKey();
 * eulerian.setKey();
 */
export function useEulerian(): Eulerian;
/**
 * Gestion de la collecte via Eulerian
 * @see https://github.com/GouvernementFR/dsfr/blob/main/src/analytics/doc/analytics.md
 */
export class Eulerian {
    /**
     * constructeur
     * @param {*} options
     * @see https://github.com/GouvernementFR/dsfr/blob/main/src/analytics/example/spa/vue/config.ejs
     */
    constructor(options: any);
    options: any;
    /**
     * Chargement de l'API Analytics Eulerain
     */
    load(): Promise<void>;
    /**
     * Activation de la collecte
     * @public
     */
    public start(): void;
    /**
     * Desactivation de la collecte
     * @public
     */
    public stop(): void;
    /**
     * Installation du plugin
     * @param {*} app
     */
    install(app: any): void;
}
