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
    el.classList.remove('fr-btn--tertiary')
    el.classList.remove('gpf-btn--tertiary')
    el.classList.remove('gpf-btn--icon')
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
  <div>
    <!-- TODO ajouter l'emprise du widget pour la gestion des collisions -->
  </div>
</template>

<style>
button[id^=GPshowCatalogPicto-]{
  border-radius: 4px !important;
  border-radius: 4px !important;
}

@media (max-width: 576px) {
  button[id^="GPshowCatalogPicto-"][aria-pressed="true"] + dialog {
    max-width: unset;
  }
}
</style>
