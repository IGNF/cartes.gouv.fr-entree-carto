<script lang="js" setup>
  
import { ref, onMounted, onBeforeMount, onUnmounted } from 'vue'

import { useAuth } from 'authentification-vue-oidc';
import { useRandomId } from "@gouvminint/vue-dsfr"
import { useLogger } from 'vue-logger-plugin'

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

const log = useLogger();
const { isAuthenticated: authenticated } = useAuth();

const expandedMenuId = ref(undefined)

// INFO
// Afficher/masquer le menu dont l'id est passé en paramètre
const toggle = (id) => {
  // ajoute/enleve des events pour fermer les menus au click/echap
  let expanded = id !== expandedMenuId.value;
  if (expanded) {
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onKeyDown);
  } else {
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onKeyDown);
  }

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

onBeforeMount(() => {
  log.debug(`Navigation (${props.id}) before mount.`);
});
onMounted(() => {
  log.debug(`Navigation (${props.id}) mounted.`);
});
onUnmounted(() => {
  // on s'assure d'enlever les events au unmount (même si c'est pas censé arriver)
  document.removeEventListener('click', onDocumentClick);
  document.removeEventListener('keydown', onKeyDown);
});
</script>

<template>
  <CustomNavigationMenu
    v-for="(items, idx) of navItems"
    :id="items.id"
    :key="idx"
    :menu="items"
    :authenticated="authenticated"
    :expanded-id="expandedMenuId"
    @toggle-id="toggle($event)"
  />
</template>

<style>
.fr-nav__list {
  position: relative;
}
</style>