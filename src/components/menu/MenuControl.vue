<script setup lang="js">
import { useControls } from '@/composables/controls'
import { useLogger } from 'vue-logger-plugin'
import { useMapStore } from "@/stores/mapStore"

const log = useLogger()
const mapStore = useMapStore();

const props = defineProps({
  selectedControls : Array
})

const selectedControls = defineModel()

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
    disabled: useControls.SearchEngine.disable
  },
  {
    label: 'Mini carte',
    id: 'overview',
    name: useControls.OverviewMap.id,
    hint: 'Petite carte pour se repérer',
    disabled: useControls.OverviewMap.disable
  },
  {
    label: 'Scale Line',
    id: 'scaleLine',
    name: useControls.ScaleLine.id,
    hint: 'Echelle',
    disabled: useControls.ScaleLine.disable
  },
  {
    label: 'Gestionnaire de couches',
    id: 'layerSwitcher',
    name: useControls.LayerSwitcher.id,
    hint: 'Gestionnaire de couches',
    disabled: useControls.LayerSwitcher.disable
  },
  {
    label: 'Légendes',
    id: 'legends',
    name: useControls.Legends.id,
    hint: 'Légendes',
    disabled: useControls.Legends.disable
  },
  {
    label: 'Geocodage inverse',
    id: 'reverseGeocode',
    name: useControls.ReverseGeocode.id,
    hint: 'Geocodage inverse',
    disabled: useControls.ReverseGeocode.disable
  },
  {
    label: 'Calcul d\'isochrone',
    id: 'isocurve',
    name: useControls.Isocurve.id,
    hint: 'Calcul d\'isochrone',
    disabled: useControls.Isocurve.disable
  },
  {
    label: 'Zoom',
    id: 'zoom',
    name: useControls.Zoom.id,
    hint: 'Zoom',
    disabled: useControls.Zoom.disable
  },
  {
    label: 'Attributions',
    id: 'attributions',
    name: useControls.Attributions.id,
    hint: 'Attributions',
    disabled: useControls.Attributions.disable
  },
  {
    label: 'Rotation de la carte',
    id: 'rotate',
    name: useControls.Rotate.id,
    hint: 'Rotation de la carte',
    disabled: useControls.Rotate.disable
  },
  {
    label: 'Plein écran',
    id: 'fullscreen',
    name: useControls.FullScreen.id,
    hint: 'Plein écran',
    disabled: useControls.FullScreen.disable
  },
  {
    label: 'Mesure de distance',
    id: 'measureLength',
    name: useControls.MeasureLength.id,
    hint: 'Mesures',
    disabled: useControls.MeasureLength.disable
  },
  {
    label: 'Mesure d\'aire',
    id: 'measureArea',
    name: useControls.MeasureArea.id,
    hint: 'Mesures',
    disabled: useControls.MeasureArea.disable
  },
  {
    label: 'Mesure d\'azimut',
    id: 'measureAzimuth',
    name: useControls.MeasureAzimuth.id,
    hint: 'Mesures',
    disabled: useControls.MeasureAzimuth.disable
  },
  {
    label: 'Clic interactif',
    id: 'getfeatureinfo',
    name: useControls.GetFeatureInfo.id,
    hint: 'Active l\'interactivité de la carte',
    disabled: useControls.GetFeatureInfo.disable
  },
].filter(opt => Object.keys(useControls).includes(opt.name))

const side = "right"

watch(selectedControls, (values) => {
  mapStore.cleanControls();
  for (let index = 0; index < values.length; index++) {
    const key = values[index];
    mapStore.addControl(key);
  }
})

onUpdated(() => {})

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
    :model-value="props.selectedControls"
  /> 
</template>

<style scoped>
</style>
