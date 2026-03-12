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
import { useDomStore } from "@/stores/domStore"

const emitter = inject('emitter');

const domStore = useDomStore();
const mapStore = useMapStore();

const emit = defineEmits([
  'openControl',
  'onModalShareOpen',
  'onModalPrintOpen',
  'onBookMarksOpen'
]);

function onOpenControlReporting() {
  // on active le controle
  mapStore.addControl("Reporting");
  // envoi d'un evenement pour l'ouverture du contrôle
  setTimeout(() => {
    emitter.dispatchEvent("reporting:open:clicked", {
      open : true,
      componentName: "Reporting"
    });
    emit("openControl");
  }, 0);
}

function openControl(controlName) {
  mapStore.getMap().getControls().getArray().forEach(control => {
    if (control.CLASSNAME === controlName) {
      let button = [...control.element.children].filter((e) => {
        if (e.className.includes("GPshowOpen"))
            return e;
        })
        button[0].click();
        emit("openControl");
      }
  })
}

// INFO
// on active / desactive le bouton "Mes enregistrements" selon
// si on est authentifié ou pas
var service = inject('services');

const BookmarksButton = ref(null)
onMounted(() => {
    domStore.setBookmarksButton(BookmarksButton.value)
})
</script>

<template>
  <div class="container">
    <div ref="BookmarksButton">
      <DsfrButton
        tertiary
        no-outline
        :class="{'fr-btn--disabled': !service.authenticated }"
        icon="ri-bookmark-line"
        @click="$emit('onBookMarksOpen')"
      >
        Mes enregistrements
      </DsfrButton>
    </div>
    <hr>
    <DsfrButton
      tertiary
      no-outline
      icon="ri:file-upload-line"
      @click="openControl('LayerImport')"
    >
      Importer des données
    </DsfrButton>
    <DsfrButton
      tertiary
      no-outline
      icon="ri:share-2-fill"
      @click="$emit('onModalShareOpen')"
    >
      Partager, intégrer la carte
    </DsfrButton>
    <DsfrButton
      tertiary
      no-outline
      icon="fr-icon-printer-line"
      class="tierce-print"
      @click="$emit('onModalPrintOpen')"
    >
      Imprimer
    </DsfrButton>

    <DsfrButton
      tertiary
      no-outline
      icon="fr-icon-feedback-line"
      @click="onOpenControlReporting()"
    >
      Signaler une anomalie
    </DsfrButton>
    <hr>

    <div class="fr-btn fr-btn--tertiary-no-outline fr-btn--md fr-btn--icon-left fr-icon-layout-top-line">
      <DsfrToggleSwitch
        v-model="domStore.isHeaderCompact"
        label="Affichage compact"
        no-text
        class="fr-toggle--label-left"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.fr-btn),
:deep(.fr-toggle__label) {
  font-size: 0.875rem;
  color: var(--text-action-high-grey);
}

.fr-btn--disabled {
  color: var(--text-disabled-grey);

  --idle: transparent;
  --hover: inherit;
  --active: inherit;
}

.container {
  display: flex;
  flex-direction: column;
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
