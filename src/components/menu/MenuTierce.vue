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
  'onModalThemeOpen',
  'onBookMarksOpen'
]);

const isCompact = ref(domStore.getIsHeaderCompact())

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

function onToggleHeaderCompact() {
  isCompact.value = !isCompact.value
  domStore.setIsHeaderCompact(isCompact.value);
}

const icon = "mingcute:file-import-line"
const defaultScale = 0.8325;
const iconProps = computed(() => typeof icon === 'string'
  ? { scale: defaultScale.value, name: icon }
  : { scale: defaultScale.value, ...icon },
);

// INFO
// on active / desactive le bouton "Mes enregistrements" selon
// si on est authentifié ou pas
var service = inject('services');
var authenticatedValue = computed(() => service.authenticated);
// INFO
// on est sur un faux "disabled" du bouton
// car on souhaite que les evenements soient toujours actifs
const authenticatedClass = ref({
  authenticatedProperty: !authenticatedValue.value
});

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
        :class="authenticatedClass"
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
    <DsfrButton
      tertiary
      no-outline
      @click="$emit('onModalThemeOpen')"
    >
      <span class="fr-icon-theme-fill fr-link--icon-left" />  Paramètres d'affichage
    </DsfrButton>

    <DsfrButton
      tertiary
      no-outline
      @click="onToggleHeaderCompact"
    >
    <div class="compact-toggle">
      <span class="fr-icon-layout-top-line fr-link--icon-left" />
      Affichage compact
      <DsfrToggleSwitch
        no-text
        label-left
        v-model="isCompact"
        @click.stop
        @click="domStore.setIsHeaderCompact(!isCompact)"
      />
    </div>
    </DsfrButton>
  </div>
</template>

<style scoped>
.authenticatedProperty {
  --hover: inherit;
  --active: inherit;
  background-color: transparent;
  color: var(--text-disabled-grey);
}

a {
  text-decoration: none;
}
.container {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: calc(100% - 32px);
  max-height: calc(76.8vh - 70px);
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

.compact-toggle {
  display: flex;
  justify-content: space-between;
}
</style>
