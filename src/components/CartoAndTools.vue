<script setup lang="ts">

import Carto from "@/components/carte/Carto.vue";
import LeftMenuTool from "@/components/menu/LeftMenuTool.vue";
import RightMenuTool from "@/components/menu/RightMenuTool.vue";

import LoginModal from "@/components/modals/ModalLogin.vue";
import ShareModal from "@/components/carte/control/ShareModal.vue";
import PrintModal from "@/components/carte/control/PrintModal.vue";
import SaveModal from "@/components/modals/ModalSave.vue";

import ModalWelcome from "@/components/modals/ModalWelcome.vue";

import { useDataStore } from "@/stores/dataStore";
import { useMapStore } from "@/stores/mapStore";
import { useLogger } from 'vue-logger-plugin';
import { useAppStore } from "@/stores/appStore";

import { fromShare } from "@/features/share";

import { getLayersFromPermalink } from "@/features/permalink";

import {
  fromLonLat as fromLonLatProj
} from "ol/proj";

// lib notification
import { push } from "notivue";

const mapStore = useMapStore();
const dataStore = useDataStore();
const appStore = useAppStore();
const logger = useLogger();

const emitter = inject('emitter') as any;

const refModalLogin = ref<InstanceType<typeof LoginModal> | null>(null);
const refModalShare = ref<InstanceType<typeof ShareModal> | null>(null);
const refModalSave = ref<InstanceType<typeof SaveModal> | null>(null);
const refModalWelcome = ref<InstanceType<typeof ModalWelcome> | null>(null);

provide("refModalShare", refModalShare);
provide("refModalLogin", refModalLogin);
provide("refModalSave", refModalSave);
provide("refModalWelcome", refModalWelcome);

// Les gestionnaires d'évenements des modales
const onModalShareOpen = () => {
  refModalShare.value.onModalShareOpen()
}
const onModalPrintOpen = () => {
  emitter.dispatchEvent('printmodal:open');
}
const onModalLoginOpen = () => {
  refModalLogin.value.openModalLogin(false)
}

const notifyAndCleanLayer = (id: string) => {
  // on ne peut pas la trouver, on ne l'ajoute pas
  mapStore.removeLayer(id);
  push.warning({
    title: "Exception",
    message: "La couche " + id + " n'existe pas !"
  });
};

const notifyAndCleanBookmark = (id: string) => {
  // on ne peut pas la trouver, on ne l'ajoute pas
  mapStore.removeBookmark(id);
  push.warning({
    title: "Exception",
    message: "Le bookmark " + id + " n'existe pas !"
  });
};

// INFO
// Les listes sont initialisées via le mapStore, et
// elles sont transmises à la cartographie à chaque fois
// que le mapStore est modifié.
// Chaque fois que des  modules modifient le mapStore en
// ajoutant des couches (ex. LayerSwitcher), on repasse
// via la reactivité dans ce cycle.

// liste des couches utilisateurs disponibles
// (cette liste est recalculée à chaque fois que le mapStore est modifié)
const selectedLayers = computed(() => {
  var layersValided: any = [];
  var layers = mapStore.getLayers();
  for (let i = 0; i < layers.length; i++) {
    var layerId = layers[i];
    var layer = dataStore.getLayerByID(layerId);
    if (!layer) {
      notifyAndCleanLayer(layerId);
      continue;
    }
    // les options de la couche sont récuperées dans le mapStore (permalink)
    var props = mapStore.getLayerProperty(layerId);
    // ajouter les options des couches
    // ex. l'opacité et la visibilité
    layer.position = props.position;
    layer.opacity = props.opacity;
    layer.visible = props.visible;
    layer.grayscale = props.grayscale;
    if (props.style) {
      // INFO
      // on ajoute le style de la couche si il est défini
      // ex. pour les couches de type TMS / MapBox
      layer.style = props.style;
    }
    layersValided.push(layer);
  }
  return layersValided;
});

// liste des favoris selectionnés par l'utilisateur, donc disponibles dans le permalien
// (cette liste est recalculée à chaque fois que le mapStore est modifié)
const selectedBookmarks = computed(() => {
  var bookmarksValided: any = [];
  var bookmarks = mapStore.getBookmarks();
  for (let i = 0; i < bookmarks.length; i++) {
    var bookmark = bookmarks[i];
    // transformer un partage d'URL en un objet
    var obj = fromShare(decodeURIComponent(bookmark));
    if (!obj) {
      // on ne peut pas le transformer, on ne l'ajoute pas
      notifyAndCleanBookmark(bookmark);
      continue;
    }
    // INFO
    // on a une condition spéciale pour écarter les documents
    // que l'on ne souhaite pas intégrer dans le mécanisme de reactivité
    //  ex. les favoris issus de l'outil de dessin
    //  car le widget Drawing a son propre mécanisme
    //  d'ajout de couche sur la carte...
    if (!obj.stop) {
      // on ajoute une clef unique... c'est un besoin interne
      obj.key = obj.id;
      /*
      * Liste des paramètres utiles (liste non exhaustive):
      * - url
      * - id
      * - name
      * - description
      * - format
      * - opacity
      * - visible
      * - grayscale
      * - position
      * - type (ex. drawing, import, service...)
      * - stop
      * - ...
      */
      bookmarksValided.push(obj);
    }
  }
  return bookmarksValided;
});

// liste des contrôles utilisateurs disponibles
// (cette liste est recalculée à chaque fois que le mapStore est modifié)
const selectedControls = computed(() => {
  let controls = mapStore.getControls();
  return controls;
});

// Référence au composant Carto
const cartoRef = ref(null);

// Gestion de la récupération des informations des villes
// Gestion des raccourcis des couches de données
const informationsData = ref({
  type: "",
  data: {}
});

onMounted(() => {
  if (appStore.siteOpened && refModalWelcome.value) {
    refModalWelcome.value.openModalWelcome();
  }

  // INFO
  // Lors d'une redirection , les données de la ville sont
  // passées dans le state de la route. 
  // On les récupère ici pour les stocker dans informationsData.
  if (history.state && history.state.cityinfo) {
    informationsData.value = {
      type : "cityinfo",
      data : history.state?.cityinfo
    }
    console.warn(informationsData.value)
    // centrer la carte sur les coordonnées de la ville
    if (cartoRef.value && cartoRef.value?.mapIsReady) {
      const center = fromLonLatProj([informationsData.value.data?.centre[1], informationsData.value.data?.centre[0]]);
      setTimeout(() => {
        var map = mapStore.getMap();
        map.getView().setZoom(10);
        map.getView().setCenter(center);
      },100);
    } 
  }
  
  // INFO
  // Lors d'une redirection , les données du raccourci sont
  // passées dans le state de la route. 
  // On les récupère ici pour les stocker dans informationsData.
  if (history.state && history.state.shortcut) {
    informationsData.value = {
      type : "shortcut",
      data : history.state?.shortcut
    }
    console.warn(informationsData.value)
    // executer le permalien du raccourci pour appliquer les changements sur la carte
    if (cartoRef.value && cartoRef.value?.mapIsReady) {
      setTimeout(() => {
        getLayersFromPermalink(informationsData.value.data.permalink);
      },100);
    }
  }
});

provide("selectedLayers", selectedLayers);
</script>

<template>
  <div id="map-and-tools-container">
    <!-- Le menu de gauche : le menu tierce (et les favoris)
     il y figure la liste des abonnements aux evenements sur le clic
     d'un élement du menu tierce
    -->
    <LeftMenuTool
      @on-modal-share-open="onModalShareOpen"
      @on-modal-print-open="onModalPrintOpen"
      @on-modal-login-open="onModalLoginOpen"
    />

    <!-- Module cartographique :
     - liste des couches selectionnées
     - liste des controles selectionnés
    -->
    <Carto
      ref="cartoRef"
      :selected-layers="selectedLayers"
      :selected-controls="selectedControls"
      :selected-bookmarks="selectedBookmarks"
    />

    <!-- Le menu des contrôles et le catalogue -->
    <RightMenuTool
      :selected-layers="selectedLayers"
      :selected-controls="selectedControls"
      :informations="informationsData"
    />

    <!-- Liste des modales -->
    <div class="modal-container">
      <ShareModal ref="refModalShare" />
      <LoginModal ref="refModalLogin" />
      <SaveModal ref="refModalSave" />
      <ModalWelcome ref="refModalWelcome" />
    </div>
  </div>
</template>

<style scoped>
  #map-and-tools-container{
    margin-left: 0;
    width: inherit;
    height: inherit;
    display: flex;
  }
</style>