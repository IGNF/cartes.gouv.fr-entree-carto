<script lang="js" setup>
  
import { ref, onMounted, onBeforeMount, onUnmounted, inject } from 'vue'

import { useServiceStore } from '@/stores/serviceStore';
import { useRandomId } from "@gouvminint/vue-dsfr"
import { useLogger } from 'vue-logger-plugin'
import { useRouter } from 'vue-router';

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
const router = useRouter();
const serviceStore = useServiceStore();

const expandedMenuId = ref(undefined)
// INFO
// Afficher/masquer le menu dont l'id est passé en paramètre
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

var service = inject('services');
// INFO
// on teste si on est déjà authentifié ou pas, 
// et si oui, on synchronise l'état.
if (service.isAlreadyAuthentificate()) {
  // le portail renvoie un user authentifié
  // mais on doit vérifier que le token est encore valide
  // sinon, on demande une sync vers la page de login
  log.debug("User already authentificate, checking token validity...");
  service.isAuthentificate()
    .then((status) => {
      log.debug(`Checking token validity : ${status} !`);
      // le service ne renvoie rien (401 Unauthorized)
      // mais, on est encore enregistré comme authentifié
      // --> demande de sync à faire !
      if (!status && service.authenticated) {
        serviceStore.setAuthentificateSyncNeeded(true);
      }
    })
    .catch((e) => {
      console.warn(e);
    })
    .finally(() => {
      log.debug("isAuthentificate() finished !");
    });
} else {
  log.debug("User not authentificate.");
  serviceStore.setAuthentificateSyncNeeded(false);
}

// INFO
// on teste si une demande de connexion (ou de deconnexion) a été faite,
// et si elle est valide, on demande le jeton de connexion, puis,
// on récupère les informations utilisateurs.
// Pour les favoris, on récupère aussi les documents.
service.isAccessValided()
  .then((status) => {
    if (status !== "no-auth") {
      log.debug(`Access validated : ${status} !`);
      serviceStore.setAuthentificateSyncNeeded(false);
      router.replace({ path : '/', query: undefined });
    }
  })
  .catch((e) => {
    console.warn(e);
    // push.error({
    //   title: t.auth.title,
    //   message: t.auth.failed(e.message || e)
    // });
  })
  .finally(() => {
    log.debug("isAccessValided() finished !");
  });

onBeforeMount(() => {
  log.debug(`Navigation (${props.id}) mounted.`)
});
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
    :id="items.id"
    :key="idx"
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