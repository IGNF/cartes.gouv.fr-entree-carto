/**
* INFO
* Toutes les couches ajoutées sur la carte ont un ID interne
* sous la forme : bookmark:[type]-[format]:UUID
* Ceci permet de savoir que la couche est issue de l'espace personnel
* avec un UUID, et donc qu'elle est enregistrée.
*/
/**
* Creation d'une couche de type vecteur pour les formats suivants :
* - GeoJSON
* - GPX
* - KML
*
* On transmet soit :
* - une url pour le type external
* - le fichier pour le type internal
*
* Gestion des erreurs de téléchargement du fichier :
*  Par url, on met un loader pour gérer les erreurs de téléchargement du fichier.
*  La source transmet un évènement "featuresloaderror" ou "featuresloadend" selon le cas.
*  Si une exception survient, on met la source en état "error" et on stocke les détails
*  de l'erreur dans la source (propriété "error_details").
*  Un builder d'erreur est mis en place pour construire un objet Error à partir
*  des détails de l'erreur.
*
* Les options
* @param {*} options
* @property {*} options.id - uuid de l'API Entrepôt
* @property {*} options.name
* @property {*} options.description
* @property {*} options.format - format du fichier (geojson, gpx, kml)
* @property {*} options.type - type de couche (drawing, import, bookmark)
* @property {*} options.visible - boolean
* @property {*} options.opacity - float
* @property {*} options.extended - mode étendu des formats
* @property {*} options.loader - mode loader pour les url (par défaut)
* @property {*} options.data | @property {*} options.url
* @fixme hack sur le format GPX à reporter sur les extensions !
* @returns {Promise<VectorLayer>} - couche vectorielle
*/
export function createVectorLayer(options: any): Promise<VectorLayer>;
/**
* Creation d'une couche de type vecteur pour les calculs suivants :
* - Route
* - Isocurve
* - Profil (?)
*
* On transmet le fichier GeoJSON avec le type internal
*
* Gestion des erreurs de téléchargement du fichier :
*  Par url, on met un loader pour gérer les erreurs de téléchargement du fichier.
*  La source transmet un évènement "featuresloaderror" ou "featuresloadend" selon le cas.
*  Si une exception survient, on met la source en état "error" et on stocke les détails
*  de l'erreur dans la source (propriété "error_details").
*  Un builder d'erreur est mis en place pour construire un objet Error à partir
*  des détails de l'erreur.
*
* Les options
* @param {*} options
* @property {*} options.id - uuid de l'API Entrepôt
* @property {*} options.name
* @property {*} options.description
* @property {*} options.format - format du fichier (geojson)
* @property {*} options.extended - mode étendu des formats
* @property {*} options.compute - type de calcul (route, isocurve, profil)
* @property {*} options.type - type de couche (compute)
* @property {*} options.visible - boolean
* @property {*} options.opacity - float
* @property {*} options.data | @property {*} options.url
* @returns {Promise<VectorLayer>} - couche vectorielle
*/
export function createComputeLayer(options: any): Promise<VectorLayer>;
/**
* Creation d'un couche de service :
* - wmts
* - wms
*
* On transmet une liste de paramétres WMS ou WMTS.
*
* Les options
* @param {*} options
* @property {*} options.id - uuid de l'API Entrepôt
* @property {*} options.name
* @property {*} options.description
* @property {*} options.format - format du fichier (wms, wmts)
* @property {*} options.visible - boolean
* @property {*} options.opacity - float
* @property {*} options.kind - type de service (wms, wmts)
* @property {*} options.type - type de service (wms, wmts) // compatibilité avec les anciennes versions
* @property {*} options.data | @property {*} options.url
* @fixme extent à récuperer dans les getCapabilities ?
* @returns {Promise<TileLayer>} - couche de service
*/
export function createServiceLayer(options: any): Promise<TileLayer>;
/**
* Creation d'un couche mapbox
*
* INFO
* On ne gère que les styles de type vector avec des sources de type vector
* et des tuiles (tiles).
* Les autres cas ne sont pas gérés pour le moment (raster, geojson, etc.).
*
* On transmet soit :
* - une url pour le type external
* - un fichier de style pour le type internal
*
* Les options
* @param {*} options
* @property {*} options.id - uuid de l'API Entrepôt
* @property {*} options.name
* @property {*} options.description
* @property {*} options.format - format du fichier (mapbox)
* @property {*} options.visible - boolean
* @property {*} options.opacity - float
* @property {*} options.data | @property {*} options.url
* @fixme extent à récuperer
* @todo messages
* @returns {Promise<VectorTileLayer>} - couche vectorielle
*/
export function createMapBoxLayer(options: any): Promise<VectorTileLayer>;
/**
* Fonction pour transformer le format d'une couche vectorielle
* @param {*} layer - couche vectorielle (VectorLayer)
* @param {*} format - format de sortie (kml, gpx, geojson)
* @param {*} settings - options supplémentaires (defaultStyle, description)
* @returns {*} - {content: null, ext: null, mimeType: null}
*/
export function transformVectorLayerFormat(layer: any, format: any, settings: any): any;
import VectorLayer from "ol/layer/Vector";
import TileLayer from "ol/layer/Tile";
import VectorTileLayer from "ol/layer/VectorTile";
