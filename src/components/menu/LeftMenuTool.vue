<script setup lang="js">
import MenuLateralWrapper from '@/components/menu/MenuLateralWrapper.vue';
import MenuLateralNavButton from '@/components/menu/MenuLateralNavButton.vue';
import MenuTierce from '@/components/menu/MenuTierce.vue';
import MenuBookMarks from '@/components/menu/MenuBookMarks.vue';

import { push } from 'notivue';

import { useTemplateRef } from 'vue';

const props = defineProps({
})

const side = "left"
const is_expanded = ref()

// Ce tableau donne l'ordre des icones du menu lateral
const tabArray = computed(() => {
    const arr = [
        {
            componentName : "MenuTierce",
            icon : "ri-menu-fill",
            title : "Menu Tierce",
            visibility: true
        },
        {
            componentName : "MenuBookMarks",
            icon : "ri-bookmark-line",
            title : "Mes Enregistrements",
            visibility: false // bouton invisible
        }
    ];

    return arr
})

const activeTab = ref("MenuCatalogueContent")
const wrapper = ref(null)
const width = 300;

// Gestion de l'ouverture / fermeture du panneau
function tabClicked(newTab) {
  if (tabIsActive(newTab) && is_expanded.value) {
    wrapper.value.closeMenu();
  } else {
    activeTab.value = newTab + "Content";
    // on change la largeur du menu pour les favoris
    if (newTab === "MenuBookMarks") {
      wrapper.value.widthMenu = 400;
    } else {
      wrapper.value.widthMenu = width;
    }
    wrapper.value.openMenu();
  }
}

function tabIsActive(componentName) {
  return activeTab.value.replace("Content" , '') === componentName ? true : false;
}

var service = inject('services');
var authenticated = computed(() => service.authenticated);
/**
 * Ouverture du menu des favoris si on est connecté,
 * sinon, on ouvre la modale de connexion
 */
function onBookMarksOpen() {
  // desactivation de la connexion aux favoris
  if (import.meta.env.IAM_DISABLE === '1') {
    return;
  }
  // INFO
  // on declenche le clic sur le bouton de 'MenuLateralNavButton' afin 
  // d'afficher le menu (cf. tabClicked()).
  // cette classe expose 
  // - l'id
  // - une méthode clickButton()
  tabRefs.value.forEach((e) => {
    if (e.id === "MenuBookMarks") {
      if (authenticated.value) {
        // on ouvre le menu des favoris
        e.clickButton();
      } else {
        // on ouvre la modale de connexion 
        // sans déclencher l'ouverture des favoris
        // on emet un evenement qui déclenche l'ouverture de la modale !
        // (cf. src/components/CartoAndTools.vue ~ onModalLoginOpen())
        emit('onModalLoginOpen');
      }
    }
  })
}

const tabRefs = useTemplateRef('tabs')

const emit = defineEmits([
  'onModalShareOpen', 
  'onModalPrintOpen', 
  'onModalThemeOpen',
  'onModalLoginOpen'
])
</script>

<template>
  <MenuLateralWrapper
    ref="wrapper"
    :side="side"
    :visibility="true"
    :width="width"
    :padding=16
    id="MenuCatalogueContentClose"
    v-model="is_expanded">
    <template #content>
      <div id="MenuTierceContent"
        :class="[activeTab === 'MenuTierceContent' ? 'activeTab' : 'inactiveTab']" >
        <MenuTierce
          @on-modal-share-open="$emit('onModalShareOpen')"
          @on-modal-print-open="$emit('onModalPrintOpen')"
          @on-modal-theme-open="$emit('onModalThemeOpen')"
          @on-book-marks-open="onBookMarksOpen"
        />
      </div>
      <div id="MenuBookMarksContent"
        :class="[activeTab === 'MenuBookMarksContent' ? 'activeTab' : 'inactiveTab']" >
        <MenuBookMarks></MenuBookMarks>
      </div>
    </template>
    <template #navButtons>
      <MenuLateralNavButton
        v-for="tab in tabArray" ref="tabs"
        :side="side"
        :icon="tab.icon"
        :visibility="tab.visibility"
        :id="tab.componentName"
        :active="tabIsActive(tab.componentName)"
        :title="tab.title"
        @tab-clicked="tabClicked"/>
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
