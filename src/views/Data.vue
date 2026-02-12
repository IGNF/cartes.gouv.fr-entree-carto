<template>
  <div>
    <!-- Affichage ou chargement dynamique selon le slug -->
    <h1>Chargement de la donnée : {{ slug }}</h1>
  </div>
</template>

<script setup lang="js">

import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';

const route = useRoute();
const router = useRouter();

let slug = route.params.slug;

// On récupère les raccourcis de couches pour trouver le permalink associé au slug
// Exemple de données dans le JSON des raccourcis :
// route /data/golf-du-morbihan
// {
//   "permalink": "http://localhost:5173/cartes.gouv.fr-entree-carto?c=-2.813119,47.602751&z=12&l=ORTHOIMAGERY.ORTHOPHOTOS$GEOPORTAIL:OGC:WMTS(2;1;1;0),PLAN.IGN$GEOPORTAIL:GPP:TMS(1;1;1;0;toponymes)&permalink=yes",
//   "description": "...",
//   "title": "...",
//   "legend": "..."
// }
const getShortcutsByID = async (slug) => {
  const shortcutsConfURL = import.meta.env.BASE_URL + '/' + import.meta.env.VITE_GPF_CONF_SHORTCUTS;
  const shortcutsRes = await fetch(shortcutsConfURL);
  const shortcuts = await shortcutsRes.json();
  return shortcuts[slug];
}

// TODO
// Pour exploiter ce JSON dans la page de destination, 
// il suffira de lire $route.state.shortcut.
// Par exemple, dans la page de destination :
// const route = useRoute();
// const data = route.state.shortcut;
// On peut aussi envisager de charger le permalien.

onMounted(async () => {
  const data = await getShortcutsByID(slug);

  console.warn(`shortcut sur la donnée ${slug} : ${JSON.stringify(data)}`);

  const permalink = data ? data.permalink : null;
  if (permalink) {
    router.replace({ path: '/', state: { shortcut: data } });
  } else {
    console.warn(`Aucun permalien trouvé pour le slug ${slug} !`);
    router.replace({ path: '/' });
  }
});
</script>
