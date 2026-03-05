<script setup lang="ts">
import Main from './views/Main.vue';

// INFO
// Chargement direct de la page principale
// On peut prevoir à ce niveau : 
// - une page d'information
// - une page de maintenance
// Ces informations peuvent être fournies par un JSON de configuration editoriale 
</script>

<template>
  <Main />
</template>

<style lang="scss">
@import "./iconscustom.css";

body {
  min-height: 100vh;
}
#app {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
// si alerts
// on ajoute une ligne à la grille
#app:has(> .fr-alert) {
  grid-template-rows: auto auto 1fr auto;
}
// on positionne toutes les alertes dans la 2e ligne
#app > .fr-alert {
  grid-column: 1;
  grid-row: 2;
  background-color: var(--background-default-grey);
  margin-top: 0;
}
</style>
