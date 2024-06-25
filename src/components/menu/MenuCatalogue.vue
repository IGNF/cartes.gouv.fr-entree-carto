<script lang="js">
  export default {
    name: 'CatalogueMenu'
  }
</script>

<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useMapStore } from "@/stores/mapStore"

const log = useLogger()
const store = useMapStore()

const props = defineProps({
  layers: Object
})

// INFO
// liste des configurations des couches du catalogue
// cf. dataStore.getLayers()
log.debug(props.layers);

const headingTitle = "Catalogue de données";
const buttonLabel = "Liste des couches du catalogue";
const collapsable = true;

const menuItems = Object.keys(props.layers).map((key) => {
    return {
        text: props.layers[key].title,
        to: "/?key=" + key, // FIXME 
        id: key // FIXME !?
    }
})

const emit = defineEmits(['onClickSelectLayer'])

/**
 * La selection d'un titre du catalogue permet son affichage
 * @param e 
 */
function onClickSelectedLayer(e) {
    // INFO
    // l'ajout de la couche est realisé via la modification
    // du mapStore et la reactivité : cf. src/components/CartoAndTools.vue
    const layerId = e.target.baseURI.split("?key=")[1];
    log.debug(layerId);
    store.addLayer(layerId);
}

</script>

<template>
  <DsfrSideMenu
    :heading-title="headingTitle"
    :button-label="buttonLabel"
    :collapsable="collapsable"
    :menu-items="menuItems"
    @click="onClickSelectedLayer"
  />
</template>

<style scoped>
</style>
