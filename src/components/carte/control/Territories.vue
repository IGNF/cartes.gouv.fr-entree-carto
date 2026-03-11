<script setup lang="js">

import { useLogger } from 'vue-logger-plugin';
import { useDataStore } from '@/stores/dataStore';
import { useActionButtonEulerian } from '@/composables/actionEulerian.js';

import { Territories } from 'geopf-extensions-openlayers';

// lib notification
import { push } from 'notivue';
import t from '@/features/translation';

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  analytic: Boolean,
  territoriesOptions: Object
});

const log = useLogger();
const store = useDataStore();

const map = inject(props.mapId)
const territories = ref(new Territories(props.territoriesOptions));

function addTerritories () {
  var t = store.getTerritories();
  for (let i = 0; i < t.length; i++) {
    // exclude : ATF, IDF
    if (t[i].id === 'ATF' || t[i].id === 'IDF') {
      continue;
    }
    const territory = t[i];
    territories.value.setTerritory(territory);
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
    territories.value.on("territories:change", onChangeTerritories);
    territories.value.on("territories:add", onAddTerritories);
    territories.value.on("territories:remove", onRemoveTerritories);
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
    territories.value.on("territories:change", onChangeTerritories);
    territories.value.on("territories:add", onAddTerritories);
    territories.value.on("territories:remove", onRemoveTerritories);
  }
})

/** 
 * gestionnaire d'evenement sur les abonnements
 * @description
 * ...
 */
const onChangeTerritories = (e) => {
  log.debug(e);
  // push.info({
  //   title: t.territories.title,
  //   message: t.territories.change(e.territory.title),
  // });
}
const onAddTerritories = (e) => {
  log.debug(e);
  push.info({
    title: t.territories.title,
    message: t.territories.add(e.territory.title),
  });
}
const onRemoveTerritories = (e) => {
  log.debug(e);
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
