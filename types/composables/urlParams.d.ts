/**
 * Lecture du permalink pour y extraire les informations.
 * La structure est identique au permalien de la carte
 * avec quelques paramètres supplementaires :
 * - centre : ...
 * - x / y : ...
 * - lon / lat : ...
 * - layers : ...
 * - bookmarks : ...
 * - controls : ...
 * - zoom : ...
 * - geolocation : ...
 * - permalink : yes | no
 * - redirect : url de redirection
 *
 * @example
 * http://localhost:5173/cartes.gouv.fr-entree-carto/embed?
 * &c=-4.088682731825065,47.99263846894371
 * &z=10
 * &l=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2$GEOPORTAIL:OGC:WMTS(1;1;0),ACCES.BIOMETHANE$GEOPORTAIL:OGC:WMTS(0.47;1;0)
 * &d=https://data.geopf.fr/documents/1p2pDnXdwZfaCfsAkriU9UJBLO9vuKxb8M7Fna7iDrx4s1.bin?uuid=bb2903e4-4bee-4322-9fcf-de9a0d983490&name=Mon+croquis&description=export&format=kml&opacity=1&visible=1&grayscale=0
 * &permalink=yes
 *
 * @see mapStore
 */
export function useUrlParams(url: any): {
    lon: number;
    lat: number;
    x: number;
    y: number;
    center: number[];
    layers: any;
    bookmarks: any;
    zoom: number;
    geolocation: any;
    permalink: any;
    sid: any;
    redirect: any;
};
