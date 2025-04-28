<script setup lang="ts">
import CartoAndTools from '@/components/CartoAndTools.vue'
import Patience from '@/components/utils/Patience.vue'
import StoreData from '@/components/StoreData.vue';
import ModalInformation from '@/components/modals/ModalInformation.vue'
</script>

<template>
  <Suspense>
    <!-- Chargement du dataStore avec une patience 
          avant afficahge de la cartographie 
      -->
    <StoreData>
      <!-- Modale : Informations -->
      <div class="fr-container fr-container--fluid fr-container-md">
        <ModalInformation />
      </div>
      <CartoAndTools />
    </StoreData>

    <!-- loading state via #fallback slot -->
    <template #fallback>
      <div class="patience-container">
        <Patience />
      </div>
    </template>
  </Suspense>
</template>

<style>
  .patience-container{
    margin-left: 0;
    width: inherit;
    height: 76.8vh;
    display: flex;
  }
</style>