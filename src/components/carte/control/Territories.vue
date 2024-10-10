<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from '@/stores/dataStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { Territories } from 'geopf-extensions-openlayers';

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  territoriesOptions: Object
});

const log = useLogger();
const store = useDataStore();

const map = inject('map')
const territories = ref(new Territories(props.territoriesOptions));

defineExpose({
  container: territories.value.getContainer(),
  options: territories.value.options
});

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
  }
})

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>