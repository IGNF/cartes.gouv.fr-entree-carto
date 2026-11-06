export default MyServiceAction;
declare class MyServiceAction {
    url: any;
    active(): void;
    disable(): void;
    send(data: any): Promise<void>;
    clear(): void;
    _getCaptchaToken(): Promise<any>;
    /**
     * @summary
     * Le code est issu de l'appli mobile Carte IGN
     */
    _send(data: any): Promise<void>;
}
