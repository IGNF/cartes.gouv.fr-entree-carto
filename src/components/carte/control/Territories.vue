<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from '@/stores/dataStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { Territories } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  territoriesOptions: Object
});

const log = useLogger();
const store = useDataStore();


const map = inject(props.mapId)
const territories = ref(new Territories(props.territoriesOptions));

function addTerritories () {
  var t = store.getTerritories();
  for (let i = 0; i < t.length; i++) {
    const territory = t[i];
    territories.value.setTerritory(territory);
  }
}

onMounted(() => {
  if (props.visibility) {
    addTerritories();
    map.addControl(territories.value)
    if (props.analytic) {
      var el = territories.value.element.querySelector("button[id^=GPshowTerritoriesPicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget */
    territories.value.on("territories:change", onChangeTerritories);
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(territories.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    addTerritories();
    map.addControl(territories.value);
    if (props.analytic) {
      var el = territories.value.element.querySelector("button[id^=GPshowTerritoriesPicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget */
    territories.value.on("territories:change", onChangeTerritories);
  }
})

/** 
 * gestionnaire d'evenement sur les abonnements
 * @description
 * ...
 */
 const onChangeTerritories = (e) => {
  log.debug(e);
}
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>
/*
VERRUE : pour les widgets dont les boutons sont bottom-left, on veut aligner les panels avec le container top-left
*/
dialog[id^=GPterritoriesPanel-] {
  top : -85px !important;
}

  @media (max-width: 576px){
    .gpf-panel__body_territories {
      max-height: calc(100vh - 92.5px - 56px);
    }
  }
</style>