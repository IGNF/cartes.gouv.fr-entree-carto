<script setup lang="js">
import { ContextMenu } from 'geopf-extensions-openlayers';
import { useMatchMedia } from '@/composables/matchMedia';

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  contextMenuOptions: Object
});

const isSmallScreen = useMatchMedia('SM')

const map = inject(props.mapId)
const contextMenu = ref(new ContextMenu(props.contextMenuOptions));
const pixel = ref([0,0])
onMounted(() => {
  if (props.visibility) {
    map.addControl(contextMenu.value);
    contextMenu.value.contextmenu.on("open", onContextMenuOpen)
    map.on('singleclick', function (evt) {
    const pixel = evt.pixel;
      pixel.value =[90, pixel[1]]
    });
  }
})

onBeforeUpdate(() => {
  if (props.visibility) {
    map.addControl(contextMenu.value);
  }
  else {
    map.removeControl(contextMenu.value);
  }
})

const onContextMenuOpen = () => {
  if (isSmallScreen.value) {
    contextMenu.value.contextmenu.updatePosition([90, pixel[1]])
  }
}
</script>

<template>
  <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
</template>

<style>
.ol-overlay-container:has(.gp-label-div),
.ol-overlay-container:has(.gp-styling-div) {
  transform: translate(62px, 79px) !important;
}

div[id^="GPpointInfo-"] {
  top: 6px;
  left: 53px;
}

@media (max-width: 627px) and (min-width: 576px) {
  .ol-overlay-container:has(.gp-label-div),
  .ol-overlay-container:has(.gp-styling-div) {
    transform: translate(62px, 144px) !important;
  }
}

@media (max-width: 576px) {
  .ol-overlay-container:has(.gp-label-div),
  .ol-overlay-container:has(.gp-styling-div) {
    transform: translate(62px, 235px) !important;
  }

  div[id^="GPpointInfo-"] {
    top: 165px;
    left: 8px;
  }
}

</style>