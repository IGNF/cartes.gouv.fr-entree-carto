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

import { DEFAULT_STYLE } from './style';
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
 * @property {*} options.name
 * @property {*} options.description
 * @property {*} options.format
 * @property {*} options.extended - mode étendu des formats
 * @property {*} options.data | @property {*} options.url
 * @fixme hack sur le format GPX à reporter sur les extensions !
 */
const createVectorLayer = (options) => {
  try {
    var vectorFormat = null;
    var vectorSource = null;
    var vectorLayer = null;
  
    var extended = (options.extended === undefined) ? true : options.extended;
    switch (options.format.toLowerCase()) {
      case "geojson":
        vectorFormat = new GeoJSON(); 
        // Extended
        if (extended) {
          vectorFormat = new GeoJSONExtended({
            defaultStyle : DEFAULT_STYLE
          }); 
        }
        break;
      case "kml":
        vectorFormat = new KML();
        // Extended
        if (extended) {
          vectorFormat = new KMLExtended({
            defaultStyle : DEFAULT_STYLE
          }); 
        }
        break;
      case "gpx":
        vectorFormat = new GPX();
        // Extended
        if (extended) {
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
  
    vectorSource._title = options.name;
    vectorSource._description = options.description;
  
    vectorLayer = new VectorLayer({
      source : vectorSource,
      visible : getVisible(options.visible),
      opacity : getOpacity(options.opacity)
    });
  
    if (!vectorLayer) {
      throw new Error(t.ol.failed_layer("vecteur"));
    }
  
    vectorLayer.gpResultLayerId = "bookmark:" +  options.type + "-" + options.format.toLowerCase() + ":" + options.id;
    // permalink
    vectorLayer.set("permalink", options.permalink || false);

    return Promise.resolve(vectorLayer);
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Creation d'une couche de type vecteur pour les calculs suivants :
 * - Route
 * - Isocurve
 * - Profil (?)
 * 
 * On transmet le fichier GeoJSON avec le type internal
 * 
 * Les options
 * @param {*} options 
 * @property {*} options.id - uuid de l'API Entrepôt
 * @property {*} options.name
 * @property {*} options.description
 * @property {*} options.format
 * @property {*} options.compute
 * @property {*} options.data | @property {*} options.url
 */
const createComputeLayer = (options) => {
  try {
    var vectorFormat = null;
    var vectorSource = null;
    var vectorLayer = null;
  
    vectorFormat = new GeoJSON(); 
    // Extended
    var extended = (options.extended === undefined) ? true : options.extended;
    if (extended) {
      vectorFormat = new GeoJSONExtended({
        defaultStyle : DEFAULT_STYLE
      }); 
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
        // url: options.url
        loader : function (extent, resolution, projection, success, failure) {
          const mapProj = projection.getCode();
          const xhr = new XMLHttpRequest();
          xhr.open('GET', options.url);
          const onError = function() {
            vectorSource.removeLoadedExtent(extent);
            failure();
          }
          xhr.onerror = onError;
          xhr.onload = function() {
            if (xhr.status === 200) {
              var fileProj = vectorFormat.readProjection(xhr.responseText);
              const features = vectorFormat.readFeatures(xhr.responseText, {
                dataProjection : fileProj,
                featureProjection : mapProj
              });
              vectorSource.addFeatures(features);
              success(features);
            } else {
              onError();
            }
          }
          xhr.send();
        }
      });
    }
  
    if (!vectorSource) {
      throw new Error(t.ol.failed_source("compute"));
    }
  
    vectorSource._title = options.name;
    vectorSource._description = options.description;
  
    vectorLayer = new VectorLayer({
      source : vectorSource,
      visible : getVisible(options.visible),
      opacity : getOpacity(options.opacity)
    });
  
    if (!vectorLayer) {
      throw new Error(t.ol.failed_layer("compute"));
    }
  
    vectorLayer.gpResultLayerId = "bookmark:" +  options.type + "-" + options.compute.toLowerCase() + ":" + options.id;
    
    const failedLoadData = () => {
      throw new Error(t.ol.failed_layer("compute"));
    }
    const successLoadData = (e) => {
      // cette couche est elle une couche de calcul ?
      var config = vectorFormat.readRootExtensions("geoportail:compute");
      if (!config || Object.keys(config).length === 0) {
        throw new Error(t.ol.failed_layer("compute"));
      }
      // type de controle
      vectorLayer.set("control", options.compute); // ex. route ou isocurve
      // on enregistre la configuration
      vectorLayer.set("data", config);
      // on reecrit un geojson proprement sans la configuration
      var format = new GeoJSONExtended({
        defaultStyle : DEFAULT_STYLE
      });
      var geojson = format.writeFeatures(e.features, {
          dataProjection : "EPSG:4326",
          featureProjection : "EPSG:3857"
      });
      vectorLayer.set("geojson", geojson);
    };

    vectorLayer.getSource().once("featuresloadend", successLoadData);
    vectorLayer.getSource().once("featuresloaderror", failedLoadData);

    return Promise.resolve(vectorLayer);
  } catch (error) {
    return Promise.reject(error);
  }
}

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
 * @property {*} options.format
 * @property {*} options.kind
 * @property {*} options.data | @property {*} options.url
 * @fixme extent à récuperer dans les getCapabilities ?
 */
const createServiceLayer = (options) => {

  var createLayer = (options) => {
    var tileLayer = null;

    if (typeof options.data === 'string') {
      options.data = JSON.parse(options.data);
    }

    if (options.kind === "wmts") {
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
    
      sourceWMTS._title = options.data.name || options.name;
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
      
    } else if (options.kind === "wms") {
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
        
      sourceTileWMS._title = options.data.name || options.name;
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
        
    } else {
      throw new Error(t.ol.failed_source("service non reconnu"));
    }
    
    // extent par defaut
    if (tileLayer && !tileLayer.getExtent()) {
      const projection = getProjection('EPSG:3857');
      tileLayer.setExtent(projection.getExtent());
    }
      
    // id
    if (tileLayer) {
      tileLayer.gpResultLayerId = "bookmark:" +  options.kind.toLowerCase() + ":" + options.id;
    }
      
    tileLayer.setVisible(getVisible(options.visible));
    tileLayer.setOpacity(getOpacity(options.opacity));

    return tileLayer;
  }

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
 * @property {*} options.name
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
        state : "loading", // statut
        attributions : "",
        format : vectorFormat,
        urls : _glTiles
      });

      vectorSource._title = options.name;
      vectorSource._description = options.description;

      vectorLayer = new VectorTileLayer({
        source : vectorSource,
        visible : false,
        declutter : true
      });

      vectorLayer.gpResultLayerId = "bookmark:" +  options.format.toLowerCase() + ":" + options.id;
      vectorLayer.styleUrl = options.url; // HACK pour le N&B !

      var setStyle = () => {
        applyStyle(vectorLayer, _glStyle, { source : _glSourceId })
        .then(() => {
          vectorLayer.getSource().setState("ready");
          vectorLayer.set("mapbox-styles", _glStyle);
        })
        .then(() => {
          vectorLayer.setVisible(getVisible(options.visible));
          vectorLayer.setOpacity(getOpacity(options.opacity));
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

/**
 * Fonction pour récupérer la visibilité de la couche
 * @param {*} v 
 * @returns boolean
 */
const getVisible = (v) => {
  var visible = (v === undefined) ? true : v;
  if (typeof visible === "string") {
    if (visible === "true") {
      visible = true;
    } else if (visible === "false") {
      visible = false;
    } else {
      visible = true;
    }
  }
  return visible;
};

/**
 * Fonction pour récupérer l'opacité de la couche
 * @param {*} o 
 * @returns float
 */
const getOpacity = (o) => {
  var opacity = (o === undefined) ? 1 : o;
  if (typeof opacity === "string") {
    opacity = parseFloat(opacity);
  }
  if (isNaN(opacity)) {
    opacity = 1;
  }
  if (opacity < 0) {
    opacity = 0;
  }
  if (opacity > 1) {
    opacity = 1;
  }
  return opacity;
};

export {
  createVectorLayer,
  createComputeLayer,
  createServiceLayer,
  createMapBoxLayer
}