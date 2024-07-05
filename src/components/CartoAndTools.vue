<script setup lang="ts">
import Carto from '@/components/carte/Carto.vue'
import LeftMenuTool from '@/components/menu/LeftMenuTool.vue'
import RightMenuTool from '@/components/menu/RightMenuTool.vue'
import MenuCatalogue from '@/components/menu/MenuCatalogue.vue'
import MenuControl from '@/components/menu/MenuControl.vue';

import { useControls } from '@/composables/controls'
import { useDataStore } from "@/stores/dataStore"
import { useMapStore } from "@/stores/mapStore"


const mapStore = useMapStore();
const dataStore = useDataStore();

// INFO
// Les listes sont initialisées via le mapStore, et 
// elles sont transmises à la cartographie à chaque fois
// que le mapStore est modifié.
// Chaque fois que des  modules modifient le mapStore en 
// ajoutant des couches (ex. LayerSwitcher), on repasse 
// via la reactivité dans ce cycle.

// liste des couches utilisateurs disponibles
// (cette liste est recalculée à chaque fois que le mapStore est modifié)
const selectedLayers = computed(() => {
  let layers = mapStore.getLayers();
  return layers.map((layerId: string) => dataStore.getLayerByID(layerId));
});

// liste des contrôles utilisateurs disponibles
const getAvailableControls = () => {
  let controls = mapStore.getControls();
  if (controls.length) {
    return controls;
  }
  // si le store est vide, on regarde les contrôles par defaut 
  // sur le composable
  return Object.keys(useControls).map((key) => {
    if (useControls[key].active) {
      return key;
    }
  });
};

const availableControls = getAvailableControls();
const selectedControls = ref(availableControls);

</script>

<template>
  <div id="map-and-tools-container">

    <!-- Le catalogue est dans le menu gauche -->
    <LeftMenuTool>
      <!-- On transmet la liste complète des couches du catalogue -->
      <MenuCatalogue
        :layers="dataStore.getLayers()"/>
    </LeftMenuTool>

    <!-- Module cartographique : 
     - liste des couches selectionnées
     - liste des controles selectionnés
    -->
    <Carto
      :selected-layers="selectedLayers"
      :selected-controls="selectedControls"/>

    <!-- Le menu des contrôles est dans le menu droite -->
    <RightMenuTool>
      <!-- On transmet la liste des contrôles selectionnés
        >>> Choix du v-model pour une communication entre Parent <-> Child
        >>> afin de remonter les infos de selections vers le composant Carto
      -->
      <MenuControl 
        v-model="selectedControls"/>
    </RightMenuTool>

  </div>
</template>

<style scoped>
  #map-and-tools-container{
    margin-left: 0;
    width: inherit;
    height: 70vh;
    display: flex;
  }
</style>