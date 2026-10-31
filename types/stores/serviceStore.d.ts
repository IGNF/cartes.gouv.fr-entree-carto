export const useServiceStore: import("pinia").StoreDefinition<"service", {
    documents: {};
    authentificated: boolean;
}, {
    isAuthentificated: (state: {
        documents: {};
        authentificated: boolean;
    } & import("pinia").PiniaCustomStateProperties<{
        documents: {};
        authentificated: boolean;
    }>) => boolean;
}, {
    setDocuments(documents: any): void;
    setAuthentificated(b: any): void;
    getAuthentificated(): boolean;
}>;
