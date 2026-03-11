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
  // regroupement des controles par group
  // [
  //   { group: 'id',  items: [{ label: 'Barre de Recherche', ... }] },
  //   { group: 'id2', items: [{ label: 'Mini carte', ... }] }
  // ]
  // puis filtrage des items par la recherche
  // puis filtrage si pas d'items
  return Object.entries(
    opts.reduce((acc, item) => {
      (acc[item.group] ??= []).push(item);
      return acc;
    }, {})
  ).map(([group, items]) => ({
    group,
    items: items.filter(opt => {
      return (
        opt.label.toLowerCase().includes(searchString.value.toLowerCase()) ||
        opt.hint?.toLowerCase().includes(searchString.value.toLowerCase()) ||
        opt.name.toLowerCase().includes(searchString.value.toLowerCase())
      );
    })
  })).filter(({ items }) => items.length > 0);
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
      <div>
        <div
          v-for="group in allOptions"
          :key="group.group"
        >
          <p class="fr-text--sm fr-mb-0">
            {{ group.group }}
          </p>
          <div class="fr-mb-3w">
            <ControlListElement
              v-for="(opt, idx) in group.items"
              :key="idx"
              v-model="selectedControlsModel"
              :model-value="props.selectedControls"
              :control-list-element-options="opt"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/variables" as *;

.control-search-bar {
  margin-bottom: 30px;
  top: 0px;
}

.control-container {
  @include min(sm) {
    width: $widget-panel-width-md;
  }
}
</style>
