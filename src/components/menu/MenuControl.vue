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
import { useEulerian } from '@/plugins/Eulerian.js';
import ControlListElement from './ControlListElement.vue';

const log = useLogger();
const eulerian = useEulerian();
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

/* ===================================== */
/* TOOLTIP OVERRIDE                      */
/* ===================================== */

const tooltipContainer = ref(null);
let tooltipObserver = null;

function bindTooltip(link) {
  if (link.__tooltipBound) return;

const tooltipId = link.id.replace("link-", "");
const tooltip = document.getElementById(tooltipId);
if (!tooltip) return;

const parent = link.parentElement;

const show = () => {
  tooltip.classList.add("fr-tooltip--shown");
  tooltip.classList.remove("fr-tooltip--hidding");
};

const hide = () => {
  tooltip.classList.add("fr-tooltip--hidding");
  tooltip.classList.remove("fr-tooltip--shown");
};

link.addEventListener("mouseenter", show, true);

link.addEventListener("mouseleave", (e) => {
  // si on quitte vers un enfant du lien → on ignore
  if (link.contains(e.relatedTarget)) {
    return;
  }
  hide();
}, true);

if (parent) {
  parent.addEventListener("mouseleave", (e) => {
    if (!parent.contains(e.relatedTarget)) {
      hide();
    }
  }, true);
}

link.__tooltipBound = true;
}

function setupTooltips() {
  const links = document.querySelectorAll('a[id^="link-tooltip-v-"]');
  links.forEach(bindTooltip);
}

onMounted(() => {
  setupTooltips();

  // Observer pour DOM dynamique
  tooltipObserver = new MutationObserver(() => {
    setupTooltips();
  });

  tooltipObserver.observe(tooltipContainer.value, {
    childList: true,
    subtree: true,
  });
});

onUnmounted(() => {
  if (tooltipObserver) {
    tooltipObserver.disconnect();
    tooltipObserver = null;
  }
});

onUpdated(() => {
});

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
      <table ref="tooltipContainer">
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
