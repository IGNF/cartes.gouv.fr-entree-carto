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
    /* abonnement au widget 
    * @fires elevationpath:drawstart
    * @fires elevationpath:drawend
    * @fires elevationpath:compute
    */
    elevationPath.value.on("elevationpath:drawstart", onDrawStart);
    elevationPath.value.on("elevationpath:drawend", onDrawEnd);
    elevationPath.value.on("elevationpath:compute", onCompute);
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

/** 
 * gestionnaire d'evenement sur les abonnements
 */
 const onDrawStart = (e) => {
  log.debug(e);
}
const onDrawEnd = (e) => {
  log.debug(e);
}
const onCompute = (e) => {
  log.debug(e);
}

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style scoped></style>
