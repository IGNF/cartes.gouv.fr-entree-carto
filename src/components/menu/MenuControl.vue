<script lang="js">
import { useControls } from '@/composables/controls'
const availableControls =  Object.keys(useControls).map(key => {
  if (useControls[key].active) {
    return key;
  }
});

</script>
<script setup lang="js">

const selectedControls = defineModel()
const initCheckbox = ref(availableControls)

const legend = 'Configuration des contrôles openlayers'
const disabled = false
const inline = false
const required = false
const small = false
const options = [
  {
    label: 'Barre de Recherche',
    id: 'searchEngine',
    name: useControls.SearchEngine.id,
    hint: 'Barre de recherche sur la carte',
    disabled: !useControls.SearchEngine.active
  },
  {
    label: 'Mini carte',
    id: 'overview',
    name: useControls.OverviewMap.id,
    hint: 'Petite carte pour se repérer',
    disabled: !useControls.OverviewMap.active
  },
  {
    label: 'Scale Line',
    id: 'route',
    name: useControls.ScaleLine.id,
    hint: 'Echelle',
    disabled: !useControls.ScaleLine.active
  },
  {
    label: 'Gestionnaire de couches',
    id: 'layerSwitcher',
    name: useControls.LayerSwitcher.id,
    hint: 'Gestionnaire de couches',
    disabled: !useControls.LayerSwitcher.active
  },
  {
    label: 'Geocodage inverse',
    id: 'reverseGeocode',
    name: useControls.ReverseGeocode.id,
    hint: 'Geocodage inverse',
    disabled: !useControls.ReverseGeocode.active
  },
  {
    label: 'Calcul d\'isochrone',
    id: 'isocurve',
    name: useControls.Isocurve.id,
    hint: 'Calcul d\'isochrone',
    disabled: !useControls.Isocurve.active
  },
  {
    label: 'Zoom',
    id: 'zoom',
    name: useControls.Zoom.id,
    hint: 'Zoom',
    disabled: !useControls.Zoom.active
  },
  {
    label: 'Attributions',
    id: 'attributions',
    name: useControls.Attributions.id,
    hint: 'Attributions',
    disabled: !useControls.Attributions.active
  },
  {
    label: 'Rotation de la carte',
    id: 'rotate',
    name: useControls.Rotate.id,
    hint: 'Rotation de la carte',
    disabled: !useControls.Rotate.active
  },
  {
    label: 'Plein écran',
    id: 'fullscreen',
    name: useControls.FullScreen.id,
    hint: 'Plein écran',
    disabled: !useControls.FullScreen.active
  },
].filter(opt => Object.keys(useControls).includes(opt.name))

const side = "right"

onUpdated(() => {
  initCheckbox.value = selectedControls.value
})
</script>

<template>
  <DsfrCheckboxSet
    v-model="selectedControls"
    :legend="legend"
    :disabled="disabled"
    :inline="inline"
    :small="small"
    :required="required"
    :options="options"
    :model-value="selectedControls"
  /> 
</template>

<style scoped>
</style>
