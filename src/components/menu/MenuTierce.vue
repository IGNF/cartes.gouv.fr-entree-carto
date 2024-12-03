<script lang="js">
  /**
   * @description
   * ...
   * @property {Object} layers - Liste des couches du catalogue
   * @property {Object} selectedLayers - Liste des couches sélectionnées
   * @see LayerList
   * @see DataLayerCatalogue
   */
  export default {
    name: 'MenuTierce'
  };
</script>

<script setup lang="js">
import { useMapStore } from "@/stores/mapStore"
import ModalTheme from '@/components/modals/ModalTheme.vue'
import ShareModal from '@/components/carte/control/ShareModal.vue'

const mapStore = useMapStore();
const map = mapStore.getMap();
 
const refModalTheme = ref(null)
const modalShareRef = ref(null)

function openControl(controlName) {
  map.getControls().getArray().forEach(control => {
    if (control.CLASSNAME == controlName) {
      let button = [...control.element.children].filter(e => {
        if (e.className.includes("GPshowOpen"))
            return e
        })
        button[0].click()
      }
  })
}

const icon = "LayerImport"
const defaultScale = 0.8325;
const iconProps = computed(() => typeof icon === 'string'
  ? { scale: defaultScale.value, name: icon }
  : { scale: defaultScale.value, ...icon },
);

const onModalShareOpen = () => {
  modalShareRef.value.onModalShareOpen()
}
const onModalThemeOpen = () => {
  refModalTheme.value.openModalTheme()
}
</script>

<template>
<div class="container">
  <DsfrButton
    tertiary
    no-outline
    :icon="iconProps"
    @click="openControl('LayerImport')"
    >
    Importer des données
  </DsfrButton>
  <hr>
  <DsfrButton
    tertiary
    no-outline
    >
    Cartes enregistrées
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    >
    Vos contributions
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    >
    Favoris
  </DsfrButton>
  <hr>
  <DsfrButton
    tertiary
    no-outline
    icon="fr-icon-link"
    @click="onModalShareOpen"
    >
    Partager, intégrer la carte
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    @click="openControl('Export')"
    >
    Exporter le fichier
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    >
    Imprimer
  </DsfrButton>
  <hr>
  <DsfrButton
    tertiary
    no-outline
    >
    Paramètres
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    @click="onModalThemeOpen"
    icon="fr-icon-theme-fill"
    >
    Paramètres d'affichage
  </DsfrButton>  
  <DsfrButton
    tertiary
    no-outline
    >
    Aide
  </DsfrButton>
  <hr>
  <DsfrButton
    tertiary
    no-outline
    >
    Les nouvelles fonctionnalités
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    >
    A propos
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    >
    Accessiblité partiellement conforme
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    >
    Données personnelles
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    >
    Mention légales
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    >
    Plan du site
  </DsfrButton>
</div>

<ModalTheme ref="refModalTheme" />
<ShareModal ref="modalShareRef"/>
</template>

<style scoped>
a {
  text-decoration: none;
}
.container {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: calc(100% - 60px);
  max-height: calc(70vh - 70px);
  overflow-y: auto;
  scrollbar-width: thin;
}
.modal {
  z-index: 1;
}
</style>
