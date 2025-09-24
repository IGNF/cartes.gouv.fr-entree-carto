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
  <nav
    :id="id"
    class="fr-nav"
    role="navigation"
    :aria-label="label"
  >
    <ul class="fr-nav__list">
      <!-- @slot Slot par défaut pour le contenu de la liste. Sera dans `<ul class="fr-nav__list">` -->
      <DsfrNavigationItem
        v-for="(navItem, idx) of navItems"
        :id="navItem.id"
        :key="idx"
      >
      <CustomNavigationMenu
          v-bind="navItem"
          :expanded-id="expandedMenuId"
          @toggle-id="toggle($event)"
        />
      </DsfrNavigationItem>
    </ul>
  </nav>
</template>

<style>
.fr-nav__list {
  position: relative;
}
</style>