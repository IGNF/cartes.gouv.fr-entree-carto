<script setup lang="js">
import { useControlsMenuOptions } from '@/composables/controls'
import { useLogger } from 'vue-logger-plugin'
import { useMapStore } from "@/stores/mapStore"

const log = useLogger()
const mapStore = useMapStore();

const props = defineProps({
  selectedControls : Array
})

const selectedControls = defineModel()

const disabled = false
const inline = false
const required = false
const small = false
const opts = useControlsMenuOptions()

const allOptions = computed(() => {
  return opts.filter((opt) => {
    if (opt.label.toLowerCase().includes(searchString.value.toLowerCase()) 
    || opt.hint.toLowerCase().includes(searchString.value.toLowerCase())
    || opt.name.toLowerCase().includes(searchString.value.toLowerCase()))
      return opt
  })
})

const favOptions = computed(() => {
  if (props.selectedControls)
    return allOptions.value.filter((opt) => {
      if (props.selectedControls.includes(opt.name))
        return opt
      })
  else return []
})

const tabListName = "Gestion d'outils"
const tabTitles = [
  {
    title : "Mes Outils",
    tabId : "tab-0",
    panelId : "tab-content-0"
  },
  {
    title : "Ajouter des outils",
    tabId : "tab-1",
    panelId : "tab-content-10"
  }
]
const selectedTabIndex = ref(0)
const asc = ref(true)
const initialSelectedIndex = 0
function selectTab (idx) {
  asc.value = selectedTabIndex.value < idx
  selectedTabIndex.value = idx
}
const searchString = ref("")
function updateSearch(e) {
  searchString.value = e
}


watch(selectedControls, (values) => {
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
      <DsfrTabs
    :tab-list-name="tabListName"
    :tab-titles="tabTitles"
    :initial-selected-index="initialSelectedIndex"
    @select-tab="selectTab"
  >
    <DsfrTabContent
      panel-id="tab-content-0"
      tab-id="tab-0"
      :selected="selectedTabIndex === 0"
      :asc="asc"
    >
        <DsfrCheckboxSet
        v-model="selectedControls"
        :disabled="disabled"
        :inline="inline"
        :small="small"
        :required="required"
        :options="favOptions"
        :model-value="props.selectedControls"
      /> 
    </DsfrTabContent>
    <DsfrTabContent
      panel-id="tab-content-1"
      tab-id="tab-1"
      :selected="selectedTabIndex === 1"
      :asc="asc"
    >
        <DsfrCheckboxSet
        v-model="selectedControls"
        :disabled="disabled"
        :inline="inline"
        :small="small"
        :required="required"
        :options="allOptions"
        :model-value="props.selectedControls"
      /> 
    </DsfrTabContent>

  </DsfrTabs>
    </div>
 
</div>

</template>

<style scoped>
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
  width: -webkit-fill-available;
  height: -webkit-fill-available;
}
</style>
