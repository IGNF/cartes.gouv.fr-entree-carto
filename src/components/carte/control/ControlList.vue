<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { useLogger } from 'vue-logger-plugin'
import {
  ControlList
} from 'geopf-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  analytic: Boolean,
  controlListOptions: Object
})

const log = useLogger()

const map = inject('map')
const controlList = ref(new ControlList(props.controlListOptions))

onMounted(() => {
  if (props.visibility) {
    map.addControl(controlList.value);
    if (props.analytic) {
    log.debug(controlList.value.element)
      var el = controlList.value.element.querySelector("button[id^=GPshowControlListPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(controlList.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(controlList.value);
    if (props.analytic) {
      var el = controlList.value.element.querySelector("button[id^=GPshowControlListPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style scoped></style>
