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

/**
 * Récupère les territoires par défaut
 * On écarte les territoires ATF et IDF qui ne sont pas pertinents pour l'affichage
 * @returns {Array} Liste des territoires par défaut
 */
function getDefaultTerritories () {
  return dataStore.getTerritories().filter((territory) => {
    territory.default = true;
    return territory.id !== 'ATF' && territory.id !== 'IDF';
  });
}

/**
 * Réordonne les territoires dans le store en fonction de l'ordre défini par l'utilisateur dans le widget
 * @param {Array} territoryIds - Liste des identifiants des territoires dans l'ordre défini par l'utilisateur
 * @param {Array} territories - Liste des territoires dans le store
 * @returns {Array} Liste des territoires réordonnés
 */
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

/**
 * Ajoute les territoires dans le widget et dans le store si nécessaire
 * @description
 * On vérifie si les territoires sont déjà présents dans le store, 
 * - si oui on les récupère, 
 * - sinon on utilise les territoires par défaut. 
 */
function addTerritories () {
  var hadTerritoriesIntoStore = (mapStore.getTerritories().length !== 0);
  var t = (hadTerritoriesIntoStore) ? mapStore.getTerritories() : getDefaultTerritories();

  for (let i = 0; i < t.length; i++) {
    var territory = t[i];
    territories.value.setTerritory(territory);
    if (!hadTerritoriesIntoStore) {
      mapStore.addTerritory(territory);
    }
  }
}

onMounted(() => {
  if (props.visibility) {
    addTerritories();
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
    addTerritories();
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
  // on ajoute les territoires par défaut dans le widget et dans le store
  mapStore.addTerritories(getDefaultTerritories());
  territories.value.removeTerritories();
  addTerritories();
  push.info({
    title: t.territories.title,
    message: t.territories.reset,
  });
}
const onOrderTerritories = (e) => {
  log.debug(e);

  // on réordonne les territoires dans le store en fonction de l'ordre défini 
  // par l'utilisateur dans le widget
  const territoryIds = e.territories.map((territory) => territory.id);
  const storeTerritories = mapStore.getTerritories();
  mapStore.addTerritories(setReorderTerritories(territoryIds, storeTerritories));

  push.info({
    title: t.territories.title,
    message: t.territories.change,
  });
}
const onAddTerritories = (e) => {
  log.debug(e);
  // on ajoute le territoire dans le store
  mapStore.addTerritory(e.territory);
  push.info({
    title: t.territories.title,
    message: t.territories.add(e.territory.title),
  });
}
const onRemoveTerritories = (e) => {
  log.debug(e);
  // on supprime le territoire du store
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

#gpf-territories-views-container-id {
  bottom: 0;
}

#gpf-territories-views-container-id,
.gpf-panel__body_territories,
.gpf-panel__views_territories-listview-entries {
  max-height: initial;
}
</style>
