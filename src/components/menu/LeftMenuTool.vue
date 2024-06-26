<script setup lang="js">

const props = defineProps({})

const side = "left"
const is_expanded = ref()

// Ce tableau donne l'ordre des icones du menu lateral
const tabArray = computed(() => {
    const arr = [
        {
            componentName : "MenuCatalogue",
            icon : "co-list-low-priority",
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
</script>

<template>
  <MenuLateralWrapper
    :side="side"
    :visibility="false"
    v-model="is_expanded"
    ref="wrapper">
    <template #content>
      <div id="MenuCatalogueContent" 
        :class="[activeTab === 'MenuCatalogueContent' ? 'activeTab' : 'inactiveTab']" >
        <slot></slot>
      </div>
    </template>
    <template #navButtons>
      <MenuLateralNavButton
        v-for="tab in tabArray"
        :icon="tab.icon"
        :id="tab.componentName"
        :active="tabIsActive(tab.componentName)"
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
