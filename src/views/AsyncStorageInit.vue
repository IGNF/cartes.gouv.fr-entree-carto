<script setup lang="ts">
import CartoAndTools from '../views/CartoAndTools.vue'
import Patience from '@/components/utils/Patience.vue'
import StoreDataLoading from '@/components/StoreDataLoading.vue';

</script>

<template>
    <Suspense>
      <!-- component with nested async dependencies -->
      <StoreDataLoading>
        <CartoAndTools/>
      </StoreDataLoading>
      <!-- loading state via #fallback slot -->
      <template #fallback>
        <div id="patience-container">
          <Patience/>
        </div>
      </template>
    </Suspense>
  </template>