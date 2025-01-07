<script lang="js">
/**
 * @description
 * Entrée d'un favori :
 * - nom
 * - icone en fonction du type de données
 * - type de données
 * - date (creer et modifier)
 * - menu options : renommer, partager, supprimer
 * 
 * Au clic sur l'entrée, la donnée est ajoutée à la carte.
 * On récupère des informations complementaire avant de télécharger le fichier.
 * Et, on enregistre l'ID dans la couche native : 
 *   ex. gpResultLayerId = 'bookmark:3fa85f64-5717-4562-b3fc-2c963f66afa5'
 * 
 * @todo gestion des exceptions à transmettre dans la balise alerte de "Main.vue"
 * @fixme le format GPX ne s'affiche pas !?
 */
export default {
  name: 'MenuBookMarkEntry'
};
</script>

<script setup lang="js">
import { createVectorLayer } from '@/features/ol-utils.js';

import { useMapStore } from "@/stores/mapStore";
const mapStore = useMapStore();

/**
 * Options :
 * - type : 'map' ou 'data'
 * - data : {id, full_name, name, ext, type, type_fr, icon, date}
 */
const props = defineProps({
  type : String,
  data : Object
});

const service = inject('services');

/**
 * Gestionnaire d'evenement d'affichage de la couche sur la carte
 * 
 * @param data - {id, full_name, name, ext, type, type_fr, icon, date}
 */
const displayDataOnMap = (data) => {
  service.getDocumentById(data.id)
  .then((infos) => {
    var fct = null;
    switch (data.type) {
      case "drawing":
        fct = service.getDrawing;
        break;
      case "import":
        fct = service.getImport;
        break;
      case "compute":
        // TODO ce type de données doit initialisé un contrôle : 
        // - isochrone
        // - profil altimétrique
        // - itineraire
        fct = service.getCompute;
        throw new Error(`Le type ${data.type} n'est pas implementé !`);
        break;
      case "service":
        fct = service.getService;
        throw new Error(`Le type ${data.type} n'est pas implementé !`);
        break;
      default:
        break;
    }
    if (!fct) {
      throw new Error("Impossible de determiner le type de données !?");
    }
    fct.call(service, data.id)
    .then((response) => {
      var layer = createVectorLayer({
        id : data.id,
        extended : true, // on utilise le format étendu de GeoJSON, KML et GPX
        title : data.name,
        description : infos.description, // infos complementaires
        format : data.ext,
        data : response
      });
      mapStore.getMap().addLayer(layer);
    })
    .catch((e) => {
      throw e;
    });
  })
  .catch((e) => {
    console.error(e);
    // TODO transmettre l'exception à la carte !?
  })
};

onBeforeMount(() => {

});

onMounted(() => {

});

</script>

<template>
  <DsfrButton 
    :data-id="data.id"
    :data-type="data.type"
    :title="data.full_name"
    tertiary
    no-outline
    :icon="data.icon"
    @click="displayDataOnMap(data)">
      {{ data.name }}
  </DsfrButton>
  <div class="container-bookmark-advanced-infos fr-hint-text">
    <span>{{ data.type_fr }}</span>
    <span v-if="data.ext"> - {{ data.ext }}</span>
    <span v-if="data.date"> - {{ data.date }}</span>
  </div>
  <div class="container-bookmark-advanced-options"></div>
  <slot></slot>
</template>