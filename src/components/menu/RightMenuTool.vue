<script lang="js">
  /**
   * @description
   * Composant définissant le menu latéral droit contenant les outils
   * et le catalogue de données
   * 
   * @property { Array } selectedControls liste des Controls sélectionnés ajoutés à la carte par l'utilisateur
   * @property { Object } selectedLayers liste des Layers sélectionnés ajoutés à la carte par l'utilisateur
   * @listens emitter#catalog:open:clicked
   */
  export default {
    name: 'RightMenuTool'
  };
</script>
<script setup lang="js">

import MenuLateralWrapper from '@/components/menu/MenuLateralWrapper.vue';
import MenuLateralNavButton from '@/components/menu/MenuLateralNavButton.vue';
import MenuControl from '@/components/menu/MenuControl.vue';
// import MenuCatalogue from '@/components/menu/catalogue/MenuCatalogue.vue';

// import { useDataStore } from "@/stores/dataStore"
import { inject } from 'vue';

const props = defineProps({
  selectedControls: {
    type: Array,
    default: () => []
  },
  selectedLayers: {
    type: Object,
    default: () => ({})
  }
})

// var dataStore = useDataStore()

// Pour information, le menu lateral est un composant generique
// qui permet d'afficher un menu lateral gauche ou droit
// avec un ensemble d'ocatalognglets.

// Pour ajouter un onglet, il faut :
// 1. Ajouter l'onglet dans ce tableau
// 2. Ajouter le composant dans le template (slot content)
// 3. Ajouter le bouton dans le template (slot navButtons)
// 4. Ajouter le composant importé en haut du script
// 5. Ajouter le style de l'onglet en bas du fichier (si besoin)
// 6. Ajouter la gestion de l'onglet dans le script (si besoin)
// 7. Ajouter les props au composant (si besoin)
// 8. Ajouter les events au composant (si besoin)
// 9. Ajouter les emits au composant (si besoin)
// 10. Ajouter les listeners au composant (si besoin)
// 11. Utiliser les icones dans le fichier /src/iconscustom.ts (si besoin)

// position du menu lateral
const side = "right";

// abonnement sur l'ouverture du catalogue sur un evenement emis
const emitter = inject('emitter');

// Ce tableau donne l'ordre des icones du menu lateral
const tabArray = computed(() => {
    const arr = [
        {
            componentName : "MenuCatalogue",
            icon : "ri:map-2-line",
            title : "Catalogue de données",
            visibility : true,
            secondary : false,
            onClick: () => {
              emitter.dispatchEvent("catalog:open:clicked", {
                open : true,
                componentName: "MenuCatalogue"
              })
            }
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

// onglet actif
const activeTab = ref("MenuControlContent");
// etat d'ouverture du menu lateral
const is_expanded = ref();
// reference vers le wrapper du menu lateral
const wrapper = ref(null);

// gestion de l'ouverture/fermeture du menu lateral
function tabClicked(newTab) {
  const tab = tabArray.value.find(t => t.componentName === newTab);
  if (!tab) {
    return;
  }
  if (tabIsActive(newTab) && is_expanded.value) {
      wrapper.value.closeMenu();
  } else {
      activeTab.value = newTab + "Content";
      if (!Object.prototype.hasOwnProperty.call(tab, 'onClick') || tab.onClick === null) {
        wrapper.value.openMenu();
      }
  }
}

// fonction qui verifie si l'onglet est actif
function tabIsActive(componentName) {
  return activeTab.value.replace("Content" , '') === componentName ? true : false;
}

</script>

<template>
  <!-- Wrapper du menu lateral -->
  <MenuLateralWrapper
    :id="activeTab"
    ref="wrapper"
    v-model="is_expanded"
    :side="side"
    :visibility="true"
    :width="500"
  >
    <!-- Contenu du menu lateral -->
    <template #content>
      <!-- <div
        id="MenuCatalogueContent"
        :class="[activeTab === 'MenuCatalogueContent' ? 'activeTab' : 'inactiveTab']"
      >
        <MenuCatalogue
          :selected-layers="props.selectedLayers"
          :layers="dataStore.getLayers()"
        />
      </div>  -->
     
      <div
        id="MenuControlContent"
        :class="[activeTab === 'MenuControlContent' ? 'activeTab' : 'inactiveTab']"
      >
        <MenuControl 
          :selected-controls="props.selectedControls"
        />
      </div>
    </template>
    <!-- Boutons de navigation du menu lateral -->
    <template #navButtons>
      <MenuLateralNavButton
        v-for="tab in tabArray"
        :id="tab.componentName"
        :key="tab.componentName"
        :visibility="tab.visibility"
        :side="side"
        :icon="tab.icon"
        :active="tabIsActive(tab.componentName)"
        :title="tab.title"
        :secondary="tab.secondary"
        @click="tab.onClick"
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
