import GeoJSON from 'ol/format/GeoJSON';
import GPX from 'ol/format/GPX';
import KML from 'ol/format/KML';
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

import TileLayer from "ol/layer/Tile";
import WMTS from 'ol/source/WMTS';
import TileWMSSource from "ol/source/TileWMS";
import WMTSTileGrid from 'ol/tilegrid/WMTS';

import { get as getProjection } from 'ol/proj';

import { 
  KML as KMLExtended,
  GeoJSON as GeoJSONExtended,
  GPX as GPXExtended
} from 'geopf-extensions-openlayers';

/**
 * INFO
 * Toutes les couches ajoutées sur la carte ont un ID interne
 * sous la forme : bookmark:[type]:UUID
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
 * Les options
 * @param {*} options 
 * @property {*} options.id - uuid de l'API Entrepôt
 * @property {*} options.title
 * @property {*} options.description
 * @property {*} options.format
 * @property {*} options.extended - mode étendu des formats
 * @property {*} options.data | @property {*} options.url
 * ...
 */
const createVectorLayer = (options) => {
  var vectorFormat = null;
  var vectorSource = null;
  var vectorLayer = null;

  switch (options.format.toLowerCase()) {
    case "geojson":
      vectorFormat = new GeoJSON(); 
      // Extended
      if (options.extended) {
        vectorFormat = new GeoJSONExtended(); 
      }
      break;
    case "kml":
      vectorFormat = new KML();
      // Extended
      if (options.extended) {
        vectorFormat = new KMLExtended(); 
      }
      break;
    case "gpx":
      vectorFormat = new GPX();
      // Extended
      if (options.extended) {
        vectorFormat = new GPXExtended(); 
      }
      break;
    default:
      break;
  }

  if (!vectorFormat) {
    throw new Error("Le format n'est pas reconnu !");
  }

  if (options.data) {
    const proj = vectorFormat.readProjection(options.data);
    vectorSource = new VectorSource({
      features: vectorFormat.readFeatures(options.data, {
        dataProjection : proj,
        featureProjection : "EPSG:3857"
      }),
    });
  }

  if (options.url) {
    vectorSource = new VectorSource({
      format: vectorFormat,
      url: options.url
    });
  }

  if (!vectorSource) {
    throw new Error("La source n'est pas instanciée !");
  }

  vectorSource._title = options.title;
  vectorSource._description = options.description;

  vectorLayer = new VectorLayer({
    source : vectorSource,
    visible : true
  });

  if (!vectorLayer) {
    throw new Error("La couche n'est pas instanciée !");
  }

  vectorLayer.gpResultLayerId = "bookmark:" +  options.format.toLowerCase() + ":" + options.id;

  return vectorLayer;
};

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
 * @property {*} options.title
 * @property {*} options.description
 * @property {*} options.format
 * @property {*} options.data
 * @fixme extent à récuperer dans les getCapabilities ?
 */
const createServiceLayer = (options) => {
  var tileLayer = null;

  if (options.format === "wmts") {
    const tileGrid = new WMTSTileGrid({
      origin: [
        options.data.topLeftCorner.x,
        options.data.topLeftCorner.y
      ],
      resolutions: options.data.resolutions,
      matrixIds: options.data.matrixIds,
    });
  
    var sourceWMTS = new WMTS({
      url: options.data.url,
      version: options.data.version,
      layer: options.data.layer,
      matrixSet: options.data.tileMatrixSet,
      format: options.data.outputFormat,
      projection: 'EPSG:3857',
      tileGrid: tileGrid,
      style: options.data.styleName,
      attributions: '',
    });
  
    sourceWMTS._title = options.data.title || options.title;
    sourceWMTS._description = options.data.description || options.description;
  
    tileLayer = new TileLayer({
      // minResolution
      // maxResolution
      // extent
      source: sourceWMTS,
    });
  
  } else {
    var sourceTileWMS = new TileWMSSource({
      url : options.data.url,
      params: {
        "LAYERS": options.data.layers,    // array ?
        "SERVICE": options.data.format,
        "VERSION": options.data.version,
        "STYLES": options.data.stylesName // array ?
      },
      projection : options.data.projection || 'EPSG:3857',
      attributions: ''
    });
    
    sourceTileWMS._title = options.data.title || options.title;
    sourceTileWMS._description = options.data.description || options.description;
    
    tileLayer = new TileLayer({
      // minResolution
      // maxResolution
      // extent
      source: sourceTileWMS
    });

    // fonctionnalité pour la gpf ?
    tileLayer.gpGFIparams = {
        queryable : options.data.queryable,
        formats : options.data.gfiFormat
    };
    
  }

  // extent par defaut
  if (tileLayer && !tileLayer.getExtent()) {
    const projection = getProjection('EPSG:3857');
    tileLayer.setExtent(projection.getExtent());
  }
  // id
  if (tileLayer) {
    tileLayer.gpResultLayerId = "bookmark:" +  options.format.toLowerCase() + ":" + options.id;
  }
  
  return tileLayer;
};

/**
 * Creation d'un couche mapbox
 * 
 * On transmet soit :
 * - une url pour le type external
 * - un fichier de style pour le type internal
 * 
 * Les options
 * @param {*} options
 */
const createMapBoxLayer = (options) => {
  throw new Error("Not yet implemented !");
};

export {
  createVectorLayer,
  createServiceLayer,
  createMapBoxLayer
}