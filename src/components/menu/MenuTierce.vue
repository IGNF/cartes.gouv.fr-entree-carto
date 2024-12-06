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
import PrintModal from "../carte/control/PrintModal.vue";
const mapStore = useMapStore();
 
const refModalTheme = ref(null)
const modalShareRef = ref(null)
const refPrintModal = ref(null)
const emit = defineEmits(['openControl'])

function openControl(controlName) {
  mapStore.getMap().getControls().getArray().forEach(control => {
    if (control.CLASSNAME == controlName) {
      let button = [...control.element.children].filter(e => {
        if (e.className.includes("GPshowOpen"))
            return e
        })
        button[0].click()
        emit("openControl")
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
const onModalPrintOpen = () => {
  refPrintModal.value.onModalPrintOpen()
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
    icon="px-print"
    @click="onModalPrintOpen"
    >
    Imprimer
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    @click="onModalThemeOpen"
    icon="fr-icon-theme-fill"
    >
    Paramètres d'affichage
  </DsfrButton>
</div>

<ModalTheme ref="refModalTheme" />
<PrintModal ref="refPrintModal" />
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
