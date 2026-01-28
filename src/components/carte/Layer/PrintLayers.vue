<script setup lang="js">
const props = defineProps({
  mainMapId: {
    type: String,
    default: ''
  },
    printMapId: {
    type: String,
    default: ''
  }
})

const mainMap = inject(props.mainMapId);
const printMap = inject(props.printMapId);

onMounted(async () => {
const layers = mainMap.getLayers();

layers.forEach(layer => {
  const clonedLayer = typeof layer.clone === 'function' ? layer.clone() : layer;
  printMap.addLayer(clonedLayer);
});
 await nextTick(); // 👈 attendre que Vue ait fini
  printMap.renderSync();
});


</script>

<template>
</template>
