<template>
  <div>
    <!-- Affichage ou chargement dynamique selon le slug -->
    <h1>Chargement du plan : {{ city }}</h1>
  </div>
</template>

<script setup lang="js">
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import View from 'ol/View';
import { transformExtent as olTransformExtent } from 'ol/proj';

import { getCityInfo } from '@/features/cityinfo';
import { getLayersFromPermalink } from '@/features/permalink.js';

const route = useRoute();
const router = useRouter();

// Parsing du slug qui est un chemin 
// ex: "75056/Paris"
let slug = route.params.slug;
let slugArray = [];
if (Array.isArray(slug)) {
  slugArray = slug;
} else if (typeof slug === 'string') {
  slugArray = slug.split('/');
}

let insee = slugArray[0];  // code INSEE
let city  = slugArray[1];  // nom de la ville : informatif

// Informations sur la ville
let cityinfo = {};

const getZoomFromExtent = (bbox) => {
  if (!bbox || bbox.length !== 4) {
    return 10;
  }

  const size = [
    Math.max(320, window.innerWidth || 1024),
    Math.max(320, window.innerHeight || 768)
  ];

  const view = new View({
    projection: 'EPSG:3857',
    minZoom: 0,
    maxZoom: 21
  });

  const extent = olTransformExtent(bbox, 'EPSG:4326', 'EPSG:3857');
  view.fit(extent, {
    size,
    padding: [40, 40, 40, 40],
    maxZoom: 21
  });

  const zoom = view.getZoom();
  return Number.isFinite(zoom) ? Math.round(zoom) : 10;
};

const createPermalinkUrl = () => {
  // ex.
  // http://localhost:5173/cartes.gouv.fr-entree-carto?
  // c=2.613125,48.690437&
  // z=14&
  // l=
  //   ORTHOIMAGERY.ORTHOPHOTOS$GEOPORTAIL:OGC:WMTS(1;1;1;0),
  //   TN.RoadTransportNetwork.RoadLink$GEOPORTAIL:OGC:WMTS(2;1;1;0),
  //   GEOGRAPHICALNAMES.NAMES$GEOPORTAIL:OGC:WMTS(3;1;1;0)&
  // permalink=yes
  
  const center = `${cityinfo.centre[0].toFixed(6)},${cityinfo.centre[1].toFixed(6)}`;
  const bbox = [
    cityinfo.enveloppe.lowerCorner[0],
    cityinfo.enveloppe.lowerCorner[1],
    cityinfo.enveloppe.upperCorner[0],
    cityinfo.enveloppe.upperCorner[1]
  ];
  const zoom = getZoomFromExtent(bbox);
  const layers = [
    "ORTHOIMAGERY.ORTHOPHOTOS$GEOPORTAIL:OGC:WMTS(1;1;1;0)",
    "TN.RoadTransportNetwork.RoadLink$GEOPORTAIL:OGC:WMTS(2;1;1;0)",
    "GEOGRAPHICALNAMES.NAMES$GEOPORTAIL:OGC:WMTS(3;1;1;0)"
  ];

  var last = location.pathname.slice(-1);
  var path = (last === "/") ? location.pathname.slice(0, -1) : location.pathname;
  var realpath = path.replace(/\/plan\/.*/, "");
  var url = location.origin + realpath;

  var permalink = `${url}?c=${center}&z=${Math.round(zoom)}`;
  permalink += `&l=${layers.join(',')}`;

  return permalink + "&permalink=yes";
};

// Pour exploiter ce JSON dans la page de destination, 
// il suffira de lire $route.state.cityinfo.
// Par exemple, dans la page de destination :
// const route = useRoute();
// const cityinfo = route.state.cityinfo; // contient les données de la ville
// On place ensuite ces données dans un composant dédié pour les afficher à l'utilisateur.
// On peut aussi envisager de centrer la carte sur les coordonnées de la ville.

onMounted(async () => {
  var dataCity = null;
  try {
    dataCity = await getCityInfo(insee, city);
    if (!dataCity) {
      throw new Error(`Informations de la ville ${city} non trouvées !`);
    }
  } catch (error) {
    console.error(error);
    router.replace({ path: '/' });
    return;
  }
  
  cityinfo = dataCity; // Stocker les informations de la ville dans cityinfo

  // on redirige vers la page d'accueil en passant les informations 
  // de la ville dans le state de la route
  if (cityinfo && Object.keys(cityinfo).length > 0) {
    router.replace({ path: '/', state: { cityinfo: cityinfo } });
    // on génère aussi une URL de permalien pour la carte
    var permalink = createPermalinkUrl();
    getLayersFromPermalink(permalink);
  }
})
</script>