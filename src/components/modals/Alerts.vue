<template>
  <div class="alerts">
    <!-- INFO
      Message d'information sur la redirection issue du geoportail 
      Le permalien possède la clef/valeur : "fromgpp=1"
      On informe donc l'utilisateur d'une action à faire.
    -->
    <Alert
      v-if="mapStore.isRedirect"
      type="warning"
      title="Iframe obsolète"
    >
      <p>
        <strong> Attention : le lien vers cette carte créée sur le Géoportail ne sera plus fonctionnel à compter du 31/12/2026. Pour le mettre à jour, rendez vous sur notre <a
          href="https://ignf.github.io/permalink-converter/"
          target="_blank"
        >convertisseur de liens !</a></strong>
      </p>
    </Alert>

    <!-- INFO
      Message d'information sur la nécessité de se reconnecter 
      pour enregistrer un document temporaire
      Via la clef/valeur : "authentificateSyncNeeded=1"
    -->
    <Alert
      v-if="authentificateSyncNeeded"
      type="warning"
      title="Connexion requise"
      :closed="temporyDocumentClosed"
      @close="onCloseTemporyDocument()"
    >
      <p>Connectez-vous pour enregistrer le document temporaire.</p>
      <p><a :href="loginUrl">Se reconnecter</a></p>
    </Alert>

    <Alert
      v-for="alert in notDismissibleAlerts"
      :key="`alert-${alert.id}`"
      :type="alert.severity"
      :title="alert.title"
      dismissible
      @dismiss="setDismissed(alert.id)"
    >
      <p>
        <strong>{{ alert.description }}</strong> - {{ alert.details }}
        <a
          :href="alert.url"
          title="ouvre une nouvelle fenêtre"
          target="_blank"
          class="fr-notice__link"
        >
          {{ alert.link.label }}
        </a>
      </p>
    </Alert>
  </div>
</template>

<script setup>

import { useAppStore } from '@/stores/appStore';
import { useDataStore } from '@/stores/dataStore';
import { useMapStore} from '@/stores/mapStore';
import { useServiceStore } from '@/stores/serviceStore';
import { useBaseUrl } from '@/composables/baseUrl';
import Alert from '@/components/modals/Alert.vue';

let appStore = useAppStore();
let dataStore = useDataStore();
let mapStore = useMapStore();
let serviceStore = useServiceStore();

// Login URL
let loginUrl = useBaseUrl() + import.meta.env.BASE_URL + 'login';

// Documents temporaires
const temporyDocumentClosed = ref(false);
const authentificateSyncNeeded = computed(() => serviceStore.authentificateSyncNeeded);
watch(authentificateSyncNeeded, (needAuth) => {
  if (needAuth) {
    temporyDocumentClosed.value = false;
  }
});
const onCloseTemporyDocument = () => {
  // INFO
  // En cas de fermeture de l'alerte, on considère que l'utilisateur
  // ne souhaite pas se reconnecter pour enregistrer le document temporaire.
  temporyDocumentClosed.value = true;
  serviceStore.setAuthentificateSyncNeeded(false);
  appStore.clearDocumentTemporary();
};

// Recupere les alertes
let alerts = computed(() => {
  let lstAlerts = dataStore.getAlerts();
  return lstAlerts.map((alert) => {
    // link : par défaut, url relative à cartes.gouv.fr
    let url = alert.link.url;
    if (url.startsWith('/')) {
      url = useBaseUrl() + alert.link.url;
    }
    alert.url = url;
    return alert;
  })
});

// les alertes hors "ne plus afficher"
let notDismissibleAlerts = computed(() => {
  return alerts.value.filter((alert) => {
    if (localStorage.getItem(appStore.ns('alerts'))) {
      let dismissibleAlerts = JSON.parse(localStorage.getItem(appStore.ns('alerts')));
      return !dismissibleAlerts.includes(alert.id);
    }
    return true;
  });
});

// stocke les alertes "ne plus afficher"
let setDismissed = (alertId) => {
  let dismissibleAlerts = [];
  if (localStorage.getItem(appStore.ns('alerts'))) {
    dismissibleAlerts = JSON.parse(localStorage.getItem(appStore.ns('alerts')));

    // vide un peu (on supprime les 2 plus anciennes alertes quand la taille dépasse 5)
    if (dismissibleAlerts.length > 5) {
      dismissibleAlerts.splice(0, 2);
    }
  }

  dismissibleAlerts.push(alertId);

  localStorage.setItem(appStore.ns('alerts'), JSON.stringify(dismissibleAlerts));
}
</script>
