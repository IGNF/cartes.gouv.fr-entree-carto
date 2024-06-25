<script setup lang="ts">
import CartoAndTools from '@/components/CartoAndTools.vue'
import Patience from '@/components/utils/Patience.vue'
import StoreData from '@/components/StoreData.vue';
</script>

<template>
    <Suspense>
      <!-- component with nested async dependencies -->
      <StoreData>
        <CartoAndTools/>
      </StoreData>

      <!-- loading state via #fallback slot -->
      <template #fallback>
        <div class="patience-container">
          <Patience/>
        </div>
      </template>
    </Suspense>
</template>

<style>
  .patience-container{
    margin-left: 0;
    width: inherit;
    height: 70vh;
    display: flex;
  }
</style>