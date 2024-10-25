<script setup lang="ts">
import Carto from '@/components/carte/Carto.vue'
import LeftMenuTool from '@/components/menu/LeftMenuTool.vue'
import RightMenuTool from '@/components/menu/RightMenuTool.vue'
import MenuCatalogue from '@/components/menu/catalogue/MenuCatalogue.vue'
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
  // ajouter les options des couches
  // ex. l'opacité et la visibilité
  let layers = mapStore.getLayers();
  return layers.map((layerId: string) => {
    var layer = dataStore.getLayerByID(layerId);
    // les options de la couche sont récuperées dans le mapStore (permalink)
    var props = mapStore.getLayerProperty(layerId);
    layer.opacity = props.opacity;
    layer.visible = props.visible;
    layer.gray = props.gray;
    return layer;
  });
});

// liste des contrôles utilisateurs disponibles
// (cette liste est recalculée à chaque fois que le mapStore est modifié)
const selectedControls = computed(() => {
  let controls = mapStore.getControls();
  return controls;
});

</script>

<template>
  <div id="map-and-tools-container">

    <!-- Le catalogue est dans le menu gauche -->
    <LeftMenuTool>
      <!-- 
        On transmet la liste complète des couches du catalogue
        ainsi que la liste des couches sélectionnées
      -->
      <MenuCatalogue
        :selected-layers="selectedLayers"
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
      <!-- On transmet la liste des contrôles selectionnés : 
        >>> les controles du mapStore sont reactifs, donc dès que le 
        >>> composant MenuControl modifie une valeur, il modifie le 
        >>> mapStore des controles, ce qui repercute la selection sur 
        >>> la méthode computed()
      -->
      <MenuControl 
      :selected-controls="selectedControls"/>
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

  @media (max-width: 576px) {
    #map-and-tools-container {
      /* FIXME : la hauteur de la carto dépend de la hauteur du footer et du header, ici en dur */
      height: calc(100vh - 92.5px - 56px);
    }
  }
</style>

<style>
/* FIXME Style non scopé pour cacher les boutons partage et de menu
à voir si c'est factorisable avec ce qui est fait l153 de MenuLateralWrapper.vue */
@media (max-width: 576px) {
  #map-and-tools-container:has(.gpf-mobile-fullscreen > button[aria-pressed="true"]) .navButton,
  #map-and-tools-container:has(.gpf-mobile-fullscreen > button[aria-pressed="true"]) #share-button-position {
    display: none;
  }
}
</style>
