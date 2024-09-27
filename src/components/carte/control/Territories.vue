<script setup lang="js">

import { useLogger } from 'vue-logger-plugin'
import { useDataStore } from '@/stores/dataStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { Territories } from 'geopf-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  territoriesOptions: Object
})

const log = useLogger()
const store = useDataStore();

const map = inject('map')
const territories = ref(new Territories(props.territoriesOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(territories.value)
    if (props.analytic) {
      var el = territories.value.element.querySelector("button[id^=GPshowTerritoriesPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(territories.value)
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(territories.value)
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