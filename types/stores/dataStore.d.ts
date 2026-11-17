/**
 * @description
 * Store des données
 * - les couches : layers filtrées ex. par type de service et projection
 * - les options générales
 * - tileMatrixSets
 * - contacts
 * - territoires : zones géographiques
 * - featured : c'est la mise en avant de certaines couches
 * - alertes
 * - topics : thématiques / producteurs
 */
export const useDataStore: import("pinia").StoreDefinition<"data", Pick<{
    error: any;
    isLoaded: any;
    filterProjections: string;
    filterServices: string;
    producers: any;
    themes: any;
    fetchData: () => Promise<any>;
    getTerritories: () => any;
    getContacts: () => any;
    getAlerts: () => any;
    getLayersByThematic: (thematic: any) => string[];
    getThematics: () => any;
    getLayersByProducer: (producer: any) => [string, any][];
    getProducers: () => any;
    getFeatured: () => never[];
    getLayers: () => {};
    getLayersSignatures: () => any;
    getLayerKeysByID: (id: any) => any[];
    getLayerIdByName: (name: any, service: any) => string | undefined;
    getLayerByName: (name: any, service: any) => any;
    getLayerByID: (id: any) => any;
    getLayerByTitle: (title: any) => any[];
    getTileMatrixSets: () => {};
    getTileMatrixSetByID: (id: any) => any;
    getLayerParamsByName: (name: any, service: any) => any;
    getLayerParamsByID: (id: any) => {} | null | undefined;
    getGlobalConstraintsByID: (id: any) => {} | null;
    getGlobalConstraintsByName: (name: any, service: any) => any;
    getTopics: () => never[];
}, any>, Pick<{
    error: any;
    isLoaded: any;
    filterProjections: string;
    filterServices: string;
    producers: any;
    themes: any;
    fetchData: () => Promise<any>;
    getTerritories: () => any;
    getContacts: () => any;
    getAlerts: () => any;
    getLayersByThematic: (thematic: any) => string[];
    getThematics: () => any;
    getLayersByProducer: (producer: any) => [string, any][];
    getProducers: () => any;
    getFeatured: () => never[];
    getLayers: () => {};
    getLayersSignatures: () => any;
    getLayerKeysByID: (id: any) => any[];
    getLayerIdByName: (name: any, service: any) => string | undefined;
    getLayerByName: (name: any, service: any) => any;
    getLayerByID: (id: any) => any;
    getLayerByTitle: (title: any) => any[];
    getTileMatrixSets: () => {};
    getTileMatrixSetByID: (id: any) => any;
    getLayerParamsByName: (name: any, service: any) => any;
    getLayerParamsByID: (id: any) => {} | null | undefined;
    getGlobalConstraintsByID: (id: any) => {} | null;
    getGlobalConstraintsByName: (name: any, service: any) => any;
    getTopics: () => never[];
}, any>, Pick<{
    error: any;
    isLoaded: any;
    filterProjections: string;
    filterServices: string;
    producers: any;
    themes: any;
    fetchData: () => Promise<any>;
    getTerritories: () => any;
    getContacts: () => any;
    getAlerts: () => any;
    getLayersByThematic: (thematic: any) => string[];
    getThematics: () => any;
    getLayersByProducer: (producer: any) => [string, any][];
    getProducers: () => any;
    getFeatured: () => never[];
    getLayers: () => {};
    getLayersSignatures: () => any;
    getLayerKeysByID: (id: any) => any[];
    getLayerIdByName: (name: any, service: any) => string | undefined;
    getLayerByName: (name: any, service: any) => any;
    getLayerByID: (id: any) => any;
    getLayerByTitle: (title: any) => any[];
    getTileMatrixSets: () => {};
    getTileMatrixSetByID: (id: any) => any;
    getLayerParamsByName: (name: any, service: any) => any;
    getLayerParamsByID: (id: any) => {} | null | undefined;
    getGlobalConstraintsByID: (id: any) => {} | null;
    getGlobalConstraintsByName: (name: any, service: any) => any;
    getTopics: () => never[];
}, any>>;
