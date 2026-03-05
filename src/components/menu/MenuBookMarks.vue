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

import MenuBookMarkLoggued from '@/components/menu/bookmarks/MenuBookMarkLoggued.vue';

var service = inject('services');
var authenticated = computed(() => service.authenticated);

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