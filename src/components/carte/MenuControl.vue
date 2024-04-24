<script setup lang="js">
import { useControls } from '@/composables/configuration'

// Définit un modèle sur un modèle de composant enfant
const modelValue = defineModel()

const legend = 'Configuration des contrôles openlayers'
const disabled = false
const inline = true
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
]
</script>

<template>
  <DsfrCheckboxSet
    v-model="modelValue"
    :legend="legend"
    :disabled="disabled"
    :inline="inline"
    :small="small"
    :required="required"
    :options="options"
  />
</template>

<style scoped>
</style>
