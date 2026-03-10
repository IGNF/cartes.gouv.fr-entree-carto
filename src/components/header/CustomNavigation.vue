<script lang="js" setup>
  
import { ref, onMounted, onBeforeMount, onUnmounted, inject } from 'vue'

import { useServiceStore } from '@/stores/serviceStore';
import { useAppStore } from '@/stores/appStore';
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
const appStore = useAppStore();

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

const emitter = inject('emitter');

const checkTemporalDocument = () => {
  // INFO
  // Délai (en ms) avant la restauration d'un document temporaire
  // du localStorage après la connexion de l'utilisateur.
  // Ce délai permet de s'assurer que les composants sont bien montés
  // avant de tenter de restaurer le document.
  const DOCUMENT_RESTORE_DELAY = 500;

  var docTemp = appStore.getDocumentTemporary();
  if (docTemp) {
    var jsonDocTemp = JSON.parse(docTemp);
    setTimeout(() => {
      /**
       * @event document:restore
       * @description Evenement pour restaurer un document temporaire
       * @property {Object} data - données du document
       * @property {String} componentName - nom du component qui emet l'event
       */
      emitter.dispatchEvent("document:restore", {
        data : jsonDocTemp,
        componentName : "CustomNavigation"
      });
    }, DOCUMENT_RESTORE_DELAY);
  }
}

var service = inject('services');
const authenticated = ref(false);

const checkAuthentication = async () => {
  authenticated.value = Boolean(service.authenticated);

  // INFO
  // on teste si une demande de connexion (ou de deconnexion) a été faite,
  // et si elle est valide, on demande le jeton de connexion, puis,
  // on récupère les informations utilisateurs.
  // Pour les favoris, on récupère aussi les documents.
  try {
    const status = await service.resolveAccessStatus();

    if (status !== "no-auth") {
      log.debug(`Access validated : ${status} !`);
      serviceStore.setAuthentificateSyncNeeded(false);
      router.replace({ path : '/', query: undefined });
    }

    if (status === "login") {
      log.debug("User connected.");
      authenticated.value = true;
      checkTemporalDocument();
      return;
    }

    if (status === "logout") {
      log.debug("User disconnected.");
      authenticated.value = false;
      appStore.clearDocumentTemporary();
      return;
    }

    // INFO
    // Pas de callback login/logout : on valide la session locale si nécessaire.
    if (service.isAuthenticatedLocally()) {
      log.debug("User already authentificate locally, checking session validity...");
      const isValid = await service.validateAuthentication();
      log.debug(`Checking session validity : ${isValid} !`);
      authenticated.value = Boolean(isValid);

      // le service ne renvoie rien (401 Unauthorized)
      // mais, on est encore enregistré comme authentifié
      // --> sync : on considère que la session est incohérente et
      //            on redirige vers la deconnexion
      if (!isValid && service.authenticated) {
        log.warn("Incoherent local session (401 côté IAM/API), redirect to logout.");
        authenticated.value = false;
        router.push({ path: '/logout', query: { from: 'authInvalid' } });
        return;
      }

      log.debug("validateAuthentication() finished !");
    } else {
      authenticated.value = false;
    }
  } catch (e) {
    console.warn(e);
    // push.error({
    //   title: t.auth.title,
    //   message: t.auth.failed(e.message || e)
    // });
  } finally {
    log.debug("resolveAccessStatus() finished !");
  }
}

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