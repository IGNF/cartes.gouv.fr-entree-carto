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
import { useMapStore } from "@/stores/mapStore"

import { inject } from 'vue';


const mapStore = useMapStore();

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


const topRightWidget = computed(() => {
    return mapStore.getMapTopRightContainer();
})

// watch(topRightWidget, (newtopRightWidget) => {
//   console.error(newtopRightWidget)
//   buttons.value.forEach(button => {
//       console.error(button)

//       if (newtopRightWidget && button) {
//         newtopRightWidget.prepend(button.$el) // <-- insère au début
//   }})
// })
// const buttons = ref([])

// onMounted(() => {
//   nextTick(() => {
//     console.error(buttons)
//     buttons.value.forEach((button, index) => {
//       console.error(button)
//       console.error(typeof topRightWidget.value)
//       // const parent = el?.parentNode;
//       // if (parent) {
//       //   parent.insertBefore(el, parent.children[index] || null);
//       // }

//     console.error("topRightWidget.value instanceof HTMLElement")
//     console.error(topRightWidget.value instanceof Node)
//       if (topRightWidget.value && button) {
//         topRightWidget.value.insertBefore(button, topRightWidget.value[index] || null) // <-- insère au début
//   }
//     })


//   })
// })

const teleportedInstances = ref([]);

function setTeleportedRef(instance, index) {
  teleportedInstances.value[index] = instance ?? null
}

function prependTeleports() {
  nextTick(() => {
    // récupérer les DOM des buttons exposés
    const nodes = teleportedInstances.value
      .map(i => i?.button?.value)
      .filter(Boolean)
    
    if (!nodes.length) return
    const parent = topRightWidget.value
    if (!parent) return

    // insérer en reverse pour respecter l’ordre
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i]
      if (node && node.parentNode === parent) {
        parent.insertBefore(node, parent.firstChild)
      }
    }
  })
}

onMounted(prependTeleports)
onUpdated(prependTeleports)
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
    <Teleport  v-if="topRightWidget && side=='right'" to="#position-container-top-right">
      <MenuLateralNavButton
        v-for="(tab, i) in tabArray"
        :ref="el => setTeleportedRef(el, i)"
        :key="tab.componentName"
        :id="tab.componentName"
        :visibility="tab.visibility"
        :side="side"
        :icon="tab.icon"
        :active="tabIsActive(tab.componentName)"
        :title="tab.title"
        :secondary="tab.secondary"
        classes="gpf-btn-icon"
        class="GPwidget gpf-widget gpf-widget-button gpf-mobile-fullscreen rightButton"
        @tab-clicked="tabClicked"
      />
    </Teleport>
  </template>
  </MenuLateralWrapper>
</template>



<style lang="scss">
.activeTab {
    display : block;
}

.inactiveTab {
    display : none;
}
.rightButton{
  display: contents;
}

#GPMenuCatalogue-1 {
  top: 0;
}
</style>
