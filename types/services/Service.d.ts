export default Service;
declare class Service {
    constructor({ fetcher, emitter, api, debug }?: {
        fetcher?: typeof fetch | undefined;
        emitter?: null | undefined;
        api?: any;
        debug?: boolean | undefined;
    });
    api: any;
    documents: any;
    getGeneration(): number;
    resetDocuments(): void;
    getFetch(): (...args: any[]) => Promise<Response>;
    setFetch(fetcher: any): void;
    saveStore(): void;
    throwError(error: any): void;
    isPending(): boolean;
    stopPending(): void;
    getEmitter(): any;
    setEmitter(emitter: any): void;
    #private;
}
