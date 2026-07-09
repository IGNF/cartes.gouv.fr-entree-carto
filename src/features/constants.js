/**
 * Gestion des noms de couches internes issus des 
 * - widgets
 * - favoris
 * pour les données de type vecteurs / computes / mapbox et services
 * 
 * @todo à mettre en place
 */
var InternalName = {
  /** Liste de tous les noms d'ID interne possibles */
  names : [
    // computes-isocurve
    "bookmark:compute-isocurve",
    "compute:pieton$geoportail:gpp:isocurve",
    "compute:voiture$geoportail:gpp:isocurve",
    // compute-route
    "bookmark:compute-route",
    "compute:pieton$ogc:openls;itineraire",
    "compute:voiture$ogc:openls;itineraire",
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
    "measure:profil",
    "bookmark:compute-profil",
    // TODO import services
    // TODO mapbox
  ],
  isBookmark : function (id) {
    return (this.names.includes(id.toLowerCase()) && id.toLowerCase().includes("bookmark"));
  },
  isCompute : function (id) {
    return (this.names.includes(id.toLowerCase()) && id.toLowerCase().includes("compute"));
  },
  isImport : function (id) {
    return (this.names.includes(id.toLowerCase()) && id.toLowerCase().includes("import"));
  },
  isDrawing : function (id) {
    return (this.names.includes(id.toLowerCase()) && id.toLowerCase().includes("drawing"));
  }
}

export default InternalName;