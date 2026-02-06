<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { useMatchMedia } from '@/composables/matchMedia';

import { Legends } from 'geopf-extensions-openlayers';

const isSmallScreen = useMatchMedia('SM')

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  legendsOptions: Object
});

const map = inject(props.mapId);
const legends = ref(new Legends(props.legendsOptions));

onMounted(() => {
  if (props.visibility) {
    map.addControl(legends.value);
    if (props.analytic) {
      var el = legends.value.element.querySelector("button[id^=GPshowLegendsPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(legends.value);
    if (props.analytic) {
      var el = legends.value.element.querySelector("button[id^=GPshowLegendsPicto-]");
      useActionButtonEulerian(el);
    }
  }
  else {
    map.removeControl(legends.value);
  }
})
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>
/*
VERRUE : pour les widgets dont les boutons sont bottom-left, on veut aligner les panels avec le container top-left
*/
@media (min-width: 576px) {
  dialog[id^=GPlegendsPanel-] {
    top : -90px !important;
    left : 47px !important;
  }
}

@media (max-width: 576px) {
  .position-container-bottom-left .gpf-mobile-fullscreen>button[aria-pressed=true]~dialog[id^=GPlegendsPanel-] {
    top : -243px !important;
  }
}

@media (max-width: 576px) {
  button[id^=GPshowLegendsPicto] {
    display: none;
  }
}
</style>