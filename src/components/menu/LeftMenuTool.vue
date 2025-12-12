<script lang="js">
  /**
   * @description
   * ...
   * @listens emitter#leftmenu:close
   */
  export default {
    name: 'LeftMenuTool'
  };
</script>
<script setup lang="js">
import MenuLateralWrapper from '@/components/menu/MenuLateralWrapper.vue';
import MenuLateralNavButton from '@/components/menu/MenuLateralNavButton.vue';
import MenuTierce from '@/components/menu/MenuTierce.vue';
import MenuBookMarks from '@/components/menu/MenuBookMarks.vue';

import { useTemplateRef } from 'vue';
import { inject } from 'vue';

import { useDomStore } from '@/stores/domStore';

const domStore = useDomStore();

const props = defineProps({
})

const side = "left"
const is_expanded = ref()

const leftControls = ref(null)

// Ce tableau donne l'ordre des icones du menu lateral
const tabArray = computed(() => {
    const arr = [
        {
            componentName : "MenuTierce",
            icon : "ri-menu-add-fill",
            title : "Accéder à d'autres outils",
            visibility: true,
            secondary: true
        },
        {
            componentName : "MenuBookMarks",
            icon : "ri-bookmark-line",
            title : "Mes Enregistrements",
            visibility : false, // bouton invisible
            secondary : true
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

// abonnement sur la fermeture du catalogue sur un evenement emis
const emitter = inject('emitter');
emitter.addEventListener("leftmenu:close", (e) => {
  wrapper.value.closeMenu();
});

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

function onOpenControl() {
  // on ferme le menu lateral
  wrapper.value.closeMenu();
}

const tabRefs = useTemplateRef('tabs')

const emit = defineEmits([
  'onModalShareOpen',
  'onModalPrintOpen',
  'onModalThemeOpen',
  'onModalLoginOpen'
])

/**
 * Réinitialise le menu à "fermé" quand on ouvre un control extension
 * Excpetion pour l'overviewmap
 */
watch(() => domStore.getleftControlMenu(), (newVal) => {
  leftControls.value = newVal
  leftControls.value?.addEventListener("click", function (e) {
  if (!e.target.id.includes('OverviewMap') && e.target.ariaPressed == "true") {
    is_expanded.value = false;
  }
})
}, { immediate: true })
</script>

<template>
  <MenuLateralWrapper
    id="MenuCatalogueContentClose"
    ref="wrapper"
    v-model="is_expanded"
    :side="side"
    :visibility="true"
    :width="width"
    :padding="16"
  >
    <template #content>
      <div
        id="MenuTierceContent"
        :class="[activeTab === 'MenuTierceContent' ? 'activeTab' : 'inactiveTab']"
      >
        <MenuTierce
          @on-modal-share-open="$emit('onModalShareOpen')"
          @on-modal-print-open="$emit('onModalPrintOpen')"
          @on-modal-theme-open="$emit('onModalThemeOpen')"
          @on-book-marks-open="onBookMarksOpen"
          @open-control="onOpenControl"
        />
      </div>
      <div
        id="MenuBookMarksContent"
        :class="[activeTab === 'MenuBookMarksContent' ? 'activeTab' : 'inactiveTab']"
      >
        <MenuBookMarks />
      </div>
    </template>
    <template #navButtons>
      <MenuLateralNavButton
        v-for="tab in tabArray"
        :id="tab.componentName"
        :key="tab.componentName"
        ref="tabs"
        :side="side"
        :icon="tab.icon"
        :visibility="tab.visibility"
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
