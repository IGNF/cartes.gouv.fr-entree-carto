export function createMatomo(options: any): PluginMatomo;
export function useMatomo(): any;
export class PluginMatomo {
    /**
     * constructeur
    */
    constructor(options: any);
    options: any;
    hasCookie(name: any, cookie?: string): boolean;
    isAnalyticsOptedOut({ cookie }?: {
        cookie?: string | undefined;
    }): boolean;
    initAnalytics(): Promise<undefined>;
    /**
     * Installation du plugin
     * @param {*} app
     */
    install(app: any): void;
}
