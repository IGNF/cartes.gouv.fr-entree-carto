<script setup lang="js">
import Pointer from "ol/interaction/Pointer";

// recuperation de l'objet 'map' du composant parent
const map = inject("map");
  
const emit = defineEmits([
        "down",
        "move",
        "up",
        "drag"
    ]
)
  
const pointer = new Pointer({
  handleDownEvent: (e) => {
    emit("down", e);
    return true;
  },
  handleDragEvent: (e) => {
    emit("drag", e);
    return true;
  },
  handleMoveEvent: (e) => {
    emit("move", e);
  },
  handleUpEvent: (e) => {
    emit("up", e);
    return true;
  },
})
  

watch(pointer, (newVal, oldVal) => {
    console.log(pointer)
    console.log(newVal)
    console.log(oldVal)
    map?.removeInteraction(oldVal);
    map?.addInteraction(newVal);
    map?.changed();
  });
  
  onMounted(() => {

    console.log(pointer)
    map?.addInteraction(pointer);
  });
  
  onUnmounted(() => {
    map?.removeInteraction(pointer);
  });
  
  defineExpose({
    pointer
  });
  </script>

<template>
    <slot></slot>
  </template>