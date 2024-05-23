<script lang="js">
import { useControls } from '@/composables/controls'
const availableControls = Object.values(useControls);

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
    name: useControls.SearchEngine,
    hint: 'Barre de recherche sur la carte',
  },
  {
    label: 'Mini carte',
    id: 'overview',
    name: useControls.OverviewMap,
    hint: 'Petite carte pour se repérer',
  },
  {
    label: 'Scale Line',
    id: 'route',
    name: useControls.ScaleLine,
    hint: 'Echelle',
  },
].filter(opt => Object.values(availableControls).includes(opt.name))

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
