/**
 * Gestion des noms de couches internes issus des 
 * - widgets
 * - favoris
 * pour les données de type vecteurs ou computes
 * 
 * @todo à mettre en place
 */
var InternalName = {
  /** Tous les noms d'ID interne possibles */
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