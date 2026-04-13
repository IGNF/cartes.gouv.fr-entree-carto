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
  <div />
</template>

<style lang="scss">
@use "@/assets/variables" as *;

.gpf-widget[id^="GPpointInfo-"] {
  top: $widget-btn-size + $gap * 2;
  left: $widget-panel-x;

  @include max(sm) {
    top: 0;
    left: 0;
    width: 100vw;

    .gpf-panel {
      width: inherit;
    }
  }
}
</style>
