<script setup lang="js">

import TileLayer from 'ol/layer/Tile.js'
import OSM from 'ol/source/OSM'

import SearchEngine from './control/SearchEngine.vue'
import ScaleLine from './control/ScaleLine.vue'
import OverviewMap from './control/OverviewMap.vue'
import Zoom from './control/Zoom.vue'
import Attributions from './control/Attributions.vue'
import LayerSwitcher from './control/LayerSwitcher.vue'
import Isocurve from './control/Isocurve.vue'

import { useLogger } from 'vue-logger-plugin'
import { useControls } from '@/composables/controls'

const log = useLogger()

const props = defineProps({
  controlOptions: Array
})

const layerSwitcherOptions = {
  options : {
    // position : "top-right",
    collapsed : true,
    panel : true,
    counter : true
  }
}

const scaleLineOptions = {
  units: 'metric',
  bar: false,
}

const searchEngineOptions = {
  collapsed: false,
  collapsible: false,
  displayButtonAdvancedSearch: true,
  displayButtonGeolocate: true,
  displayButtonCoordinateSearch: true,
  displayButtonClose: false,
  resources: {
    search: true
  },
  searchOptions: {
    addToMap : false,
    serviceOptions : {
      services: "WMTS,WMS,TMS"
    }
  }
}

const overviewMapOptions = {
  className: 'ol-overviewmap ol-custom-overviewmap',
  collapseLabel: '',
  label: '',
  collapsed: true,
  layers : [
    new TileLayer({
      source: new OSM(),
    })
  ]
}

const zoomOptions = {
  position : "bottom-right",
}

const attributionsOptions = {}

// FIXME exception
const isocurveOptions = {
  position : "bottom-right"
}

const reverseGeocodeOptions = {
  position : "bottom-right"
}

const fullscreenOptions = {
  className: "ol-custom-full-screen",
  label : "",
  labelActive : ""
}


import {
  useFloating, 
  autoUpdate, 
  offset, 
  hide, 
  detectOverflow 
} from '@floating-ui/vue';

const searchEngineDiv = ref(null);
const layerSwitcherDiv = ref(null);

const reference = computed(() => {
  if(searchEngineDiv.value) return searchEngineDiv.value
})
const floating = computed(() => {
  if(layerSwitcherDiv.value) return layerSwitcherDiv.value
})

const floatingInitialStyles = ref({})

const collision = {
  name: 'collision',
  async fn(state) {
    const overflow = await detectOverflow(state, {});
    if (overflow.top >= 0 ||
        overflow.bottom >= 0 ||
        overflow.left >= 0 ||
        overflow.right >= 0
    ) {
      return {
        data: {
          status: true,
          overflow,
          state
        },
        reset: {
          placement: "bottom-end",
        },
      };
    }
    return {
      data : {
        status: false
      },
      reset: {
         placement: state.initialPlacement,
      },
    };
  },
};
const {
  x, y,
  strategy,
  placement,
  middlewareData,
  isPositioned,
  floatingStyles,
  update
} = useFloating(reference, floating, {
      placement: 'none',
      transform: false,
      middleware: [collision, offset(10)],
      whileElementsMounted: autoUpdate,
})

watch(middlewareData, (middlewareData) => {
  log.debug("middlewareData", middlewareData)
});
watch(floatingStyles, (floatingStyles) => {
  if (floatingStyles) {
    log.debug("floatingStyles", floatingStyles)
  }
});
watch(isPositioned, (isPositioned) => {
  if (isPositioned) {
    log.debug("isPositioned", isPositioned)
    log.debug(layerSwitcherDiv.value.style)
    floatingInitialStyles.value = {
      top: layerSwitcherDiv.value.style.top,
      left: layerSwitcherDiv.value.style.left,
      right: layerSwitcherDiv.value.style.right,
      bottom: layerSwitcherDiv.value.style.bottom,
      position: layerSwitcherDiv.value.style.position
    }
  }
});
watch(placement, (placement) => {
  log.debug("placement", placement)
});

onMounted(() => {})

</script>

<template>
  <LayerSwitcher
    :visibility="props.controlOptions.includes(useControls.LayerSwitcher.id)"
    :layer-switcher-options="layerSwitcherOptions"
    v-model="layerSwitcherDiv"
    :floating-layer-switcher="{
      style: floatingStyles,
      initialStyle : floatingInitialStyles,
      placement: placement,
      middleware: middlewareData,
      position: isPositioned
    }"

  />
  <Isocurve
    :visibility="props.controlOptions.includes(useControls.Isocurve.id)"
    :isocurve-options="isocurveOptions"
  />
  <ReverseGeocode
    :visibility="props.controlOptions.includes(useControls.ReverseGeocode.id)"
    :reverse-geocode-options="reverseGeocodeOptions"
  />
  <Zoom
    :visibility="props.controlOptions.includes(useControls.Zoom.id)"
    :zoom-options="zoomOptions"
  />
  <Attributions
    :visibility="props.controlOptions.includes(useControls.Attributions.id)"
    :attributions-options="attributionsOptions"
  />
  <SearchEngine
    :visibility="props.controlOptions.includes(useControls.SearchEngine.id)"
    :search-engine-options="searchEngineOptions"
    v-model="searchEngineDiv"
  />
  <ScaleLine
    :visibility="props.controlOptions.includes(useControls.ScaleLine.id)"
    :scale-line-options="scaleLineOptions"
  />
  <OverviewMap
    :visibility="props.controlOptions.includes(useControls.OverviewMap.id)"
    :overview-map-options="overviewMapOptions"
  />
  <FullScreen
    :visibility="props.controlOptions.includes(useControls.FullScreen.id)"
    :fullscreen-options="fullscreenOptions"
  />
</template>

<style>
  .position-container-bottom-left, 
  .position-container-bottom-right, 
  .position-container-top-left, 
  .position-container-top-right {
    border-style: unset;
  }
  .position-container-top-right {
    top: 90px;
  }
</style>