export function useActionEdit (Widget, Layer) {
  if (Widget) {
    // setGeoJSON
    if (Layer.get("geojson")) {
      // INFO
      // exception sur l'outil de mesure qui ne possède pas cette fonction
      if (typeof Widget.setGeoJSON === "function") {
        Widget.setGeoJSON(Layer.get("geojson"));
      }
    }
    // setData
    if (Layer.get("data")) {
      Widget.setData(Layer.get("data"));
    }
    // init
    if (Layer.get("control") === "route" || Layer.get("control") === "isocurve" || Layer.get("control") === "elevationpath" ||
        Widget.CLASSNAME === "Isocurve" || Widget.CLASSNAME === "Route" || Widget.CLASSNAME === "ElevationPath") {
      // setLayer
      Widget.setLayer(Layer);
      Widget.init();
    }
    // INFO
    // exception sur l'outil de mesure qui ne possède pas cette fonction  
    if (typeof Widget.setCollapsed === "function") {
      Widget.setCollapsed(false);
    }
  }
}