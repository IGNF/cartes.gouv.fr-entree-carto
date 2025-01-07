import GeoJSON from 'ol/format/GeoJSON';
import GPX from 'ol/format/GPX';
import KML from 'ol/format/KML';
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

import { 
  KML as KMLExtended,
  GeoJSON as GeoJSONExtended,
  GPX as GPXExtended
} from 'geopf-extensions-openlayers';

/**
 * Creation d'une couche de type vecteur pour les formats suivants :
 * - GeoJSON
 * - GPX
 * - KML
 * 
 * Toutes les couches vecteurs ajoutées sur la carte ont un ID interne
 * sous la forme : bookmark:[type]:UUID
 * Ceci permet de savoir que la couche est issue de l'espace personnel
 * avec un UUID, et donc qu'elle est enregistrée.
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
  });false

  if (!vectorLayer) {
    throw new Error("La couche n'est pas instanciée !");
  }

  vectorLayer.gpResultLayerId = "bookmark:" +  options.format.toLowerCase() + ":" + options.id;

  return vectorLayer;
};

export {
  createVectorLayer
}