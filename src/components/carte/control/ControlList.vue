<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { useMatchMedia, useMatchMediaHeight } from '@/composables/matchMedia';
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

const isSmallScreen = useMatchMedia('SM')
const isSmallHeight = useMatchMediaHeight('XS')

watch(isSmallScreen, () => {
  if (props.visibility && !isSmallScreen.value && !isSmallHeight.value) {
    controlList.value.setPosition("top-right")
  }
  else {
    controlList.value.setPosition("bottom-right")
  }
})

watch(isSmallHeight, () => {
  if (props.visibility && !isSmallScreen.value && !isSmallHeight.value) {
    controlList.value.setPosition("top-right")
  }
  else {
    controlList.value.setPosition("bottom-right")
  }
})

watch(selectedControls, () => {
  setTimeout(() => {
    map.removeControl(controlList.value);
    if (props.visibility) {
      map.addControl(controlList.value);
      if (props.analytic) {
        var el = controlList.value.element.querySelector("button[id^=GPshowControlListPicto-]");
        useActionButtonEulerian(el);
      }
      if (!isSmallScreen.value && !isSmallHeight.value) {
        controlList.value.setPosition("top-right")
      }
      else {
        controlList.value.setPosition("bottom-right")
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
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style scoped></style>
