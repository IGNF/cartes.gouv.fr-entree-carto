<script setup lang="js">
import { useLogger } from 'vue-logger-plugin'
import {
  MousePosition
} from 'geopf-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  mouseOptions: Object
})

const log = useLogger()

const map = inject('map')
const mousePosition = ref(new MousePosition(props.mouseOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(mousePosition.value)
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(mousePosition.value)
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(mousePosition.value)
  }
})

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style scoped></style>
