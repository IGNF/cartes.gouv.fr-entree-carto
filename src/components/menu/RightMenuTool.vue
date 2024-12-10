<script setup lang="js">
import { useDataStore } from "@/stores/dataStore"
import MenuControl from '@/components/menu/MenuControl.vue';

const props = defineProps({
  selectedControls : {Object},
  selectedLayers : {Object}
})

const dataStore = useDataStore();

const side = "right"

// Ce tableau donne l'ordre des icones du menu lateral
const tabArray = computed(() => {
    const arr = [
        {
            componentName : "MenuCatalogue",
            icon : "catalogIcon",
            title : "Catalogue de données",
            visibility : true
        },
        {
            componentName : "MenuControl",
            icon : "menuWidgetIcon",
            title : "Catalogue d'outils",
            visibility : true
        }
    ];

    return arr
})

const activeTab = ref("MenuControlContent")
const is_expanded = ref()
const wrapper = ref(null)

function tabClicked(newTab) {
  if (tabIsActive(newTab) && is_expanded.value)
      wrapper.value.closeMenu()
  else{
      activeTab.value = newTab + "Content";
      wrapper.value.openMenu()
  }
}

function tabIsActive(componentName) {
    return activeTab.value.replace("Content" , '') === componentName ? true : false
}
</script>

<template>
  <MenuLateralWrapper
    :side="side"
    :visibility="true"
    :id="activeTab"
    v-model="is_expanded"
    ref="wrapper">
    <template #content>
      <div id="MenuCatalogueContent"
        :class="[activeTab === 'MenuCatalogueContent' ? 'activeTab' : 'inactiveTab']" >
        <MenuCatalogue
        :selected-layers="selectedLayers"
        :layers="dataStore.getLayers()"/>
      </div>
      <div id="MenuControlContent"
        :class="[activeTab === 'MenuControlContent' ? 'activeTab' : 'inactiveTab']" >
        <MenuControl 
          :selected-controls="selectedControls"/>
      </div>
    </template>
    <template #navButtons>
      <MenuLateralNavButton
        v-for="tab in tabArray"
        :visibility="tab.visibility"
        :side="side"
        :icon="tab.icon"
        :id="tab.componentName"
        :active="tabIsActive(tab.componentName)"
        :title="tab.title"
        @tab-clicked="tabClicked"
        />
    </template>
  </MenuLateralWrapper>
</template>



<style scoped lang="scss">
.activeTab {
    display : block;
}

.inactiveTab {
    display : none;
}
</style>
