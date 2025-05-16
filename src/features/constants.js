/**
 * Gestion des noms de couches internes (...)
 * @todo à mettre en place
 */
var InternalName = {
  /** Tous les noms d'ID interne possibles */
  names : [
    // computes-isocurve
    "bookmark:compute-isocurve",
    "compute:Pieton$GEOPORTAIL:GPP:Isocurve",
    "compute:Voiture$GEOPORTAIL:GPP:Isocurve",
    // compute-route
    "bookmark:compute-route",
    "compute:Pieton$OGC:OPENLS;Itineraire",
    "compute:Voiture$OGC:OPENLS;Itineraire",
    // croquis
    "drawing",
    "bookmark:drawing-kml",
    // import vecteur
    "layerimport:kml",
    "layerimport:gpx",
    "layerimport:geojson",
    "bookmark:import-kml",
    "bookmark:import-gpx",
    "bookmark:import-geojson",
    // compute-profil
    // import services
    // mapbox
  ],
  isBookmark : (id) => {
    return (this.names.includes(id.toLowerCase()) && id.toLowerCase().includes("bookmark"));
  },
  isCompute : (id) => {
    return (this.names.includes(id.toLowerCase()) && id.toLowerCase().includes("compute"));
  },
  isImport : (id) => {
    return (this.names.includes(id.toLowerCase()) && id.toLowerCase().includes("import"));
  },
  isDrawing : (id) => {
    return (this.names.includes(id.toLowerCase()) && id.toLowerCase().includes("drawing"));
  },
  isMapbox : (id) => {
    return true;
  },
  isService : (id) => {
    return true;
  },
  
}

export default InternalName;