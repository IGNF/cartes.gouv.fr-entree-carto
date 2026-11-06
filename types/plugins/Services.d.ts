export function createServices(options: any): PluginServices;
export function useServices(): any;
export class PluginServices {
    /**
     * constructeur
     * @param {*} options
    */
    constructor(options: any);
    instance: any;
    /**
     * Installation du plugin
     * @param {*} app
     */
    install(app: any): void;
}
