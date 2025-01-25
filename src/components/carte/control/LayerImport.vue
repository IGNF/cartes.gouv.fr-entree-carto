<script lang="js">
  /**
   * @description
   * ...
   * @listens emitter#layerimport:open:clicked
   */
  export default {
    name: 'LayerImport'
  };
</script>

<script setup lang="js">
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';
import { useLogger } from 'vue-logger-plugin'
import {
  LayerImport
} from 'geopf-extensions-openlayers'

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  layerImportOptions: Object
})

const log = useLogger()

const map = inject(props.mapId)
const layerImport = ref(new LayerImport(props.layerImportOptions))

// abonnement sur l'ouverture du controle
const emitter = inject('emitter');
emitter.addEventListener("layerimport:open:clicked", (e) => {
  if (layerImport.value) {
    let button = [...layerImport.value.element.children].filter((e) => {
      if (e.className.includes("GPshowOpen")) {
        return e;
      }
    });
    button[0].click();
  }
});

onMounted(() => {
  if (props.visibility) {
    map.addControl(layerImport.value);
    if (props.analytic) {
      var el = layerImport.value.element.querySelector("button[id^=GPshowImportPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(layerImport.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(layerImport.value);
    if (props.analytic) {
      var el = layerImport.value.element.querySelector("button[id^=GPshowImportPicto-]");
      useActionButtonEulerian(el);
    }
  }
})

</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>
button[id^=GPshowImportPicto-] {
  display: none;
}
dialog[id^=GPcontrolListPanel-] button[id^=GPshowImportPicto-]{
  display: block;
}
</style>
