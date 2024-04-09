<script setup lang="ts">

import type Map from "ol/Map";
import View from 'ol/View.js';


const map = inject<Map>("map");

const props = defineProps({
    zoom: Number,
    center: Array
});
let view: View | undefined = new View(props);

onMounted(() => {
  map?.setView(view);
});


</script>


<template>
  <div></div>
</template>