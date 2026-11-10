/**
 * @description
 * Store des objets de la carte
 *
 * Les clefs préfixées par "cartes.gouv.fr"
 * sont les paramètres utilisateurs :
 *
 * - cartes.gouv.fr.center --> webmercator
 * - cartes.gouv.fr.permalink
 * - cartes.gouv.fr.permalinkShare
 * - cartes.gouv.fr.layers
 * - cartes.gouv.fr.bookmarks
 * - cartes.gouv.fr.zoom -> absolue !
 * - cartes.gouv.fr.x --> webmercator
 * - cartes.gouv.fr.y --> webmercator
 * - cartes.gouv.fr.lon --> geographic
 * - cartes.gouv.fr.lat --> geographic
 * - cartes.gouv.fr.controls
 * - cartes.gouv.fr.geolocation
 *
 * Construction du permalien :
 *
 * - La structure des couches
 *   LAYERID(position<number>;opacity<number>;visible<boolean>;grayscale<boolean>)<Array>
 *   ex. ORTHOIMAGERY.ORTHOPHOTOS$GEOPORTAIL:OGC:WMTS(4;1;1;0)
 *    avec caractére de séparation des options de la liste : ';'
 *    et ',' pour chaque couches
 *
 *   Pour une couche de type TMS, on peut ajouter une propriété facultative "style"
 *   ex. OPENSTREETMAP$OSM:TMS(1;1;1;0;standard)
 *
 * - La structure des contrôles
 *   CONTROLID(active<boolean>;disable<boolean>;position<string>)<Array>
 *   ex. Isocurve(1;0;bottom-left)
 *   avec caractére de séparation des options de la liste : ';'
 *   et ',' pour chaque couches
 *   (!) pour le moment, on implemente tout simplement une liste des contrôles actifs !
 *
 * - La structure d'un favoris par URL de partage
 *   ex. https://data.geopf.fr/documents/1p2pDnXdwZfaCfsAkriU9UJBLO9vuKxb8M7Fna7iDrx4s1.bin?
 *    uuid=bb2903e4-4bee-4322-9fcf-de9a0d983490&
 *    name=Mon+croquis&
 *    description=export&
 *    format=kml&
 *    position=0&
 *    opacity=1&
 *    visible=1&
 *    grayscale=0
 *
 * Informations complémentaires :
 *
 * - cartes.gouv.fr.noLoginInformation --> boolean
 *   Permet de savoir si l'utilisateur a déjà eu une notification
 *   concernant l'authentification.
 *
 * - cartes.gouv.fr.permalink --> string
 *   Stocke le permalien complet de la carte
 *   Mais, la clef 'permalink=yes|no' dans l'URL permet de savoir
 *   si on doit remplacer la configuration courante
 *   par celle du permalien (yes) ou la compléter (no).
 *
 * - isRedirect() --> boolean
 *   Detecte une information de redirection après le chargement de la carte
 *   ceci permet d'informer l'utilisateur qu'il a été redirigé
 *   depuis une autre application (ex. Geoportail, GéoIDE, etc.)
 *
 * @see useUrlParams
 */
export const useMapStore: import("pinia").StoreDefinition<"map", Pick<{
    map: {};
    layers: any;
    controls: any;
    bookmarks: any;
    zoom: import("@vueuse/core").RemovableRef<number>;
    center: any;
    x: import("@vueuse/core").RemovableRef<number>;
    y: import("@vueuse/core").RemovableRef<number>;
    lon: import("@vueuse/core").RemovableRef<number>;
    lat: import("@vueuse/core").RemovableRef<number>;
    permalink: any;
    permalinkShare: any;
    geolocation: import("@vueuse/core").RemovableRef<string>;
    isRedirect: any;
    isPermalink: () => boolean;
    noLoginInformation: import("@vueuse/core").RemovableRef<boolean>;
    getTerritories: () => any;
    cleanTerritories: () => void;
    addTerritory: (json_territory: any) => void;
    removeTerritory: (json_territory: any) => void;
    addTerritories: (json_territories: any) => void;
    getMap: () => {};
    setMap: (m: any) => void;
    getLayers: () => any;
    cleanLayers: () => void;
    addLayer: (id: any, props: any) => void;
    removeLayer: (id: any) => void;
    updateLayerProperty: (id: any, props: any) => void;
    updateLayerPosition: (ids: any) => void;
    getLayerProperty: (id: any) => {
        position: number;
        opacity: number;
        visible: boolean;
        grayscale: boolean;
        style: any;
    } | undefined;
    getBookmarks: () => any;
    getBookmarksByID: () => any;
    addBookmark: (url: any) => void;
    removeBookmark: (url: any) => void;
    removeBookmarkByID: (id: any) => void;
    updateBookmark: (url: any) => void;
    updateBookmarkPropertyByID: (id: any, props: any) => void;
    getBookmarkProperty: (url: any) => any;
    getControls: () => any;
    cleanControls: () => void;
    addControl: (id: any) => void;
    removeControl: (id: any) => void;
}, any>, Pick<{
    map: {};
    layers: any;
    controls: any;
    bookmarks: any;
    zoom: import("@vueuse/core").RemovableRef<number>;
    center: any;
    x: import("@vueuse/core").RemovableRef<number>;
    y: import("@vueuse/core").RemovableRef<number>;
    lon: import("@vueuse/core").RemovableRef<number>;
    lat: import("@vueuse/core").RemovableRef<number>;
    permalink: any;
    permalinkShare: any;
    geolocation: import("@vueuse/core").RemovableRef<string>;
    isRedirect: any;
    isPermalink: () => boolean;
    noLoginInformation: import("@vueuse/core").RemovableRef<boolean>;
    getTerritories: () => any;
    cleanTerritories: () => void;
    addTerritory: (json_territory: any) => void;
    removeTerritory: (json_territory: any) => void;
    addTerritories: (json_territories: any) => void;
    getMap: () => {};
    setMap: (m: any) => void;
    getLayers: () => any;
    cleanLayers: () => void;
    addLayer: (id: any, props: any) => void;
    removeLayer: (id: any) => void;
    updateLayerProperty: (id: any, props: any) => void;
    updateLayerPosition: (ids: any) => void;
    getLayerProperty: (id: any) => {
        position: number;
        opacity: number;
        visible: boolean;
        grayscale: boolean;
        style: any;
    } | undefined;
    getBookmarks: () => any;
    getBookmarksByID: () => any;
    addBookmark: (url: any) => void;
    removeBookmark: (url: any) => void;
    removeBookmarkByID: (id: any) => void;
    updateBookmark: (url: any) => void;
    updateBookmarkPropertyByID: (id: any, props: any) => void;
    getBookmarkProperty: (url: any) => any;
    getControls: () => any;
    cleanControls: () => void;
    addControl: (id: any) => void;
    removeControl: (id: any) => void;
}, any>, Pick<{
    map: {};
    layers: any;
    controls: any;
    bookmarks: any;
    zoom: import("@vueuse/core").RemovableRef<number>;
    center: any;
    x: import("@vueuse/core").RemovableRef<number>;
    y: import("@vueuse/core").RemovableRef<number>;
    lon: import("@vueuse/core").RemovableRef<number>;
    lat: import("@vueuse/core").RemovableRef<number>;
    permalink: any;
    permalinkShare: any;
    geolocation: import("@vueuse/core").RemovableRef<string>;
    isRedirect: any;
    isPermalink: () => boolean;
    noLoginInformation: import("@vueuse/core").RemovableRef<boolean>;
    getTerritories: () => any;
    cleanTerritories: () => void;
    addTerritory: (json_territory: any) => void;
    removeTerritory: (json_territory: any) => void;
    addTerritories: (json_territories: any) => void;
    getMap: () => {};
    setMap: (m: any) => void;
    getLayers: () => any;
    cleanLayers: () => void;
    addLayer: (id: any, props: any) => void;
    removeLayer: (id: any) => void;
    updateLayerProperty: (id: any, props: any) => void;
    updateLayerPosition: (ids: any) => void;
    getLayerProperty: (id: any) => {
        position: number;
        opacity: number;
        visible: boolean;
        grayscale: boolean;
        style: any;
    } | undefined;
    getBookmarks: () => any;
    getBookmarksByID: () => any;
    addBookmark: (url: any) => void;
    removeBookmark: (url: any) => void;
    removeBookmarkByID: (id: any) => void;
    updateBookmark: (url: any) => void;
    updateBookmarkPropertyByID: (id: any, props: any) => void;
    getBookmarkProperty: (url: any) => any;
    getControls: () => any;
    cleanControls: () => void;
    addControl: (id: any) => void;
    removeControl: (id: any) => void;
}, any>>;
