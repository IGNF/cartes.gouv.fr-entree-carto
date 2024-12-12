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

const icon = "LayerImport"
const defaultScale = 0.8325;
const iconProps = computed(() => typeof icon === 'string'
  ? { scale: defaultScale.value, name: icon }
  : { scale: defaultScale.value, ...icon },
);

</script>

<template>
<div class="container">
  <DsfrButton
    tertiary
    no-outline
    @click="$emit('onEnregistrementOpen')"
    icon="ri-bookmark-line"
    >
    Mes enregistrements
  </DsfrButton>
  <hr/>
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
    @click="$emit('onModalShareOpen')"
    >
    Partager, intégrer la carte
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    icon="px-print"
    @click="$emit('onModalPrintOpen')"
    >
    Imprimer
  </DsfrButton>
  <DsfrButton
    tertiary
    no-outline
    @click="$emit('onModalThemeOpen')"
    icon="fr-icon-theme-fill"
    >
    Paramètres d'affichage
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
  width: calc(100% - 60px);
  max-height: calc(70vh - 70px);
  overflow-y: auto;
  scrollbar-width: thin;
}
</style>
