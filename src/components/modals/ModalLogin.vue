<script lang="js">
/**
 * @description
 * Affichage d'une modale de connexion
 */
export default {
  name: 'ModalLogin'
};
</script>

<script setup lang="js">
import { useEulerian } from '@/plugins/Eulerian.js';
const eulerian = useEulerian();

const title = "Module de connexion";
const description = "...";
const type = "warning";

const opened = ref(false);

if (opened.value) {
  eulerian.pause();
}
const openModalLogin = () => {
  opened.value = true;
  eulerian.pause();
};

const onModalLoginClose = () => {
  opened.value = false;
  eulerian.resume();
};

defineExpose({
  openModalLogin,
  onModalLoginClose
});

</script>

<template>
  <DsfrModal 
    :opened="opened" 
    :title="title"
    size="md" 
    @close="onModalLoginClose">

    <!-- slot : c'est ici que l'on customise le contenu ! -->
    <DsfrAlert
      :description="description"
      :type="type"
    />
  
  </DsfrModal>
</template>

<style>

</style>