<script lang="js">
  /**
   * @description
   * ...
   * @listens emitter#catalog:open:clicked
   */
  export default {
    name: 'RightMenuTool'
  };
</script>
<script setup lang="js">
import { useDataStore } from "@/stores/dataStore";
import MenuControl from '@/components/menu/MenuControl.vue';

import { inject } from 'vue';

const props = defineProps({
  selectedControls : {Object},
  selectedLayers : {Object}
})

const dataStore = useDataStore();

const side = "right";

// Ce tableau donne l'ordre des icones du menu lateral
const tabArray = computed(() => {
    const arr = [
        {
            componentName : "MenuCatalogue",
            icon : "octicon:book-24",
            title : "Catalogue de données",
            visibility : true,
            secondary : false
        },
        {
            componentName : "MenuControl",
            icon : "ri:tools-line",
            title : "Catalogue d'outils",
            visibility : true,
            secondary : true
        }
    ];

    return arr;
})

const activeTab = ref("MenuControlContent");
const is_expanded = ref();
const wrapper = ref(null);

function tabClicked(newTab) {
  if (tabIsActive(newTab) && is_expanded.value) {
      wrapper.value.closeMenu();
  } else {
      activeTab.value = newTab + "Content";
      wrapper.value.openMenu();
  }
}

// abonnement sur l'ouverture du catalogue sur un evenement emis
const emitter = inject('emitter');
emitter.addEventListener("catalog:open:clicked", (e) => {
  tabClicked(e.componentName);
});

function tabIsActive(componentName) {
    return activeTab.value.replace("Content" , '') === componentName ? true : false;
}

</script>

<template>
  <MenuLateralWrapper
    :id="activeTab"
    ref="wrapper"
    v-model="is_expanded"
    :side="side"
    :visibility="true"
    :width="500"
  >
    <template #content>
      <div
        id="MenuCatalogueContent"
        :class="[activeTab === 'MenuCatalogueContent' ? 'activeTab' : 'inactiveTab']"
      >
        <MenuCatalogue
          :selected-layers="selectedLayers"
          :layers="dataStore.getLayers()"
        />
      </div>
      <div
        id="MenuControlContent"
        :class="[activeTab === 'MenuControlContent' ? 'activeTab' : 'inactiveTab']"
      >
        <MenuControl 
          :selected-controls="selectedControls"
        />
      </div>
    </template>
    <template #navButtons>
      <MenuLateralNavButton
        v-for="tab in tabArray"
        :id="tab.componentName"
        :visibility="tab.visibility"
        :side="side"
        :icon="tab.icon"
        :active="tabIsActive(tab.componentName)"
        :title="tab.title"
        :secondary="tab.secondary"
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
