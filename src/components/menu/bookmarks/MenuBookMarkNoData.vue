<script setup lang="js">

const buttons = [
  {
    label: 'Enregistrer une carte',
    icon: "fr-icon-save-fill",
    iconOnly: false,
    iconRight: false,
    secondary: true,
    onclick: () => {} // TODO
  },
  {
    label: 'Consulter le catalogue',
    icon: "fr-icon-highlight",
    iconOnly: false,
    iconRight: false,
    secondary: true,
    onclick: () => {} // TODO
  },
  {
    label: 'Importer un fichier',
    icon: "fr-icon-upload-fill",
    iconOnly: false,
    iconRight: false,
    secondary: true,
    onclick: () => {} // TODO
  }
];
</script>

<template>
  <div class="fr-container">
    <div class="content-container">
      <h4>
        Aucun enregistrement pour le moment
      </h4>
      <div>
        Enregsitrer vos cartes et données créées sur votre espace afin de les retrouver
        et de les utiliser à tout moment.
      </div>
      <div id="location-france"></div>
    </div>
    <div class="buttons-container">
      <DsfrButtonGroup
        :buttons="buttons" />
    </div>
  </div>
</template>

<style scoped>
.content-container {
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
</style>

<style>
/* HACK : sinon imposible d'avoir l'icone et le label */
.fr-btns-group:not(.fr-btns-group--sm):not(.fr-btns-group--lg):not([class^=fr-btns-group--icon-]):not([class*=" fr-btns-group--icon-"]) .fr-btn[class*=" fr-icon-"] {
  max-width: unset;
}
</style>