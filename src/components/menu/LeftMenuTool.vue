<script setup lang="js">
import MenuTierce from '@/components/menu/MenuTierce.vue';

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
          @open-control="closeMenu"
          @on-modal-share-open="$emit('onModalShareOpen')"
          @on-modal-print-open="$emit('onModalPrintOpen')"
          @on-modal-theme-open="$emit('onModalThemeOpen')"
        />
      </div>
    </template>
    <template #navButtons>
      <MenuLateralNavButton
        v-for="tab in tabArray"
        :side="side"
        :icon="tab.icon"
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
