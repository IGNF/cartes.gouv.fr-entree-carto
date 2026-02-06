import { 
  KML as KMLExtended,
  GeoJSON as GeoJSONExtended,
  GPX as GPXExtended
} from 'geopf-extensions-openlayers';

import { DEFAULT_STYLE } from './style';

/**
 * Convert content from one format to another
 * Limited to GeoJSON, KML, GPX for now
 * @param {String} content 
 * @param {String} fromFormat 
 * @param {String} toFormat 
 */
export function convert(content, fromFormat, toFormat) {
  // parse content
  let features = [];
  let format = null;
  switch (fromFormat.toLowerCase()) {
    case 'geojson':
        format = new GeoJSONExtended({
          defaultStyle : DEFAULT_STYLE
        });
        features = format.readFeatures(content, { featureProjection: 'EPSG:3857' });
      break;
    case 'kml':
        format = new KMLExtended({
          defaultStyle : DEFAULT_STYLE
        });
        features = format.readFeatures(content, { featureProjection: 'EPSG:3857' });
      break;
    case 'gpx':
        format = new GPXExtended({
          defaultStyle : DEFAULT_STYLE,
          readExtensions : function (feature, node) {
            this.readExtensions(feature, node);
          }
          
        });
        features = format.readFeatures(content, { featureProjection: 'EPSG:3857' });
      break;
    default:
      throw new Error(`Unsupported fromFormat: ${fromFormat}`);
  }

  // write content in target format
  let result = {
    mimeType: '',
    content: '',
    ext: ''
  };
  switch (toFormat.toLowerCase()) {
    case 'geojson':
        format = new GeoJSONExtended({
          defaultStyle : DEFAULT_STYLE
        });
        result.content = format.writeFeatures(features, { featureProjection: 'EPSG:3857' });
        result.mimeType = 'application/geo+json';
        result.ext = 'geojson';
      break;
    case 'kml':
        format = new KMLExtended({
          defaultStyle : DEFAULT_STYLE
        });
        result.content = format.writeFeatures(features, { featureProjection: 'EPSG:3857' });
        result.mimeType = 'application/vnd.google-earth.kml+xml';
        result.ext = 'kml';
      break;
    case 'gpx':
        format = new GPXExtended({
          defaultStyle : DEFAULT_STYLE
        });
        result.content = format.writeFeatures(features, { featureProjection: 'EPSG:3857' });
        result.mimeType = 'application/gpx+xml';
        result.ext = 'gpx';
      break;
    default:
      throw new Error(`Unsupported toFormat: ${toFormat}`);
  }

  return result;
}