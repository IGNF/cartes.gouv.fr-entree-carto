<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { useLogger } from 'vue-logger-plugin'
import {
  ElevationPath
} from 'geopf-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  elevationPathOptions: Object
})

const log = useLogger()

const map = inject('map')
const elevationPath = ref(new ElevationPath(props.elevationPathOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(elevationPath.value);
    if (props.analytic) {
      var el = elevationPath.value.element.querySelector("button[id^=GPshowElevationPathPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(elevationPath.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(elevationPath.value);
    if (props.analytic) {
      var el = elevationPath.value.element.querySelector("button[id^=GPshowElevationPathPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style scoped></style>
