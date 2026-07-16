<script setup lang="ts">
import { markRaw } from 'vue'

// icones
import NotificationInfo from '@/icons/NotificationInfo.vue'
import NotificationSuccess from '@/icons/NotificationSuccess.vue'
import NotificationError from '@/icons/NotificationError.vue'
import NotificationWarning from '@/icons/NotificationWarning.vue'
import NotificationClose from '@/icons/NotificationClose.vue'

// components
import Alerts from '@/components/modals/Alerts.vue'
import Modals from '@/components/modals/Modals.vue'
import CustomHeader from '@/components/header/CustomHeader.vue'
import { CgfrFooter } from 'cartes.gouv.fr-vue-components';

// composables
import { useMatchMedia } from '@/composables/matchMedia'

// library
import { Notivue, Notification, lightTheme, darkTheme, type NotivueTheme} from 'notivue'

// stores
import { useScheme } from '@gouvminint/vue-dsfr';
import { useAppStore } from "@/stores/appStore";
import { useDomStore } from "@/stores/domStore";
import { useRoute } from 'vue-router';
import { ROUTE_NAMES } from '@/router/routeNames';

const appStore = useAppStore()
const domStore = useDomStore()
const route = useRoute()
const { theme } = useScheme()

const isEmbedRoute = computed(() => route.name === ROUTE_NAMES.EMBED)

// paramètres de mediaQuery pour affichage HEADER et FOOTER
const mobileScreen = useMatchMedia('LG')

// customisation des icons dsfr pour les notifications
const myNotificationsIcons = {
  warning : markRaw(NotificationWarning),
  success : markRaw(NotificationSuccess),
  info : markRaw(NotificationInfo),
  error : markRaw(NotificationError),
  close : markRaw(NotificationClose)
}

// theme à customiser
const myNotificationsTheme: NotivueTheme = {
  '--nv-radius': '0',
  '--nv-width': '350px',
  '--nv-border-width': '1px',
  '--nv-icon-size': '30px',
  '--nv-success-accent': '#18753c', // And -bg, -fg, -border
  '--nv-success-border': '#18753c',
  '--nv-error-accent': '#ce0500',
  '--nv-error-border': '#ce0500',
  '--nv-warning-accent': '#b34000',
  '--nv-warning-border': '#b34000',
  '--nv-info-accent': '#0063cb',
  '--nv-info-border': '#0063cb'
}

// choix du theme en fonction du theme dark ou light
const notificationsTheme = computed(() => {
  if (theme.value) {
    if (theme.value === 'dark') {
      return {
        ...darkTheme,
        ...myNotificationsTheme
      };
    }
  }
  return {
    ...lightTheme,
    ...myNotificationsTheme
  };
});

onMounted(() => {
  console.info('✓ 🚀 Application démarrée');
  appStore.detectFirstOpen()
})

</script>

<template>
  <CustomHeader
    v-if="!isEmbedRoute && !domStore.isFullscreenPanoramax"
    class="CustomHeader"
  />

  <!-- Notifications
  -->
  <!-- Gestion des Notifications -->
  <Notivue v-slot="item">
    <Notification
      :item="item"
      :icons="myNotificationsIcons"
      :theme="notificationsTheme"
    />
  </Notivue>

  <Alerts class="Alerts" />

  <div class="futur-map-container Map">
    <router-view />
  </div>

  <div 
    v-if="!domStore.isFullscreenPanoramax"
    class="CustomFooter"
  >
    <CgfrFooter 
      v-if="!mobileScreen && !isEmbedRoute"
      compact 
    />
  </div>


  <Modals />
</template>

<style lang="scss">
@import "@/iconscustom.css";

body {
  min-height: 100vh;
}
/* HACK Surcharge API Analytics */
body.modal-open {
  overflow: unset;
}
#app {
  display: grid;
  // on définit 4 lignes (attention, il faut bien 4 enfants dans #app)
  // [nom] taille
  grid-template-rows:
    [header] auto
    [alerts] auto
    [map] 1fr
    [footer] auto;
  min-height: 100vh;
}
// on place les éléments
.CustomHeader {
  grid-row: header;
}
.Alerts {
  grid-row: alerts;
}
.Map {
  grid-row: map;
  min-height: min(75vh, 500px); // hauteur minimum (utile quand footer ouvert)
}
.CustomFooter {
  grid-row: footer;
  z-index: 10;
}

hr {
  margin: 1rem 0;
  padding: 0;
  height: 1px;
}

  /* TODO :
  surcharge des popups de notifications :
  https://docs.notivue.smastrom.io/built-in-notifications/using-css-classes.html#targeting-elements
  */
  
  .Notivue__content {
    width: min(92vw, 34rem);
    max-width: min(92vw, 34rem);
  }

  .Notivue__content-message {
    max-height: min(32vh, 12rem);
    overflow-y: auto;
    overflow-x: hidden;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  
  /*
  .Notivue__icon {
    color: white;
    display: flex;
    justify-content: center;
    align-items: start;
    overflow: visible;
    min-width: var(--nv-icon-size);
    width: var(--nv-icon-size);
    margin: 0;
  }
  */
 /*
  [data-notivue='error'] .Notivue__icon {
    background-color: #ce0500;
  }
  [data-notivue='success'] .Notivue__icon {
    background-color: #18753c;
  }
  [data-notivue='info'] .Notivue__icon {
    background-color: #0063cb;
  }
  [data-notivue='warning'] .Notivue__icon {
    background-color: #b34000;
  }
  [data-notivue='close'] .Notivue__icon {
    color: #070707;
  }
  */
</style>
