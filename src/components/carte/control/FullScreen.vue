<script setup lang="js">

import FullScreen from 'ol/control/FullScreen'

const props = defineProps({
  visibility: Boolean,
  fullscreenOptions: Object
})

const map = inject('map')
const fullscreen = ref(new FullScreen(props.fullscreenOptions)) 

onMounted(() => {
  if (props.visibility) {
    map.addControl(fullscreen.value)
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(fullscreen.value)
  }
  else {
    map.removeControl(fullscreen.value)
  }
})

</script>

<template></template>

<style>
  #map .ol-custom-full-screen {
    bottom: 78px;
    left: auto;
    right: 50px;
    top: auto;
  }

  /* surcharge en mode dsfr */
  .ol-custom-full-screen button {
    height: 44px;
    width: 44px;
    background-color: #000091;
    background-image: url("../../../assets/fullscreen.svg");
    background-position: center center;
    background-repeat: no-repeat;
  }
  .ol-custom-full-screen button:hover {
    background-color: #1212ff;
  }
</style>
