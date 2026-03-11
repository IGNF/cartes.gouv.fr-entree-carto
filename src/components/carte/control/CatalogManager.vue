<script setup lang="js">
import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from "@/stores/dataStore";
import { useMapStore } from '@/stores/mapStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { Catalog } from 'geopf-extensions-openlayers';

const props = defineProps({
  mapId: {
    type: String,
    default: ''
  },
  visibility: Boolean,
  analytic: Boolean,
  catalogManagerOptions: {
    type: Object,
    default: () => ({})
  }
});

const log = useLogger();
const dataStore = useDataStore();
const mapStore = useMapStore();

const emitter = inject('emitter');
const map = inject(props.mapId);
const catalog = ref(new Catalog(props.catalogManagerOptions));

// FIXME non utilisé ?
// abonnement sur l'ouverture du controle
emitter.addEventListener("catalog:open:clicked", () => {
  if (catalog.value) {
    var collapsed = catalog.value.getCollapsed();
    catalog.value.setCollapsed(!collapsed);
  }
});

onMounted(() => {
  if (props.visibility) {
    map.addControl(catalog.value);
    log.info("CatalogManager mounted", catalog.value);
    var el = catalog.value.element.querySelector("button[id^=GPshowCatalogPicto-]");
    el.classList.remove('fr-btn--tertiary');
    el.classList.remove('gpf-btn--tertiary');
    el.classList.remove('gpf-btn--icon');
    el.classList.add('gpf-btn--primary');
    if (props.analytic) {
      useActionButtonEulerian(el);
    }
    /** abonnement au widget 
     * @fires catalog:loaded
     * @fires catalog:layer:add
     * @fires catalog:layer:remove
     */
    catalog.value.on('catalog:loaded', onCatalogLoaded);
    catalog.value.on('catalog:layer:add', onCatalogLayerAdd);
    catalog.value.on('catalog:layer:remove', onCatalogLayerRemove);
  }
})

onBeforeUpdate(() => {
  log.info("CatalogManager updated", catalog.value);
  if (!props.visibility) {
    map.removeControl(catalog.value);
  }
})

onUpdated(() => {
  if (props.visibility) {
    map.addControl(catalog.value);
  log.info("CatalogManager updated", catalog.value);
    if (props.analytic) {
      var el = catalog.value.element.querySelector("button[id^=GPshowCatalogPicto-]");
      useActionButtonEulerian(el);
    }
    /** abonnement au widget 
     * @fires catalog:loaded
     * @fires catalog:layer:add
     * @fires catalog:layer:remove
     */
    catalog.value.on('catalog:loaded', onCatalogLoaded);
    catalog.value.on('catalog:layer:add', onCatalogLayerAdd);
    catalog.value.on('catalog:layer:remove', onCatalogLayerRemove);
  }
})
/** 
 * Gestionnaires d'evenement sur les abonnements
 * @param {Event} e 
 */
const onCatalogLoaded = (e) => {
  log.info("catalog:loaded", e);
  // TODO
  // synchroniser le catalogue avec les couches du store !
}
const onCatalogLayerAdd = (e) => {
  log.info("catalog:layer:add", e);
  var id = dataStore.getLayerIdByName(e.name, e.service);
  if (id) {
    mapStore.addLayer(id);
  }
}
const onCatalogLayerRemove = (e) => {
  log.info("catalog:layer:remove", e);
  var id = dataStore.getLayerIdByName(e.name, e.service);
  if (id) {
    mapStore.removeLayer(id);
  }
}
</script>

<template>
  <div />
</template>

<style lang="scss">
@use "@/assets/variables" as *;

.gpf-widget[id^="GPcatalog"] {
  button[id^=GPshowCatalogPicto-] {
    background-color: var(--background-action-high-blue-france);
    box-shadow: inset 0 0 0 $widget-btn-padding var(--background-action-high-blue-france);
  }
  button[id^=GPshowCatalogPicto-][aria-pressed=true],
  button[id^=GPshowCatalogPicto-][aria-pressed=true]:not(:disabled):hover {
    background-color: var(--hover-tint);
  }
}
// autorise une hauteur maximale disponible
// et cree un scroll sur la liste
[id^=GPcatalogPanel-] {
  overflow: auto;
}
.gpf-catalog-tabs-fixe,
.gpf-catalog-tabs-fixe-with-bar {
  --tabs-height: 100% !important;
}
#GPcatalogContainerTabs .fr-tabs__panel {
  max-height: 100% !important;
  overflow: initial !important;
}
</style>
