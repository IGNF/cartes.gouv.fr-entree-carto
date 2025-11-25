<script lang="js" setup>
import { useRandomId } from "@gouvminint/vue-dsfr"

import CustomNavigationMenu from './CustomNavigationMenu.vue'

const props = defineProps({
    id: {
    type: String,
    default: () => useRandomId('nav'),
  },
  navItems: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: 'Menu principal',
  }
})

const expandedMenuId = ref(undefined)

const toggle = (id) => {
  if (id === expandedMenuId.value) {
    expandedMenuId.value = undefined
    return
  }
  expandedMenuId.value = id
}

const handleElementClick = (el) => {
  if (el === document.getElementById(props.id)) {
    return
  }

  if (!el?.parentNode) {
    toggle(expandedMenuId.value)
    return
  }

  handleElementClick(el.parentNode)
}

const onDocumentClick = (e) => {
  handleElementClick(e.target)
}

const onKeyDown = (e) => {
  if (e.key === 'Escape') {
    toggle(expandedMenuId.value)
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
      <CustomNavigationMenu
      v-for="(items, idx) of navItems"
          :key="idx"
          :id="items.id"
          :menu="items"
          :expanded-id="expandedMenuId"
          @toggle-id="toggle($event)"
        />
</template>

<style>
.fr-nav__list {
  position: relative;
}
</style>