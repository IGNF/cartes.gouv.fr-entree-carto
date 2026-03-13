<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from '@/stores/dataStore';
import { useMapStore } from '@/stores/mapStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { Territories } from 'geopf-extensions-openlayers';

// lib notification
import { push } from 'notivue';
import t from '@/features/translation';

const props = defineProps({
  mapId: {
    type: String,
    default: ''
  },
  visibility: Boolean,
  analytic: Boolean,
  territoriesOptions: {
    type: Object,
    default: () => ({})
  }
});

const log = useLogger();
const dataStore = useDataStore();
const mapStore = useMapStore();

const map = inject(props.mapId)
const territories = ref(new Territories(props.territoriesOptions));

// FIXME : à revoir...
// trop complexe et pas optimal pour reordonner les territoires

function getTerritories () {
  return territories.value.territories;
}

function findTerritoryById (id) {
  return getTerritories().find((territory) => territory.data.id === id);
}

function getDefaultTerritories () {
  return dataStore.getTerritories().filter((territory) => {
    territory.default = true;
    return territory.id !== 'ATF' && territory.id !== 'IDF';
  });
}

function getMissingDefaultTerritoriesFromStore () {
  // on recupère les territoires sélectionnés par l'utilisateur
  // on filtre les territoires par défaut pour ne garder que ceux qui ne sont plus présents dans le store
  const selectedTerritoryIds = new Set(mapStore.getTerritories().map((territory) => territory.id));
  return getDefaultTerritories().filter((territory) => territory.default && !selectedTerritoryIds.has(territory.id));
}

function getCustomTerritoriesFromStore () {
  // on recupère les territoires par défaut
  // on filtre les territoires du store pour ne garder que ceux qui ne sont pas des territoires par défaut
  const defaultTerritoryIds = new Set(getDefaultTerritories().map((territory) => territory.id));
  return mapStore.getTerritories().filter((territory) => !defaultTerritoryIds.has(territory.id));
}

function setReorderTerritories (territoryIds = [], territories) {
  const orderedTerritories = [];
  const storeById = new Map(territories.map((territory) => [territory.id, territory]));

  // on ajoute d'abord les territoires dans l'ordre défini par le widget
  territoryIds.forEach((id) => {
    const territory = storeById.get(id);
    if (territory) {
      orderedTerritories.push(territory);
      storeById.delete(id);
    }
  });

  // on ajoute ensuite les territoires qui ne sont pas dans l'ordre défini par le widget 
  // (ex: territoires de l'utilisateur)
  territories.forEach((territory) => {
    if (storeById.has(territory.id)) {
      orderedTerritories.push(territory);
      storeById.delete(territory.id);
    }
  });

  return orderedTerritories;
}

function addDefaultTerritories () {
  // on recupère les territoires par défaut et on les ajoute au widget
  // on alimente le store utilisateur avec les territoires par défaut 
  // uniquement si le store est vide (première ouverture de la carte) !
  var toBeSaveToStore = (mapStore.getTerritories().length === 0);
  var t = getDefaultTerritories();
  for (let i = 0; i < t.length; i++) {
    var territory = t[i];
    territories.value.setTerritory(territory);
    if (toBeSaveToStore) {
      mapStore.addTerritory(territory);
    }
  }
}

function addCustomTerritories () {
  // on supprime les territoires (default) qui ont été écartés par l'utilisateur
  const missingDefaultTerritories = getMissingDefaultTerritoriesFromStore();
  missingDefaultTerritories.forEach((territory) => {
    territories.value.removeTerritory(findTerritoryById(territory.id));
  });

  // on ajoute les territoires customisés par l'utilisateur
  const customTerritories = getCustomTerritoriesFromStore();
  customTerritories.forEach((territory) => {
    territories.value.setTerritory(territory, true);
  });

  // FIXME : à revoir..., ça ne marche pas.
  // on ordonne les territoires dans le widget en fonction de l'ordre défini 
  // par l'utilisateur dans le store
  const territoryIds = mapStore.getTerritories().map((territory) => territory.id);
  const territoriesList = territories.value.getTerritories();
  const territoriesOrdered = setReorderTerritories(territoryIds, territoriesList);
  territories.value.setTerritories(territoriesOrdered);
}

onMounted(() => {
  if (props.visibility) {
    addDefaultTerritories();
    addCustomTerritories();
    map.addControl(territories.value)
    if (props.analytic) {
      var el = territories.value.element.querySelector("button[id^=GPshowTerritoriesPicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget */
    territories.value.on("territories:order", onOrderTerritories);
    territories.value.on("territories:add", onAddTerritories);
    territories.value.on("territories:remove", onRemoveTerritories);
    territories.value.on("territories:reset", onResetTerritories);
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map.removeControl(territories.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    addDefaultTerritories();
    addCustomTerritories();
    map.addControl(territories.value);
    if (props.analytic) {
      var el = territories.value.element.querySelector("button[id^=GPshowTerritoriesPicto-]");
      useActionButtonEulerian(el);
    }
    /* abonnement au widget */
    territories.value.on("territories:order", onOrderTerritories);
    territories.value.on("territories:add", onAddTerritories);
    territories.value.on("territories:remove", onRemoveTerritories);
    territories.value.on("territories:reset", onResetTerritories);
  }
})

/** 
 * gestionnaire d'evenement sur les abonnements
 * @description
 * ...
 */
const onResetTerritories = (e) => {
  log.debug(e);
  mapStore.addTerritories(getDefaultTerritories());
  push.info({
    title: t.territories.title,
    message: t.territories.reset,
  });
}
const onOrderTerritories = (e) => {
  log.debug(e);

  const territoryIds = e.territories.map((territory) => territory.id);
  const territories = mapStore.getTerritories();
  mapStore.addTerritories(setReorderTerritories(territoryIds, territories));

  push.info({
    title: t.territories.title,
    message: t.territories.change,
  });
}
const onAddTerritories = (e) => {
  log.debug(e);
  mapStore.addTerritory(e.territory);
  push.info({
    title: t.territories.title,
    message: t.territories.add(e.territory.title),
  });
}
const onRemoveTerritories = (e) => {
  log.debug(e);
  mapStore.removeTerritory(e.territory);
  push.info({
    title: t.territories.title,
    message: t.territories.remove(e.territory.title),
  });
}
</script>

<template>
  <div />
</template>

<style lang="scss">
#add-view-form-fieldset {
  margin-bottom: 0;
}

.gpf-panel__body_territories {
  max-height: initial;
}
</style>
