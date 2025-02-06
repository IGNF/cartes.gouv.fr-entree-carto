<script lang="js">
  /**
   * @description
   * Menu de liens vers différents contenu
   * 1- ouverture d'un widget extension (ex : layerImport)
   * 2- ouverture d'une modal (ex: Print, parmaètres d'affichage)
   * 3- panel menuWrapper (ex: mes enregistrements)
   *
   * Les interactions pour ouvrir et fermer les fenêtres sont spécifiques à chacun de ces cas.
   *
   */
  export default {
    name: 'MenuTierce'
  };
</script>

<script setup lang="js">
import { useMapStore } from "@/stores/mapStore"
const mapStore = useMapStore();

const emit = defineEmits(['openControl', 'onModalShareOpen', 'onModalPrintOpen', 'onModalThemeOpen', 'onEnregistrementOpen'])

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

const icon = "mingcute:file-import-line"
const defaultScale = 0.8325;
const iconProps = computed(() => typeof icon === 'string'
  ? { scale: defaultScale.value, name: icon }
  : { scale: defaultScale.value, ...icon },
);

</script>

<template>
<div class="container">
  <!-- <DsfrButton
    tertiary
    no-outline
    @click="$emit('onEnregistrementOpen')"
    icon="ri-bookmark-line"
    >
    Mes enregistrements
  </DsfrButton>
  <hr/> -->
  <DsfrButton
    tertiary
    no-outline
    icon="mingcute:file-import-line"
    @click="openControl('LayerImport')"
    >
    Importer des données
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    icon="ant-design:link-outlined"
    @click="$emit('onModalShareOpen')"
    >
    Partager, intégrer la carte
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    icon="material-symbols:print-outline"
    @click="$emit('onModalPrintOpen')"
    class="tierce-print"
    >
    Imprimer
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    @click="$emit('onModalThemeOpen')"
    >
    <span class="fr-icon-theme-fill fr-link--icon-left"></span>  Paramètres d'affichage
  </DsfrButton>
</div>
</template>

<style scoped>
a {
  text-decoration: none;
}
.container {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: calc(100% - 32px);
  max-height: calc(70vh - 70px);
  overflow-y: auto;
  scrollbar-width: thin;
}

:deep(button) {
  font-size: 0.875rem;
  color: var(--text-action-high-grey);
}

@media (max-width: 576px) {
  .tierce-print {
    display: none;
  }
}

@media (max-height: 576px) {
  .tierce-print {
    display: none;
  }
}
</style>
