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
  return dataStore.getTerritories().map((territory) => {
    territory.default = true;
    return territory;
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

// Aligne les classes émises par geopf-extensions-openlayers sur les variantes DSFR canoniques
// (close = icône seule via fr-icon-close-line ; toggle "Modifier" en taille SM)
function applyDsfrFixes () {
  const root = territories.value.element;
  if (!root) return;
  const closeBtn = root.querySelector("#GPterritoriesPanelClose");
  if (closeBtn) {
    closeBtn.classList.remove("fr-btn--close", "gpf-btn-icon-close", "fr-m-1w");
    closeBtn.classList.add("fr-icon-close-line");
  }
  const toggleBtn = root.querySelector("#gpf-territories-button-open-views-id");
  if (toggleBtn) {
    // gpf-btn-icon écrase la bordure inset de fr-btn--tertiary par une drop-shadow ;
    // on l'enlève pour laisser le DSFR gérer la bordure 1px du bouton tertiaire.
    toggleBtn.classList.remove("gpf-btn-icon");
    toggleBtn.classList.add("fr-btn--sm");
  }
  // fr-tile dessine un liseré 1px sur chaque côté via 4 background-image ;
  // Figma veut une carte blanche sans liseré → on opte pour le modificateur DSFR.
  for (const tile of root.querySelectorAll(".gpf-tile")) {
    tile.classList.add("fr-tile--no-border");
  }
}

onMounted(() => {
  if (props.visibility) {
    addDefaultTerritories();
    addCustomTerritories();
    map.addControl(territories.value)
    applyDsfrFixes();
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
    applyDsfrFixes();
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

#gpf-territories-views-container-id {
  bottom: 0;
}

#gpf-territories-views-container-id,
.gpf-panel__body_territories,
.gpf-panel__views_territories-listview-entries {
  max-height: initial;
}

// Figma sync — node 1:9906 « Sélectionner un territoire » (Panneau)
.gpf-panel:has(.gpf-panel__header_territories) {
  width: 410px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 18, 0.16);
  overflow: hidden;
}

.gpf-panel__header_territories {
  padding: 8px;
  gap: 8px;
}

.gpf-btn-header-territories {
  position: relative;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

// Override the lib's default arrow glyph with the DSFR france-line icon (Figma 1:9906 « france »)
.gpf-btn-icon-header-territories {
  background-image: none;
  background-color: #000091;
  -webkit-mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTIuNjQ4IDEuOTg2YS43MjkuNzI5IDAgMCAxIC43Ny4yODRsLjIxNy4zMWguMTEzYy4zMTcgMCAuNTkyLjIuNjgzLjQ5OWwuMDQuMTI1YS43MTYuNzE2IDAgMCAxIC40MS4yNTQuNzEyLjcxMiAwIDAgMSAuMTg3LjA2M2wuMjg3LjE0YS43MTcuNzE3IDAgMCAxIC4yOTQuMjY3bC4yMzYtLjA1NWEuNzI0LjcyNCAwIDAgMSAuNjA4LjEzLjY5My42OTMgMCAwIDEgLjI3My41NTF2LjI1MWwuNDg1LjMyMmEuNzI3LjcyNyAwIDAgMSAuMzI4LjA1OWwuMDc3LjAzMy4xLS4wNGEuNzM1LjczNSAwIDAgMSAuNDc1LS4wMjRsLjM4OC4xMTVjLjEzNy4wNC4yNTcuMTE4LjM0Ny4yMjZsLjI4LjMzNi4zNzQtLjAzN2EuNzM1LjczNSAwIDAgMSAuNDEuMDc5bC4yMjYuMTIuMzMxLjAwNmMuMTMzLjAwMi4yNi4wNC4zNzEuMTFsLjI4OS4xNzlhLjcuNyAwIDAgMSAuMjUuOTJsLS4zMTIuNTc4LS4wMTYuMTc0YS42OTMuNjkzIDAgMCAxLS4wMzQuMTZsLS4yMjIuNjMuMDE3IDEuMDQ1YS42OS42OSAwIDAgMS0uMjU2LjU0OWwtLjQwOC4zMzNhLjcyNi43MjYgMCAwIDEtLjI0Mi4xM2wtLjcuODg1Yy4yNC4wNi40NC4yMzguNTEyLjQ4MmwuMDc2LjI1Ni4wOTguMTIuMjI4LjMzNGEuNjk0LjY5NCAwIDAgMS0uMDE2LjgwMWwuMjcuMzE3YS42OTYuNjk2IDAgMCAxIC4xNjYuNDgybC0uMDIuMzY1YS43MDYuNzA2IDAgMCAxLS4yOC41MmwuMDUuMDQ4YS42ODkuNjg5IDAgMCAxIC4wNi45NWwuMDg2LjA1OC4wOS0uMDMxYS43Mi43MiAwIDAgMSAuODg4LjM2NWwuMTE3LjI1YS42ODcuNjg3IDAgMCAxLS4wNzkuNzEybC0uMDQuMDU1YS42OTEuNjkxIDAgMCAxLS4yNDcuNjQybC0uNzIuNTg2LS4zMTMuMTk3YS42OTIuNjkyIDAgMCAxLS4wNjIuMzE3LjcxLjcxIDAgMCAxLS40MDMuMzY5bC0uNjMuMjI4YS43NjQuNzY0IDAgMCAxLS4xNS4wMzdsLS40NzIuMDY2YS43My43MyAwIDAgMS0uMjczLS4wMTNsLS45Ny0uMjIyLS42NDYtLjE4NWEuNjUuNjUgMCAwIDEtLjA1LS4wMTYuNzI3LjcyNyAwIDAgMS0uNDI4LS4wNzhsLS4yMjItLjEyYS43MjYuNzI2IDAgMCAxLS41MjgtLjA5NmwtLjYwOC4zNi0uMTkyLjM4LjE4Ni42NDNhLjY5Ni42OTYgMCAwIDEtLjUuODY4bC0uNzY4LjJhLjcxLjcxIDAgMCAxLS4xODQuMDI0bC0uMTAyLS4wMDgtLjY0NC0uMTEyLS4yOTIuMDU4YS43NC43NCAwIDAgMS0uNDUtLjA1NGwtLjM0NC0uMTYzYS43MDkuNzA5IDAgMCAxLS4zNzItLjQyOGwtLjI4Mi0uMTEzLS4xMTgtLjAyNWEuNzIuNzIgMCAwIDEtLjY1Mi4yNWwtMS4yMTYtLjE2MWEuNzE3LjcxNyAwIDAgMS0uMjctLjA5NGwtLjIwNi0uMTE5aC0uMzFhLjcyMy43MjMgMCAwIDEtLjUyLS4yMmwtLjIwOC0uMjE3LS42OTYtLjI5NGEuNzE0LjcxNCAwIDAgMS0uMzQtLjI5OGwtLjE0MS0uMjQ1LS4yOTgtLjE2MWEuNjkzLjY5MyAwIDAgMS0uMjA5LTEuMDZsLjQ2NC0uNTU0LjI1Ny0xLjM3OWEuNy43IDAgMCAxIC4wMjQtLjA5Mi42ODcuNjg3IDAgMCAxLS4wNC0uMzI5bC4yMTMtMS44MjJhLjY4OC42ODggMCAwIDEgLjAxOS0uMS42OTQuNjk0IDAgMCAxIC4xMzgtLjg1Ny42OTMuNjkzIDAgMCAxLS4wNzUtLjIxNmwtLjMyOC0uMTY1YS43MS43MSAwIDAgMS0uMjQ3LS4yMDZsLS41NTktLjcyOGEuNjkzLjY5MyAwIDAgMS0uMTI2LS4yNjVsLS4xNjUtLjczNy0uMDAyLS4wMDgtLjA3NC0uMDVhLjcwOC43MDggMCAwIDEtLjE2Mi0uMTUybC0uMjQtLjMxMi0xLjM0My0uNTI0aC0uMzg2YS43Mi43MiAwIDAgMS0uNjE3LS4zNDdsLS4xNjQtLjI3NWEuNjkuNjkgMCAwIDEtLjA4My0uNDk1LjcxMy43MTMgMCAwIDEtLjI3Ni0uMzVMMS43NTQgOC4xYS42OTUuNjk1IDAgMCAxIC4zNzMtLjg2NmwxLjAxNy0uNDY1YS43MzQuNzM0IDAgMCAxIC4yNDEtLjA2M2wxLjQtLjEyNGEuNzM4LjczOCAwIDAgMSAuNTc1LjIwN2wuMjU5LjI1OS4wNTQtLjAyMWEuNzI3LjcyNyAwIDAgMSAuMzkzLS4wMzZsLjE4OC4wMzMtLjI1My0uNTk2LS4xOS0uNzU3YS42OTEuNjkxIDAgMCAxIC4xMi0uNTgzLjcxMy43MTMgMCAwIDEgLjUzNS0uMjg0bC41NzQtLjAyOWEuNzA3LjcwNyAwIDAgMSAuNTU4LjIyMmwuNDkzLjUxOS42MzkuMTIzLjAwNy0uMDhhLjcwMi43MDIgMCAwIDEgLjQ4MS0uNjA0bDEuMjEzLS40MDkuMzI2LS4yOTItLjA0Ni0uNzFhLjcuNyAwIDAgMSAuMDYtLjMzMWwuMjU0LS41NDZhLjcxLjcxIDAgMCAxIC40Ny0uMzg3Wm0tLjE4OCAxLjk3OC0uMzMuMDgxLS4wMzYuMDczLjA1NS44MTVhLjY0LjY0IDAgMCAxLS4yMjcuNTI4bC0uNjczLjU3OGEuNzA3LjcwNyAwIDAgMS0uMjQ5LjEzOGwtLjczNy4yMzguMjI4LjE1Ny0uMjgzLjEzNWEuNjc1LjY3NSAwIDAgMS0uMzQ3LjM3OGwtLjQ4My4yM2EuNzU2Ljc1NiAwIDAgMS0uNDUuMDZsLTEuMTktLjIydi4wMDZsLjA1Ny43OTljLjAyNC4zNDItLjIzLjY0LS41OS42OTNsLS4zMDUuMDQ1YS43NDQuNzQ0IDAgMCAxLS4yMzUtLjAwM2wtLjU4OS0uMS0uMjk5LjExYS43MzMuNzMzIDAgMCAxLS43NTUtLjE1MmwtLjM0Ni0uMzMtLjkyNC4wNzgtLjAzOC4wMTZjLjE1LjEzMi4yMy4zMTcuMjIxLjUwNi4wMDQgMCAuMDA3LjAwMi4wMS4wMDNsMS42MjYuNjA4Yy4xMjQuMDQ3LjIyNS4xMi4zMDEuMjE1bC4yMDYuMjU3YS43NDUuNzQ1IDAgMCAxIC4zOTcuMDc4bC4zOTguMjA1Yy4xNi4wODMuMjguMjIzLjMzMy4zODVsLjU1My4yODUtLjU5NS4xOTdhLjY4NS42ODUgMCAwIDEtLjMxNi4yOThsLjM1LjQzNy42MTYuMjk2YS42NDUuNjQ1IDAgMCAxIC4zNjIuNzM1bC0uMDA3LjAyNy4xMzQuMjM3Yy4xMDcuMTkuMTA3LjQxLjAxLjU5NmwuMDU3LjA0NGEuNjY2LjY2NiAwIDAgMSAuMjE4LjMwNGwuMzg3IDEuMWEuNjE3LjYxNyAwIDAgMS0uMDM2LjQ5NWwuMjYyLjc0NS0uNzIyLS4zOTdhLjc0My43NDMgMCAwIDEtLjI3Mi4wMTIuNjQ0LjY0NCAwIDAgMS0uMDg1LjE3N2wtLjMwNS40NTEtLjI2IDEuMzM1YS42NC42NCAwIDAgMS0uMTUuMzAxbC0uMDc1LjA4N2EuNTMuNTMgMCAwIDEgLjA0Mi4wNjNsLjEyLjE5Ny42LjI0MmMuMDkzLjA0LjE2OC4wOS4yMzMuMTUzbC4wOTcuMDk3aC4xOWMuMTI0IDAgLjI0Ni4wMzEuMzUzLjA5bC4yNS4xMzkuMzg1LjA0OGEuNjkuNjkgMCAwIDEgLjEzNi0uMTM5Ljc0Ljc0IDAgMCAxIC41OC0uMTM0bC45OC4yMDguNjkuMjYzYS42OTIuNjkyIDAgMCAxIC4zNy4zMjhsLjAzMy0uMDA2YS43My43MyAwIDAgMSAuMTQtLjAxM2wuMTA0LjAwNy41MDYuMDg1LS4wNS0uMTY0YS42MjQuNjI0IDAgMCAxIC4wNDgtLjQ3NWwuMzk3LS43NTNhLjY3LjY3IDAgMCAxIC4yNjgtLjI3M2wxLjE2NS0uNjU4YS43MzEuNzMxIDAgMCAxIC42NzItLjAyNi43MzUuNzM1IDAgMCAxIC41NC0uMDZsLjI1NS4wNzRhLjY4Ni42ODYgMCAwIDEgLjAzNC4wMS43MzYuNzM2IDAgMCAxIC42NzQuMDc3bC4zOC4yNThjLjEuMDY4LjE4LjE2LjIyOS4yNjZsLjUyOS4xMTUuMjYxLS4wMzUuMDUzLS4wMThhLjY1NC42NTQgMCAwIDEgLjEwNC0uMTdsLjIyOC0uMjY4YS42OTEuNjkxIDAgMCAxIC4xNy0uMTQzbC40NC0uMjY1LjE3Ni0uMTM4LS41NzItLjM3NGEuNjQ3LjY0NyAwIDAgMS0uMy0uNTMybC0uMDEtLjYzNi0uMjM4LS4yMTRhLjYzNi42MzYgMCAwIDEtLjIxNy0uNDc2di0uMjMxYzAtLjI2NS4xNjctLjUwMi40MjYtLjYwNmwtLjA5My0uMTA0YS42MzYuNjM2IDAgMCAxLS4xNjEtLjM4NWwtLjAyLS4yOWEuNjg2LjY4NiAwIDAgMSAuMDAxLS4wODIuNzQzLjc0MyAwIDAgMS0uODI0LS4wMTNsLS4yMDItLjE0NGEuNjM3LjYzNyAwIDAgMS0uMjI4LS43NmwuMTA2LS4yNTkuMDMtLjMzNGEuNjM0LjYzNCAwIDAgMSAuMTEtLjMwM2wuNDQ3LS42NC40NjEtLjU2MWEuNjE4LjYxOCAwIDAgMSAuMDEtLjIzMi42NjMuNjYzIDAgMCAxIC4zNi0uNDRsLjIzOC0uMTE2YS43MzIuNzMyIDAgMCAxIC4yNTItLjA3MWwtLjAxMi0uNjlhLjYxNy42MTcgMCAwIDEgLjA0LS4yM2wuMjI2LS42MTQuMDIxLS4yMTRhLjYyOC42MjggMCAwIDEgLjAzOS0uMTY0LjY4LjY4IDAgMCAxLS4wODMtLjAzNmwtLjE3OS0uMDktLjUyNi4wNWEuNzMuNzMgMCAwIDEtLjYxNC0uMjM5bC0uMzQ4LS40LS4xMDYuMDQxYS43NDMuNzQzIDAgMCAxLS41NDMtLjAwNWwtLjE5LS4wNzctLjA1My4wMDRhLjc0NS43NDUgMCAwIDEtLjQ0My0uMTA2bC0uODYxLS41NDhhLjY3OS42NzkgMCAwIDEtLjEzNS0uMTEzLjczMy43MzMgMCAwIDEtLjItLjAwOGwtLjQ2MS0uMDhhLjY3OS42NzkgMCAwIDEtLjU3LS41OGwtLjAxMi0uMTA2YS43MDQuNzA0IDAgMCAxLS40NzQtLjMxM2wtLjAxLS4wMTZhLjcxOS43MTkgMCAwIDEtLjI5Ni0uMTQ2bC0uMTcyLS4xNDNhLjY3Mi42NzIgMCAwIDEtLjExMy0uMTIuNzA5LjcwOSAwIDAgMS0uNTItLjI4NGwtLjIzNS0uMzI0WiIvPjwvc3ZnPg==") no-repeat 50% / 100%;
  mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48cGF0aCBkPSJNMTIuNjQ4IDEuOTg2YS43MjkuNzI5IDAgMCAxIC43Ny4yODRsLjIxNy4zMWguMTEzYy4zMTcgMCAuNTkyLjIuNjgzLjQ5OWwuMDQuMTI1YS43MTYuNzE2IDAgMCAxIC40MS4yNTQuNzEyLjcxMiAwIDAgMSAuMTg3LjA2M2wuMjg3LjE0YS43MTcuNzE3IDAgMCAxIC4yOTQuMjY3bC4yMzYtLjA1NWEuNzI0LjcyNCAwIDAgMSAuNjA4LjEzLjY5My42OTMgMCAwIDEgLjI3My41NTF2LjI1MWwuNDg1LjMyMmEuNzI3LjcyNyAwIDAgMSAuMzI4LjA1OWwuMDc3LjAzMy4xLS4wNGEuNzM1LjczNSAwIDAgMSAuNDc1LS4wMjRsLjM4OC4xMTVjLjEzNy4wNC4yNTcuMTE4LjM0Ny4yMjZsLjI4LjMzNi4zNzQtLjAzN2EuNzM1LjczNSAwIDAgMSAuNDEuMDc5bC4yMjYuMTIuMzMxLjAwNmMuMTMzLjAwMi4yNi4wNC4zNzEuMTFsLjI4OS4xNzlhLjcuNyAwIDAgMSAuMjUuOTJsLS4zMTIuNTc4LS4wMTYuMTc0YS42OTMuNjkzIDAgMCAxLS4wMzQuMTZsLS4yMjIuNjMuMDE3IDEuMDQ1YS42OS42OSAwIDAgMS0uMjU2LjU0OWwtLjQwOC4zMzNhLjcyNi43MjYgMCAwIDEtLjI0Mi4xM2wtLjcuODg1Yy4yNC4wNi40NC4yMzguNTEyLjQ4MmwuMDc2LjI1Ni4wOTguMTIuMjI4LjMzNGEuNjk0LjY5NCAwIDAgMS0uMDE2LjgwMWwuMjcuMzE3YS42OTYuNjk2IDAgMCAxIC4xNjYuNDgybC0uMDIuMzY1YS43MDYuNzA2IDAgMCAxLS4yOC41MmwuMDUuMDQ4YS42ODkuNjg5IDAgMCAxIC4wNi45NWwuMDg2LjA1OC4wOS0uMDMxYS43Mi43MiAwIDAgMSAuODg4LjM2NWwuMTE3LjI1YS42ODcuNjg3IDAgMCAxLS4wNzkuNzEybC0uMDQuMDU1YS42OTEuNjkxIDAgMCAxLS4yNDcuNjQybC0uNzIuNTg2LS4zMTMuMTk3YS42OTIuNjkyIDAgMCAxLS4wNjIuMzE3LjcxLjcxIDAgMCAxLS40MDMuMzY5bC0uNjMuMjI4YS43NjQuNzY0IDAgMCAxLS4xNS4wMzdsLS40NzIuMDY2YS43My43MyAwIDAgMS0uMjczLS4wMTNsLS45Ny0uMjIyLS42NDYtLjE4NWEuNjUuNjUgMCAwIDEtLjA1LS4wMTYuNzI3LjcyNyAwIDAgMS0uNDI4LS4wNzhsLS4yMjItLjEyYS43MjYuNzI2IDAgMCAxLS41MjgtLjA5NmwtLjYwOC4zNi0uMTkyLjM4LjE4Ni42NDNhLjY5Ni42OTYgMCAwIDEtLjUuODY4bC0uNzY4LjJhLjcxLjcxIDAgMCAxLS4xODQuMDI0bC0uMTAyLS4wMDgtLjY0NC0uMTEyLS4yOTIuMDU4YS43NC43NCAwIDAgMS0uNDUtLjA1NGwtLjM0NC0uMTYzYS43MDkuNzA5IDAgMCAxLS4zNzItLjQyOGwtLjI4Mi0uMTEzLS4xMTgtLjAyNWEuNzIuNzIgMCAwIDEtLjY1Mi4yNWwtMS4yMTYtLjE2MWEuNzE3LjcxNyAwIDAgMS0uMjctLjA5NGwtLjIwNi0uMTE5aC0uMzFhLjcyMy43MjMgMCAwIDEtLjUyLS4yMmwtLjIwOC0uMjE3LS42OTYtLjI5NGEuNzE0LjcxNCAwIDAgMS0uMzQtLjI5OGwtLjE0MS0uMjQ1LS4yOTgtLjE2MWEuNjkzLjY5MyAwIDAgMS0uMjA5LTEuMDZsLjQ2NC0uNTU0LjI1Ny0xLjM3OWEuNy43IDAgMCAxIC4wMjQtLjA5Mi42ODcuNjg3IDAgMCAxLS4wNC0uMzI5bC4yMTMtMS44MjJhLjY4OC42ODggMCAwIDEgLjAxOS0uMS42OTQuNjk0IDAgMCAxIC4xMzgtLjg1Ny42OTMuNjkzIDAgMCAxLS4wNzUtLjIxNmwtLjMyOC0uMTY1YS43MS43MSAwIDAgMS0uMjQ3LS4yMDZsLS41NTktLjcyOGEuNjkzLjY5MyAwIDAgMS0uMTI2LS4yNjVsLS4xNjUtLjczNy0uMDAyLS4wMDgtLjA3NC0uMDVhLjcwOC43MDggMCAwIDEtLjE2Mi0uMTUybC0uMjQtLjMxMi0xLjM0My0uNTI0aC0uMzg2YS43Mi43MiAwIDAgMS0uNjE3LS4zNDdsLS4xNjQtLjI3NWEuNjkuNjkgMCAwIDEtLjA4My0uNDk1LjcxMy43MTMgMCAwIDEtLjI3Ni0uMzVMMS43NTQgOC4xYS42OTUuNjk1IDAgMCAxIC4zNzMtLjg2NmwxLjAxNy0uNDY1YS43MzQuNzM0IDAgMCAxIC4yNDEtLjA2M2wxLjQtLjEyNGEuNzM4LjczOCAwIDAgMSAuNTc1LjIwN2wuMjU5LjI1OS4wNTQtLjAyMWEuNzI3LjcyNyAwIDAgMSAuMzkzLS4wMzZsLjE4OC4wMzMtLjI1My0uNTk2LS4xOS0uNzU3YS42OTEuNjkxIDAgMCAxIC4xMi0uNTgzLjcxMy43MTMgMCAwIDEgLjUzNS0uMjg0bC41NzQtLjAyOWEuNzA3LjcwNyAwIDAgMSAuNTU4LjIyMmwuNDkzLjUxOS42MzkuMTIzLjAwNy0uMDhhLjcwMi43MDIgMCAwIDEgLjQ4MS0uNjA0bDEuMjEzLS40MDkuMzI2LS4yOTItLjA0Ni0uNzFhLjcuNyAwIDAgMSAuMDYtLjMzMWwuMjU0LS41NDZhLjcxLjcxIDAgMCAxIC40Ny0uMzg3Wm0tLjE4OCAxLjk3OC0uMzMuMDgxLS4wMzYuMDczLjA1NS44MTVhLjY0LjY0IDAgMCAxLS4yMjcuNTI4bC0uNjczLjU3OGEuNzA3LjcwNyAwIDAgMS0uMjQ5LjEzOGwtLjczNy4yMzguMjI4LjE1Ny0uMjgzLjEzNWEuNjc1LjY3NSAwIDAgMS0uMzQ3LjM3OGwtLjQ4My4yM2EuNzU2Ljc1NiAwIDAgMS0uNDUuMDZsLTEuMTktLjIydi4wMDZsLjA1Ny43OTljLjAyNC4zNDItLjIzLjY0LS41OS42OTNsLS4zMDUuMDQ1YS43NDQuNzQ0IDAgMCAxLS4yMzUtLjAwM2wtLjU4OS0uMS0uMjk5LjExYS43MzMuNzMzIDAgMCAxLS43NTUtLjE1MmwtLjM0Ni0uMzMtLjkyNC4wNzgtLjAzOC4wMTZjLjE1LjEzMi4yMy4zMTcuMjIxLjUwNi4wMDQgMCAuMDA3LjAwMi4wMS4wMDNsMS42MjYuNjA4Yy4xMjQuMDQ3LjIyNS4xMi4zMDEuMjE1bC4yMDYuMjU3YS43NDUuNzQ1IDAgMCAxIC4zOTcuMDc4bC4zOTguMjA1Yy4xNi4wODMuMjguMjIzLjMzMy4zODVsLjU1My4yODUtLjU5NS4xOTdhLjY4NS42ODUgMCAwIDEtLjMxNi4yOThsLjM1LjQzNy42MTYuMjk2YS42NDUuNjQ1IDAgMCAxIC4zNjIuNzM1bC0uMDA3LjAyNy4xMzQuMjM3Yy4xMDcuMTkuMTA3LjQxLjAxLjU5NmwuMDU3LjA0NGEuNjY2LjY2NiAwIDAgMSAuMjE4LjMwNGwuMzg3IDEuMWEuNjE3LjYxNyAwIDAgMS0uMDM2LjQ5NWwuMjYyLjc0NS0uNzIyLS4zOTdhLjc0My43NDMgMCAwIDEtLjI3Mi4wMTIuNjQ0LjY0NCAwIDAgMS0uMDg1LjE3N2wtLjMwNS40NTEtLjI2IDEuMzM1YS42NC42NCAwIDAgMS0uMTUuMzAxbC0uMDc1LjA4N2EuNTMuNTMgMCAwIDEgLjA0Mi4wNjNsLjEyLjE5Ny42LjI0MmMuMDkzLjA0LjE2OC4wOS4yMzMuMTUzbC4wOTcuMDk3aC4xOWMuMTI0IDAgLjI0Ni4wMzEuMzUzLjA5bC4yNS4xMzkuMzg1LjA0OGEuNjkuNjkgMCAwIDEgLjEzNi0uMTM5Ljc0Ljc0IDAgMCAxIC41OC0uMTM0bC45OC4yMDguNjkuMjYzYS42OTIuNjkyIDAgMCAxIC4zNy4zMjhsLjAzMy0uMDA2YS43My43MyAwIDAgMSAuMTQtLjAxM2wuMTA0LjAwNy41MDYuMDg1LS4wNS0uMTY0YS42MjQuNjI0IDAgMCAxIC4wNDgtLjQ3NWwuMzk3LS43NTNhLjY3LjY3IDAgMCAxIC4yNjgtLjI3M2wxLjE2NS0uNjU4YS43MzEuNzMxIDAgMCAxIC42NzItLjAyNi43MzUuNzM1IDAgMCAxIC41NC0uMDZsLjI1NS4wNzRhLjY4Ni42ODYgMCAwIDEgLjAzNC4wMS43MzYuNzM2IDAgMCAxIC42NzQuMDc3bC4zOC4yNThjLjEuMDY4LjE4LjE2LjIyOS4yNjZsLjUyOS4xMTUuMjYxLS4wMzUuMDUzLS4wMThhLjY1NC42NTQgMCAwIDEgLjEwNC0uMTdsLjIyOC0uMjY4YS42OTEuNjkxIDAgMCAxIC4xNy0uMTQzbC40NC0uMjY1LjE3Ni0uMTM4LS41NzItLjM3NGEuNjQ3LjY0NyAwIDAgMS0uMy0uNTMybC0uMDEtLjYzNi0uMjM4LS4yMTRhLjYzNi42MzYgMCAwIDEtLjIxNy0uNDc2di0uMjMxYzAtLjI2NS4xNjctLjUwMi40MjYtLjYwNmwtLjA5My0uMTA0YS42MzYuNjM2IDAgMCAxLS4xNjEtLjM4NWwtLjAyLS4yOWEuNjg2LjY4NiAwIDAgMSAuMDAxLS4wODIuNzQzLjc0MyAwIDAgMS0uODI0LS4wMTNsLS4yMDItLjE0NGEuNjM3LjYzNyAwIDAgMS0uMjI4LS43NmwuMTA2LS4yNTkuMDMtLjMzNGEuNjM0LjYzNCAwIDAgMSAuMTEtLjMwM2wuNDQ3LS42NC40NjEtLjU2MWEuNjE4LjYxOCAwIDAgMSAuMDEtLjIzMi42NjMuNjYzIDAgMCAxIC4zNi0uNDRsLjIzOC0uMTE2YS43MzIuNzMyIDAgMCAxIC4yNTItLjA3MWwtLjAxMi0uNjlhLjYxNy42MTcgMCAwIDEgLjA0LS4yM2wuMjI2LS42MTQuMDIxLS4yMTRhLjYyOC42MjggMCAwIDEgLjAzOS0uMTY0LjY4LjY4IDAgMCAxLS4wODMtLjAzNmwtLjE3OS0uMDktLjUyNi4wNWEuNzMuNzMgMCAwIDEtLjYxNC0uMjM5bC0uMzQ4LS40LS4xMDYuMDQxYS43NDMuNzQzIDAgMCAxLS41NDMtLjAwNWwtLjE5LS4wNzctLjA1My4wMDRhLjc0NS43NDUgMCAwIDEtLjQ0My0uMTA2bC0uODYxLS41NDhhLjY3OS42NzkgMCAwIDEtLjEzNS0uMTEzLjczMy43MzMgMCAwIDEtLjItLjAwOGwtLjQ2MS0uMDhhLjY3OS42NzkgMCAwIDEtLjU3LS41OGwtLjAxMi0uMTA2YS43MDQuNzA0IDAgMCAxLS40NzQtLjMxM2wtLjAxLS4wMTZhLjcxOS43MTkgMCAwIDEtLjI5Ni0uMTQ2bC0uMTcyLS4xNDNhLjY3Mi42NzIgMCAwIDEtLjExMy0uMTIuNzA5LjcwOSAwIDAgMS0uNTItLjI4NGwtLjIzNS0uMzI0WiIvPjwvc3ZnPg==") no-repeat 50% / 100%;
}

.gpf-panel__title_territories {
  flex: 1 0 0;
  color: #000091;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5rem;
  padding: 0;
  right: 0;
}

#GPterritoriesPanelClose {
  margin: 0;
}

.gpf-panel__menuviews_territories {
  height: auto;
  padding: 12px;
  align-items: flex-start;
  background-color: #ffffff;
  border-bottom: none;
}

.gpf-panel__body_territories {
  background-color: #f6f6f6;
  // Le lib applique fr-modal__body sur ce conteneur, ce qui active la
  // drop-shadow `--lifted-shadow` du DSFR alors qu'il n'y a pas de modale ici.
  filter: none;
}

.territories-entries {
  background-color: #f6f6f6;
  padding: 12px;
  gap: 8px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.gpf-tile {
  width: auto;
  height: auto;
  padding: 12px;
  border-radius: 4px;

  .fr-tile__title .gpf-label {
    color: #000091;
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1.25rem;
  }
}

// Figma sync — Modifier / Ajouter view (1:9918, 1:9930)
#gpf-territories-views-submit-id {
  font-size: 0.875rem;
  line-height: 1.5rem;
  padding: 4px 12px;
}

.gpf-panel__views_territories-listview-entry {
  padding: 12px 8px;
  background-color: #ffffff;
}
</style>
