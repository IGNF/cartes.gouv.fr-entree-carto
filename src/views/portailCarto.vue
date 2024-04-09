
<script setup lang="ts">
import vlMap from "./ol-views/vlMap.vue";
import vlView from "./ol-views/vlView.vue";

const zoom =  10;
const center = [-234814.550892, 4774562.534805];
const mapID = "map";
</script>


<template>
  <vlMap>
    <vlView 
      :center="center"
      :zoom="zoom"
      />
  </vlMap>
</template>