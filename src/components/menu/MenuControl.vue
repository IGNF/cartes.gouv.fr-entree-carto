<script lang="js">
  /**
   * @description
   * Composant représentant le menu de gestion des outils.
   * 
   * @property {Object} selectedControls Tableau des contrôles sélectionnés ajoutés à la carte
   * 
   */
  export default {
    name: 'MenuControl'
  };
</script>

<script setup lang="js">
import { useControlsMenuOptions } from '@/composables/controls';
import { useLogger } from 'vue-logger-plugin';
import { useMapStore } from "@/stores/mapStore";
import ControlListElement from './ControlListElement.vue';

const log = useLogger();
const mapStore = useMapStore();;

const props = defineProps({
  selectedControls: {
    type: Array,
    default: () => []
  }
});

const selectedControlsModel = defineModel({ type: Array, default: () => [] });

const opts = useControlsMenuOptions();

const allOptions = computed(() => {
  return opts.filter((opt) => {
    if (opt.label.toLowerCase().includes(searchString.value.toLowerCase()) || 
        opt.hint.toLowerCase().includes(searchString.value.toLowerCase())  ||
        opt.name.toLowerCase().includes(searchString.value.toLowerCase()))
      return opt;
  })
});

const searchString = ref("");
function updateSearch(e) {
  searchString.value = e;
}

watch(selectedControlsModel, (values) => {
  mapStore.cleanControls();
  for (let index = 0; index < values.length; index++) {
    const key = values[index];
    mapStore.addControl(key);
  }
})
onMounted(() => {})
onUpdated(() => {})

</script>

<template>
  <div class="control-container">
    <h4>Gestion d'outils</h4>
    <div class="control-search-bar">
      <DsfrSearchBar
        :model-value="searchString"
        @update:model-value="updateSearch"
      />
    </div>
    <div class="control-content">
      <table>
        <ControlListElement
          v-for="(opt, idx) in allOptions"
          :key="idx"
          v-model="selectedControlsModel"
          :model-value="props.selectedControls"
          :control-list-element-options="opt"
        />
      </table>
    </div>
  </div>
</template>

<style scoped>
table {
  border-spacing: 30px 1rem;
  border-collapse: separate;
}
.control-search-bar {
  margin-bottom: 30px;
  margin-right: 40px;
  top: 0px;
}

.control-content {
  overflow-y: scroll;
  scrollbar-width: thin;
  overflow-x: hidden;
}

.control-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: calc(100% - 60px);
  max-height: calc(76.8vh - 96px);
}
</style>
