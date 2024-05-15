<script setup lang="ts">
// FIXME le nom est il bien choisi ?
// ex. un autre nom comme MapLoading ou CartoLoading ?

// FIXME une view qui impporte des views !?
// non, les 2 views suivantes sont des composants
// on devrait les basculer dans le répertoire components
import Carto from '@/views/Carto.vue'
import Patience from '@/views/Patience.vue'

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