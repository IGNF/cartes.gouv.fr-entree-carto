<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
// REMOVEME : le bouton "+" ne descend plus quand l'écran est petit. Commenté au cas-où on re-change d'avis
// import { useMatchMedia, useMatchMediaHeight } from '@/composables/matchMedia';
import { useLogger } from 'vue-logger-plugin'
import {
  ControlList
} from 'geopf-extensions-openlayers'


import { selectedControls } from '@/composables/mapControls'
const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  controlListOptions: Object
})

const log = useLogger()

const map = inject(props.mapId)
const controlList = ref(new ControlList(props.controlListOptions))

watch(selectedControls, () => {
  setTimeout(() => {
    map.removeControl(controlList.value);
    if (props.visibility) {
      map.addControl(controlList.value);
      if (props.analytic) {
        var el = controlList.value.element.querySelector("button[id^=GPshowControlListPicto-]");
        useActionButtonEulerian(el);
      }
    }
  }, 10);
})

onMounted(() => {
  if (props.visibility) {
    map.addControl(controlList.value);
    if (props.analytic) {
      var el = controlList.value.element.querySelector("button[id^=GPshowControlListPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(controlList.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(controlList.value);
    if (props.analytic) {
      var el = controlList.value.element.querySelector("button[id^=GPshowControlListPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

</script>

<template>
  <div />
</template>
