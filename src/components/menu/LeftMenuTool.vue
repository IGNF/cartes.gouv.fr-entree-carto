<script setup lang="js">
import MenuTierce from '@/components/menu/MenuTierce.vue';
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
            componentName : "Enregistrement",
            icon : "ri-bookmark-line",
            title : "Mes Enregistrement",
            visibility: false
        }
    ];

    return arr
})

const activeTab = ref("MenuCatalogueContent")
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

function closeMenu() {
  wrapper.value.closeMenu()
}

function onEnregistrementOpen() {
  tabRefs.value.filter(r => r.id == "Enregistrement")[0].button.children[0].click()
}

const tabRefs = useTemplateRef('tabs')


const emit = defineEmits(['onModalShareOpen', 'onModalPrintOpen', 'onModalThemeOpen'])
</script>

<template>
  <MenuLateralWrapper
    :side="side"
    :visibility="true"
    id="MenuCatalogueContentClose"
    v-model="is_expanded"
    ref="wrapper">
    <template #content>
      <div id="MenuTierceContent"
        :class="[activeTab === 'MenuTierceContent' ? 'activeTab' : 'inactiveTab']" >
        <MenuTierce
          @on-modal-share-open="$emit('onModalShareOpen')"
          @on-modal-print-open="$emit('onModalPrintOpen')"
          @on-modal-theme-open="$emit('onModalThemeOpen')"
          @on-enregistrement-open="onEnregistrementOpen"
        />
      </div>
      <div id="EnregistrementContent"
        :class="[activeTab === 'EnregistrementContent' ? 'activeTab' : 'inactiveTab']" >
        Mes enregistrements
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
