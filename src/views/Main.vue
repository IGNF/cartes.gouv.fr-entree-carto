<script setup lang="ts">
import { markRaw } from 'vue'

// icones
import NotificationInfo from '@/icons/NotificationInfo.vue'
import NotificationSuccess from '@/icons/NotificationSuccess.vue'
import NotificationError from '@/icons/NotificationError.vue'
import NotificationWarning from '@/icons/NotificationWarning.vue'
import NotificationClose from '@/icons/NotificationClose.vue'

// composables
import { useMatchMedia } from '@/composables/matchMedia'
import { useBaseUrl } from '@/composables/baseUrl'

// library
import { Notivue, Notification, lightTheme, darkTheme, type NotivueTheme} from 'notivue'

// stores
import { useAppStore } from "@/stores/appStore"
import { useDomStore } from "@/stores/domStore"
import { useMapStore} from "@/stores/mapStore"
import { useServiceStore } from '@/stores/serviceStore'

const appStore = useAppStore()
const domStore = useDomStore()
const mapStore = useMapStore()
const serviceStore = useServiceStore()
const { theme } = useScheme();

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

const alertClosed = ref(false);
// gestion de l'alerte d'information sur la redirection depuis le geoportail
const alertData = {
    title : "Iframe obsolète",
    description : "<strong> Attention : le lien vers cette carte créée sur le Géoportail ne sera plus fonctionnel à compter du 20/06/2026. Pour le mettre à jour, rendez vous sur notre <a href=\"https://ignf.github.io/permalink-converter/\" target=\"_blank\"> convertisseur de liens </a> !</strong>",
}; 
const onCloseAlert = () => {
  alertClosed.value = true;
};

// Base URL pour les routes login/logout
const url = useBaseUrl() + import.meta.env.BASE_URL;

const sessionExpiredClosed = ref(false);
// gestion de l'alerte de session expirée
const sessionExpiredData = {
    title : "Session expirée",
    description : "Votre session a expirée. Veuillez vous reconnecter.",
    action : `<a href="${url}login">Se reconnecter</a>`
};
const onCloseSessionExpired = () => {
  sessionExpiredClosed.value = true;
};

onMounted(() => {
  appStore.detectFirstOpen()
})


</script>

<template>
  <CustomHeader />

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

  <!-- INFO
    Message d'information sur la redirection issue du geoportail 
    Le permalien possède la clef/valeur : "fromgpp=1"
    On informe donc l'utilisateur d'une action à faire.
  -->
  <div v-if="mapStore.isRedirect">
    <DsfrAlert
      type="warning"
      :title="alertData.title"
      :closeable="true"
      :closed="alertClosed"
      @close="onCloseAlert()"
    >
      <p v-html="alertData.description" />
    </DsfrAlert>
  </div>

  <div v-if="serviceStore.getAuthentificateSyncNeeded()">
    <DsfrAlert
      type="error"
      :title="sessionExpiredData.title"
      :small="true"
      :closeable="true"
      :closed="sessionExpiredClosed"
      @close="onCloseSessionExpired()"
    >
      <p>{{ sessionExpiredData.description }}</p>
      <p v-html="sessionExpiredData.action" />
    </DsfrAlert>
  </div>

  <div
    class="futur-map-container"
    :class="domStore.isHeaderCompact ? 'minimized': ''"
  >
    <router-view />
  </div>
  
  <CustomFooter
    v-if="!mobileScreen"
    compact
  />
</template>

<style lang="scss">
/* HACK Surcharge API Analytics */
  body.modal-open {
    overflow: unset;
  }

  .futur-map-container{
    width: 100%;
    height: calc(100vh - 169px);
  }
  .minimized.futur-map-container {
    height: calc(100vh - 108.5px);
  }

  @media (max-width: 991px) {
    .futur-map-container{
      height: calc(100vh - 165px);
      margin-bottom: 0px;

    }
    .minimized.futur-map-container {
      height: calc(100vh - 56px);
      margin-bottom: 0px;
    }
  }
  /* TODO :
  surcharge des popups de notifications :
  https://docs.notivue.smastrom.io/built-in-notifications/using-css-classes.html#targeting-elements
  */
  /*
  .Notivue__content-message {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: wrap;
  }
  */
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
