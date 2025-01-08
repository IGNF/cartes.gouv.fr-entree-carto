<script lang="js">
/**
 * @description
 * Menu des Favoris sans documents disponible
 * dans l'espace de l'utilisateur
 * 
 * @todo impl. handler sur l'enregistrement de la carte
 * @fixme impl. handler sur l'ouverture du catalogue
 */
export default {
  name: 'MenuBookMarkNoData'
};
</script>

<script setup lang="js">

import { useMapStore } from "@/stores/mapStore"
const mapStore = useMapStore();

const emit = defineEmits([
  'onOpenCatalog'
]);

const openControl = (controlName) => {
  mapStore.getMap().getControls().getArray().forEach(control => {
    if (control.CLASSNAME === controlName) {
      let button = [...control.element.children].filter((e) => {
        if (e.className.includes("GPshowOpen"))
            return e;
        })
        button[0].click();
      }
  })
};

const buttons = [
  {
    label: 'Enregistrer une carte',
    icon: "fr-icon-save-line",
    disabled: true,
    iconOnly: false,
    iconRight: false,
    secondary: true,
    class: 'bookmark-button-container',
    onclick: () => {
      // TODO realiser un enregistrement du permalien
      // dans l'espace personnel
    }
  },
  {
    label: 'Consulter le catalogue',
    icon: "fr-icon-highlight",
    iconOnly: false,
    iconRight: false,
    secondary: true,
    class: 'bookmark-button-container',
    onclick: () => {
      // FIXME comment emettre un event vers un autre composant hors parent ?
      emit('onOpenCatalog');
    }
  },
  {
    label: 'Importer un fichier',
    icon: "fr-icon-upload-line",
    iconOnly: false,
    iconRight: false,
    secondary: true,
    class: 'bookmark-button-container',
    onclick: () => {
      // ouvrir le contrôle d'import de données
      openControl('LayerImport');
    }
  }
];
</script>

<template>
  <div class="fr-container">
    <div class="bookmark-content-container">
      <h4>
        Aucun enregistrement pour le moment
      </h4>
      <div>
        Enregsitrer vos cartes et données créées sur votre espace afin de les retrouver
        et de les utiliser à tout moment.
      </div>
      <div id="location-france"></div>
    </div>
    <div class="bookmark-buttons-container">
      <DsfrButtonGroup
        :buttons="buttons" />
    </div>
  </div>
</template>

<style scoped>
.bookmark-content-container {
  width: 100%;
  text-align: center;
}
#location-france {
  display: inline-block;
  background-image: url(../../../assets/location-france.svg);
  background-repeat: no-repeat;
  height: 80px;
  width: 80px;
}
.bookmark-buttons-container {}
</style>

<style>
/* HACK : centrage des boutons */
.bookmark-button-container {
  display: flex;
  width: 100%;
  justify-content: center !important;
}
/* HACK : sinon imposible d'avoir l'icone et le label */
.fr-btns-group:not(.fr-btns-group--sm):not(.fr-btns-group--lg):not([class^=fr-btns-group--icon-]):not([class*=" fr-btns-group--icon-"]) .fr-btn[class*=" fr-icon-"] {
  max-width: unset;
}
</style>