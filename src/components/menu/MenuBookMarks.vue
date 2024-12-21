<script setup lang="js">

import MenuBookMarkLogguedIn from '@/components/menu/bookmarks/MenuBookMarkLogguedIn.vue';
import MenuBookMarkLogguedOut from '@/components/menu/bookmarks/MenuBookMarkLogguedOut.vue';

var service = inject('services');
var authenticated = computed(() => service.authenticated);

</script>

<template>
  <div class="container">
    <MenuBookMarkLogguedIn v-if="authenticated"/>
    <MenuBookMarkLogguedOut v-else />
  </div>
</template>

<style scoped>
  .container {}
</style>