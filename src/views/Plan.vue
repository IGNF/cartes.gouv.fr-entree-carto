<template>
  <div>
    <!-- Affichage ou chargement dynamique selon le slug -->
    <h1>Chargement du plan : {{ city }}</h1>
  </div>
</template>

<script setup lang="js">
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';

import { getCityInfo, getClosestCities } from '@/features/cityinfo';

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

let insee = slugArray[0]; // code INSEE
let city = slugArray[1]; // nom de la ville : informatif

// Informations sur la ville
let cityinfo = {};

// TODO
// Pour exploiter ce JSON dans la page de destination, 
// il suffira de lire $route.state.cityInfo.
// Par exemple, dans la page de destination :
// const route = useRoute();
// const cityInfo = route.state.cityInfo; // contient les données de la ville
// On place ensuite ces données dans un composant dédié pour les afficher à l'utilisateur.
// On peut aussi envisager de centrer la carte sur les coordonnées de la ville.

// TODO
// Cette route /cityinfo/city/${insee}/ est une redirection 
// vers le service distant qui fournit les données de la ville.
// Le service distant n'est pas exposé directement au client, 
// mais est appelé depuis l'application.

onMounted(async () => {
  // Appel du service distant avec le slug 
  // ex: /cityinfo/city/75000/
  const dataCity = await getCityInfo(insee, city);
  if (!dataCity) {
    console.warn(`Informations de la ville ${city} non trouvées !`);
    router.replace({ path: '/' });
    return;
  }

  // Appel du service distant avec le slug 
  // ex: /cityinfo/closestCities/45.757950734999994,4.835123825
  const closestCities = await getClosestCities(city, dataCity.centre[0], dataCity.centre[1]);
  if (!closestCities || closestCities.length === 0) {
    console.warn(`Aucune ville proche trouvée pour ${city} !`);
  } 
  
  cityinfo = dataCity; // Stocker les informations de la ville dans cityinfo
  cityinfo.closest_cities = closestCities || []; // Ajouter les villes proches dans cityinfo

  console.warn('Informations de la ville récupérées :', cityinfo);

  // on redirige vers la page d'accueil en passant les informations 
  // de la ville dans le state de la route
  if (cityinfo && Object.keys(cityinfo).length > 0) {
    router.replace({ path: '/', state: { cityinfo: cityinfo } });
  }
})
</script>
