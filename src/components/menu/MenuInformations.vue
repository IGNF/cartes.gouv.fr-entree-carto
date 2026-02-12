<script lang="js">
  /**
   * @description
   * Menu des informations
   *
   */
  export default {
    name: 'MenuInformations'
  };
</script>

<script setup lang="js">
import ShortCut from "@/components/menu/informations/ShortCut.vue";
import CityInfo from "@/components/menu/informations/CityInfo.vue";

const props = defineProps({
  informations: {
    type: Object,
    default: () => ({})
  }
});

</script>

<template>
  <CityInfo 
    v-if="props.informations.type === 'cityinfo'" 
    :data="props.informations.data"
  />
  <ShortCut 
    v-else-if="props.informations.type === 'shortcut'" 
    :data="props.informations.data"
  />
  <div 
    v-else 
    class="fr-callout"
  >
    <p>Aucune information disponible</p>
  </div>
</template>