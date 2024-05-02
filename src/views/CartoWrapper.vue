<script setup lang="ts">
import Carto from './Carto.vue'
import Patience from './Patience.vue'
</script>

<template>
  <Suspense>
  <!-- component with nested async dependencies -->
  <Carto/>
  <!-- loading state via #fallback slot -->
  <template #fallback>
    <div id="patience-container">
      <Patience/>
    </div>
  </template>
</Suspense>

  
</template>

<style scoped>
#patience-container{
  margin-left: 0;
  width: inherit;
  height: 70vh;
  background-color: #929292;
  position: relative;
}
</style>