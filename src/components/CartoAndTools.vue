<script setup lang="ts">
import Carto from '@/components/carte/Carto.vue'
import LeftMenuTool from '@/components/menu/LeftMenuTool.vue'
import RightMenuTool from '@/components/menu/RightMenuTool.vue'

import ThemeModal from '@/components/modals/ModalTheme.vue'
import LoginModal from "@/components/modals/ModalLogin.vue";
import ShareModal from '@/components/carte/control/ShareModal.vue'
import PrintModal from "@/components/carte/control/PrintModal.vue";
import SaveModal from "@/components/modals/ModalSave.vue";

import { useDataStore } from "@/stores/dataStore"
import { useMapStore } from "@/stores/mapStore"

import { fromShare } from '@/features/share';

// lib notification
import { push } from 'notivue';
import t from '@/features/translation';

const mapStore = useMapStore();
const dataStore = useDataStore();

const refModalTheme: ThemeModal = ref({})
const refModalLogin: LoginModal = ref({})
const refModalShare: ShareModal = ref({})
const refModalPrint: PrintModal = ref({})
const refModalSave: SaveModal = ref({})

provide("refModalPrint", refModalPrint)
provide("refModalShare", refModalShare)
provide("refModalTheme", refModalTheme)
provide("refModalLogin", refModalLogin)
provide("refModalSave", refModalSave)

// Les gestionnaires d'évenements des modales
const onModalShareOpen = () => {
  refModalShare.value.onModalShareOpen()
}
const onModalThemeOpen = () => {
  refModalTheme.value.openModalTheme()
}
const onModalPrintOpen = () => {
  refModalPrint.value.onModalPrintOpen()
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

const cartoRef = ref(null)

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
      @on-modal-theme-open="onModalThemeOpen"
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
    />
    <!-- Liste des modales -->
    <div class="modal-container">
      <ThemeModal ref="refModalTheme" />
      <PrintModal
        ref="refModalPrint"
        :selected-bookmarks="selectedBookmarks"
      />
      <ShareModal ref="refModalShare" />
      <LoginModal ref="refModalLogin" />
      <SaveModal ref="refModalSave" />
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

<style>
/* FIXME Style non scopé pour cacher les boutons partage et de menu
à voir si c'est factorisable avec ce qui est fait l153 de MenuLateralWrapper.vue */
@media (max-width: 576px) {
  #map-and-tools-container:has(.gpf-mobile-fullscreen > button[aria-pressed="true"]) .navButton,
  #map-and-tools-container:has(.gpf-mobile-fullscreen > button[aria-pressed="true"]) #share-button-position {
    display: none;
  }
}

/* FIXME
Cache le menu latéral si widget ouvert...
*/
#map-and-tools-container:has(#position-container-top-right > div > button[aria-pressed="true"]) .menu-toggle-wrap.right .menu-content-list  {
  display: none;
}
#map-and-tools-container:has(#position-container-bottom-left > div > button[aria-pressed="true"]) .menu-toggle-wrap.left .menu-content-list  {
  display: none;
}

#map-and-tools-container:has(.gp-label-div) .menu-toggle-wrap.left .menu-content-list  {
    display: none;
}
#map-and-tools-container:has(.gp-styling-div) .menu-toggle-wrap.left .menu-content-list  {
    display: none;
}
</style>
