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


const mapStore = useMapStore();
const map = mapStore.getMap();

const openImport = () => {
map.getControls().getArray().forEach(control => {
  if (control.CLASSNAME == "ElevationPath") {
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
</script>

<template>
          
  <div @click="openImport">
    <VIcon v-bind="iconProps"/> Importer des données
  </div>
  <hr>
  <div>Cartes enregistrées</div>
  <div>Vos contributions</div>
  <div>Favoris</div>
  <hr>
  <div>Partager, intégrer la carte</div>
  <div>Exporter le fichier</div>
  <div>Imprimer</div>
  <hr>
  <div>Paramètres</div>
  <div>Paramètres d'affichage</div>
  <div>Aide</div>
  <hr>
  <div>Les nouvelles fonctionnalités</div>
  <a href="/a-propos">A propos</a>
  <div>Accessiblité partiellement conforme</div>
  <div>Données personnelles</div>
  <div>Gestion des cookies</div>
  <div>Mention légales</div>
  <a href="/plan-du-site">Plan du site</a>
</template>

<style scoped>

</style>
