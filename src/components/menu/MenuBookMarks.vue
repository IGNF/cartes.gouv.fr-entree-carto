<script lang="js">
/**
 * @description
 * Menu des Favoris
 * 
 */
export default {
  name: 'MenuBookMarks'
};
</script>

<script setup lang="js">

import { computed } from 'vue';
import MenuBookMarkLoggued from '@/components/menu/bookmarks/MenuBookMarkLoggued.vue';
import { useServiceStore } from '@/stores/serviceStore';

const serviceStore = useServiceStore();
var authenticated = computed(() => serviceStore.isAuthentificated);

</script>

<template>
  <div class="container">
    <!-- INFO
      On affiche le menu des favoris si on est authentifié.
      Sinon, une modale de connexion est proposée 
      (cf. src/components/menu/LeftMenuTool.vue ~ onBookMarksOpen())
    -->
    <MenuBookMarkLoggued v-if="authenticated" />
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/variables" as *;

.container {
  @include min(sm) {
    width: $widget-panel-width-md;
  }
}
</style>