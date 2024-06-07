<script lang="js">
import { useControls } from '@/composables/controls'
const availableControls = Object.keys(useControls);

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
    name: useControls.SearchEngine.active ? useControls.SearchEngine.id : null,
    hint: 'Barre de recherche sur la carte',
  },
  {
    label: 'Mini carte',
    id: 'overview',
    name: useControls.OverviewMap.active ? useControls.OverviewMap.id : null,
    hint: 'Petite carte pour se repérer',
  },
  {
    label: 'Scale Line',
    id: 'route',
    name: useControls.ScaleLine.active ? useControls.ScaleLine.id : null,
    hint: 'Echelle',
  },
  {
    label: 'Gestionnaire de couches',
    id: 'layerSwitcher',
    name: useControls.LayerSwitcher.active ? useControls.LayerSwitcher.id : null,
    hint: 'Gestionnaire de couches',
  },
  {
    label: 'Geocodage inverse',
    id: 'reverseGeocode',
    name: useControls.ReverseGeocode.active ? useControls.ReverseGeocode.id : null,
    hint: 'Geocodage inverse',
  },
  {
    label: 'Calcul d\'isochrone',
    id: 'isocurve',
    name: useControls.Isocurve.active ? useControls.Isocurve.id : null,
    hint: 'Calcul d\'isochrone',
  },
  {
    label: 'Zoom',
    id: 'zoom',
    name: useControls.Zoom.active ? useControls.Zoom.id : null,
    hint: 'Zoom',
  },
  {
    label: 'Attributions',
    id: 'attributions',
    name: useControls.Attributions.active ? useControls.Attributions.id : null,
    hint: 'Attributions',
  },
  {
    label: 'Rotation de la carte',
    id: 'rotate',
    name: useControls.Rotate.active ? useControls.Rotate.id : null,
    hint: 'Rotate',
  },
].filter(opt => availableControls.includes(opt.name))

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
