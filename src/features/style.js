
import {
  Fill,
  Icon,
  Stroke,
  Style,
  Text
} from "ol/style";

import { 
  MarkersUtils as Markers
} from 'geopf-extensions-openlayers';

/**
 * Style par défaut pour les entités géométriques
 */
export const DEFAULT_STYLE = new Style({
  image :  new Icon({
      src : Markers["lightOrange"],
      anchor : [25.5, 38],
      anchorOrigin : "top-left",
      anchorXUnits : "pixels",
      anchorYUnits : "pixels"
  }),
  stroke : new Stroke({
      color : "rgba(0,42,80,0.8)",
      width : 4
  }),
  fill : new Fill({
      color : "rgba(0, 183, 152, 0.5)"
  }),
  text : new Text({
      font : "16px Sans",
      textAlign : "left",
      fill : new Fill({
          color : "rgba(255, 255, 255, 1)"
      }),
      stroke : new Stroke({
          color : "rgba(0, 0, 0, 1)",
          width : 2
      })
  })
});