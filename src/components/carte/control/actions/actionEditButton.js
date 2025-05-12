export function useActionEdit (Widget, Layer) {
  if (Widget) {
    Widget.setCollapsed(false);
    // setGeoJSON
    if (Layer.get("geojson")) {
      Widget.setGeoJSON(Layer.get("geojson"));
    }
    // setData
    if (Layer.get("data")) {
      Widget.setData(Layer.get("data"));
    }
    // init
    if (Layer.get("control") === "route" || Layer.get("control") === "isocurve") {
      // setLayer
      Widget.setLayer(Layer);
      Widget.init();
    }
  }
}