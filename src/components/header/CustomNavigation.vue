<script lang="js" setup>
  
import { ref, onMounted, onBeforeMount, onUnmounted, inject } from 'vue'

import { useAppStore } from '@/stores/appStore';
import { useRandomId } from "@gouvminint/vue-dsfr"
import { useLogger } from 'vue-logger-plugin'
import { useAuthentication } from '@/composables/useAuthentication';

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
const appStore = useAppStore();
const emitter = inject('emitter');

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

const checkTemporalDocument = () => {
  const DOCUMENT_RESTORE_DELAY = 500;

  const docTemp = appStore.getDocumentTemporary();
  if (docTemp) {
    const jsonDocTemp = JSON.parse(docTemp);
    setTimeout(() => {
      emitter.dispatchEvent('document:restore', {
        data: jsonDocTemp,
        componentName: 'CustomNavigation'
      });
    }, DOCUMENT_RESTORE_DELAY);
  }
}

const { authenticated, checkAuthentication } = useAuthentication({
  onLogin: () => {
    checkTemporalDocument();
  },
  onLogout: () => {
    appStore.clearDocumentTemporary();
  }
});

onBeforeMount(() => {
  log.debug(`Navigation (${props.id}) before mount.`);
});
onMounted(() => {
  log.debug(`Navigation (${props.id}) mounted.`);
  checkAuthentication();
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