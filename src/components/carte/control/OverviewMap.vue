<script setup lang="js">
import { useLogger } from 'vue-logger-plugin'
import { GeoportalOverviewMap } from 'geoportal-extensions-openlayers'
import { useMatchMedia } from '@/composables/matchMedia'

const props = defineProps({
  visibility: Boolean,
  overviewMapOptions: Object
})

const log = useLogger()

const map = inject('map')
const overviewMap = ref(new GeoportalOverviewMap(props.overviewMapOptions))

const isSmallScreen = useMatchMedia('SM')

watch(isSmallScreen, () => {
  if (props.visibility && !isSmallScreen.value) {
    map.addControl(overviewMap.value)
  }
  else {
    map.removeControl(overviewMap.value)
  }
})

onMounted(() => {
  if (props.visibility && !isSmallScreen.value) {
    map.addControl(overviewMap.value)
    overviewMap.value.on('overviewmap:toggle', onToggleOverviewMap)
  }
})

onBeforeUpdate(() => {
  if (props.visibility && !isSmallScreen.value) {
    map.addControl(overviewMap.value)
  }
  else {
    map.removeControl(overviewMap.value)
  }
})

function onToggleOverviewMap (e) {
  log.debug(e)
}
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style></style>
