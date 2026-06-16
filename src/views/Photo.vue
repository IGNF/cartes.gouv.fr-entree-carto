<template>
  <div class="plan-loading-view">
    <Patience />
    <p
      v-if="pictureID"
      class="plan-loading-label"
    >
      Chargement de la photo : {{ pictureID }}
    </p>
  </div>
</template>

<script setup lang="js">
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';

import Patience from '@/components/utils/Patience.vue';

import { getLayersFromPermalink } from '@/features/permalink.js';

const route = useRoute();
const router = useRouter();

// Exemple de route : 
//   /photo/:sequenceID/:pictureID/:center/:zoom/
//   /photo/46480052-0064-401a-96d7-4e3ff001fb56/db63cd7e-91f4-49d2-8540-f8d8c4773b52/2.321082,48.848713/18
let slug = route.params.slug;
let slugArray = [];
if (Array.isArray(slug)) {
  slugArray = slug;
} else if (typeof slug === 'string') {
  slugArray = slug.split('/');
}

// TODO : vérifier que slugArray contient bien 4 éléments
// TODO : vérifier que les éléments sont valides (ID de séquence, ID de photo, coordonnées, zoom)
let sequenceID = slugArray[0];  // ID de la séquence
let pictureID  = slugArray[1];  // ID de la photo
let center     = slugArray[2];  // coordonnées du centre de la photo : "lat,lon"
let zoom       = slugArray[3];  // zoom de la photo

const createPermalinkUrl = () => {
  // On génère une URL de permalien pour la carte centrée sur la photo
  // avec les couches déjà chargées
  var last = location.pathname.slice(-1);
  var path = (last === "/") ? location.pathname.slice(0, -1) : location.pathname;
  var realpath = path.replace(/\/photo\/.*/, "");
  var url = location.origin + realpath;

  var permalink = `${url}?c=${center}&z=${Math.round(zoom)}`;
  return permalink + "&permalink=no";
};

onMounted(async () => {
  // On génère aussi une URL de permalien pour la carte
  var permalink = createPermalinkUrl();

  // Retour sur la Home Page pour chargement du widget Panoramax avec les informations suivantes :
  // - l'ID de la photo
  // - l'ID de la séquence de la photo
  await router.replace({ path: '/', state: { picture : pictureID, sequence: sequenceID } });
  
  // On charge le permalien pour afficher la carte centrée sur la photo 
  // sans detruire les couches déjà chargées
  getLayersFromPermalink(permalink);
});
</script>

<style scoped>
.plan-loading-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.plan-loading-label {
  margin-top: 1rem;
}
</style>