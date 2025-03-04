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

// ol-mapbox-style
import { applyStyle } from 'ol-mapbox-style';
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import MVT from "ol/format/MVT";
import Feature from "ol/Feature";

import { 
  KML as KMLExtended,
  GeoJSON as GeoJSONExtended,
  GPX as GPXExtended
} from 'geopf-extensions-openlayers';

import { DEFAULT_STYLE } from './ol-style';

import t from './translation';

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
 * Les options
 * @param {*} options 
 * @property {*} options.id - uuid de l'API Entrepôt
 * @property {*} options.title
 * @property {*} options.description
 * @property {*} options.format
 * @property {*} options.extended - mode étendu des formats
 * @property {*} options.data | @property {*} options.url
 * @fixme hack sur le format GPX à reporter sur les extensions !
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
        vectorFormat = new GeoJSONExtended({
          defaultStyle : DEFAULT_STYLE
        }); 
      }
      break;
    case "kml":
      vectorFormat = new KML();
      // Extended
      if (options.extended) {
        vectorFormat = new KMLExtended({
          defaultStyle : DEFAULT_STYLE
        }); 
      }
      break;
    case "gpx":
      vectorFormat = new GPX();
      // Extended
      if (options.extended) {
        // HACK
        // modifier la classe GPXExtended dans les extensions !
        // > gestion de la callback interne readExtensions()
        vectorFormat = new GPXExtended({
          defaultStyle : DEFAULT_STYLE,
          readExtensions : function (feature, node) {
            this.readExtensions(feature, node);
          }
        }); 
      }
      break;
    default:
      break;
  }

  if (!vectorFormat) {
    throw new Error(t.ol.failed_format(options.format));
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
    throw new Error(t.ol.failed_source("vecteur"));
  }

  vectorSource._title = options.title;
  vectorSource._description = options.description;

  vectorLayer = new VectorLayer({
    source : vectorSource,
    visible : true
  });

  if (!vectorLayer) {
    throw new Error(t.ol.failed_layer("vecteur"));
  }

  vectorLayer.gpResultLayerId = "bookmark:" +  options.type + "-" + options.format.toLowerCase() + ":" + options.id;

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

    if (!sourceWMTS) {
      throw new Error(t.ol.failed_source("service wmts"));
    }

    sourceWMTS._title = options.data.title || options.title;
    sourceWMTS._description = options.data.description || options.description;
  
    tileLayer = new TileLayer({
      // minResolution
      // maxResolution
      // extent
      source: sourceWMTS,
    });

    if (!tileLayer) {
      throw new Error(t.ol.failed_layer("service wmts"));
    }
  
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

    if (!sourceTileWMS) {
      throw new Error(t.ol.failed_source("service wms"));
    }
    
    sourceTileWMS._title = options.data.title || options.title;
    sourceTileWMS._description = options.data.description || options.description;
    
    tileLayer = new TileLayer({
      // minResolution
      // maxResolution
      // extent
      source: sourceTileWMS
    });

    if (!tileLayer) {
      throw new Error(t.ol.failed_layer("service wms"));
    }

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
 * @property {*} options.id - uuid de l'API Entrepôt
 * @property {*} options.title
 * @property {*} options.description
 * @property {*} options.format
 * @property {*} options.data | @property {*} options.url
 * @fixme extent à récuperer
 * @todo messages
 */
const createMapBoxLayer = (options) => {

  const createLayer = (options) => {
    var vectorLayer = null;

    var _glStyle = options.data;
    var _glSources = _glStyle.sources;
    var _glSourceId = Object.keys(_glSources)[0]; // first source only !
    var _glSource = _glSources[_glSourceId]; 
    var _glType = _glSource.type; // type vector only !
    if (_glType === "vector") {
      var _glTiles = _glSource.tiles; // tiles only !
      if (!_glTiles) {
        throw new Error("Source 'tiles' uniquement !");
      }

      var vectorFormat = new MVT({
        featureClass : Feature
      });

      var vectorSource = new VectorTileSource({
        attributions : "",
        format : vectorFormat,
        urls : _glTiles
      });

      vectorSource._title = options.title;
      vectorSource._description = options.description;

      vectorLayer = new VectorTileLayer({
        source : vectorSource,
        visible : false,
        declutter : true
      });

      vectorLayer.gpResultLayerId = "bookmark:" +  options.format.toLowerCase() + ":" + options.id;

      var setStyle = () => {
        applyStyle(vectorLayer, _glStyle, { source : _glSourceId })
        .then(() => {
          vectorLayer.setVisible(true);
          vectorLayer.setOpacity(1);
        })
        .catch((e) => {
          throw e;
        });
      };

      if (vectorLayer.getSource()) {
        setStyle();
      } else {
        vectorLayer.once("change:source", setStyle);
      }
    } else {
      throw new Error("Type 'vector' uniquement !");
    }
    return vectorLayer;
  };

  if (options.url) {
    return fetch(options.url)
    .then((response) => {
      if (response.ok) {
        return response.json()
          .then((data) => {
            return createLayer({
              ...options,
              ...{
                data : data
              }
            });
          })
          .catch((e) => {
            throw e;
          });
      }
    })
    .catch((e) => {
      throw e;
    });
  }

  if (options.data) {
    try {
      var layer = createLayer(options);
      return Promise.resolve(layer);
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

export {
  createVectorLayer,
  createServiceLayer,
  createMapBoxLayer
}