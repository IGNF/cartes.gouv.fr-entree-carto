<script setup>
import { useMapStore } from "@/stores/mapStore";
const mapStore = useMapStore();
import { useModals } from "@/composables/useModals";
const modals = useModals();

import { Map, View, Feature } from 'ol';
import { ScaleLine } from 'ol/control';
import { LayerSwitcher } from 'geopf-extensions-openlayers';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, WMTS } from 'ol/source';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { LineString } from 'ol/geom';
import { Style, Stroke } from 'ol/style';
import { getWidth } from 'ol/extent.js';
import { get as getProjection, transform } from 'ol/proj.js';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';

proj4.defs('EqualEarthProjection', '+proj=eqearth +lon_0=0 +x_0=0 +y_0=0 +R=6371008.7714 +units=m +no_defs +type=crs');
register(proj4);

const equalEarthProjection = getProjection('EqualEarthProjection');
equalEarthProjection.setGlobal(true);
equalEarthProjection.setExtent([-17243959.06, -8392927.6, 17243959.06, 8392927.6]);
equalEarthProjection.setWorldExtent([-180, -90, 180, 90]);

let transformToEqualEarth = (center) => transform(center, getProjection('EPSG:4326'), equalEarthProjection);
let transformFromEqualEarthTo4326 = (center) => transform(center, equalEarthProjection, getProjection('EPSG:4326'));

// WMTS
const resolutions = [];
const matrixIds = [];
const proj3857 = getProjection('EPSG:3857');
const maxResolution = getWidth(proj3857.getExtent()) / 256;

for (let i = 0; i < 20; i++) {
  matrixIds[i] = i.toString();
  resolutions[i] = maxResolution / Math.pow(2, i);
}

const tileGrid = new WMTSTileGrid({
  origin: [-20037508, 20037508],
  resolutions: resolutions,
  matrixIds: matrixIds,
});

// Graticule
const createGraticuleLayer = (projection) => {
  const features = [];

  // Méridiens (15 degres)
  for (let lon = -180; lon <= 180; lon += 15) {
    const coords = [];
    for (let lat = -90; lat <= 90; lat += 5) {
      const point = transform([lon, lat], 'EPSG:4326', projection);
      coords.push(point);
    }
    features.push(new Feature({
      geometry: new LineString(coords),
    }));
  }

  // Parallèles (15 degres)
  for (let lat = -90; lat <= 90; lat += 15) {
    const coords = [];
    for (let lon = -180; lon <= 180; lon += 5) {
      const point = transform([lon, lat], 'EPSG:4326', projection);
      coords.push(point);
    }
    features.push(new Feature({
      geometry: new LineString(coords),
    }));
  }

  const source = new VectorSource({ features });
  const layer = new VectorLayer({
    title: 'Méridiens et Parallèles',
    source,
    style: new Style({
      stroke: new Stroke({
        color: 'rgba(255, 255, 255, 0.3)',
        width: 1,
      }),
    }),
    visible: true,
  });

  return layer;
};

const map = new Map({
  controls: [],
  view: new View({
    zoom: mapStore.zoom,
    center: transformToEqualEarth(mapStore.center), // 8857
    minZoom: 0,
    maxZoom: 22,
    projection: equalEarthProjection, // equalearthProjection
  }),
  layers: [
    new TileLayer({
      title: 'Cartes',
      source: new WMTS({
        url: 'https://data.geopf.fr/wmts',
        layer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2',
        matrixSet: 'PM',
        format: 'image/png',
        style: 'normal',
        projection: 'EPSG:3857',
        tileGrid: tileGrid,
      }),
    }),
    new TileLayer({
      title: 'Images Satellites',
      source: new WMTS({
        url: 'https://data.geopf.fr/wmts',
        layer: 'ORTHOIMAGERY.ORTHOPHOTOS',
        matrixSet: 'PM',
        format: 'image/jpeg',
        style: 'normal',
        projection: 'EPSG:3857',
        tileGrid: tileGrid,
      }),
    }),
    createGraticuleLayer(equalEarthProjection)
  ],
});

const showOverlay = ref(false);
let lastMode = null;
let messageModePlanisphere = computed(() => mapStore.isPlanisphereMode ? 'Mode planisphère activé' : 'Mode planisphère désactivé');

let updateMapView = () => {
  let view = map.getView();
  let zoom = view.getZoom();
  let center = transformFromEqualEarthTo4326(view.getCenter()); // 4326

  // sync avec la map
  mapStore.zoom = zoom;
  mapStore.x = transform(center[0], getProjection('EPSG:4326'), getProjection('EPSG:3857')); // 3857
  mapStore.y = transform(center[1], getProjection('EPSG:4326'), getProjection('EPSG:3857')); // 3857
  mapStore.lon = center[0]; // 4326
  mapStore.lat = center[1]; // 4326
};

watch(() => mapStore.isPlanisphereMode, (newMode) => {
  if (lastMode !== null && lastMode !== newMode) {
    // Mode changed, show overlay
    showOverlay.value = true;
    setTimeout(() => {
      showOverlay.value = false;
    }, 500);

    if (newMode) {
      let view = map.getView();
      let center = transformToEqualEarth(mapStore.center);
      view.setCenter(center);
      view.setZoom(mapStore.zoom);
      map.setTarget('planisphere');
      setTimeout(() => map.updateSize(), 0);
    } else {
      map.setTarget(null);
    }
  }
  lastMode = newMode;
});

map.on("moveend", () => {
  if (mapStore.isPlanisphereMode) {
    updateMapView();
  }
});

onMounted(() => {
  if (!mapStore.isPlanisphereMode) {
    map.setTarget(null);
  } else {
    map.setTarget('planisphere');
  }

  lastMode = mapStore.isPlanisphereMode;
});

// controls
const scaleLineOptions = {
  id: "4",
  units: 'metric',
  bar: false,
};

const layerSwitcherOptions = {
  options: {
    id: "2",
    position : "top-right",
    collapsed: true,
    gutter: true,
    panel: true,
    counter: true,
    allowEdit: false,
    allowGrayScale: false,
    allowDraggable: false,
    allowDelete: false,
  }
};

let scaleLine = new ScaleLine(scaleLineOptions);
map.addControl(scaleLine);

let layerSwitcher = new LayerSwitcher(layerSwitcherOptions);
map.addControl(layerSwitcher);
</script>

<template>
  <div>
    <div
      class="overlay-mask"
      :class="{ hidden: !showOverlay }"
    >
      <p>{{ messageModePlanisphere }}</p>
    </div>
    <div
      class="planisphere-wrapper"
      :class="{ hidden: !mapStore.isPlanisphereMode }"
    >
      <div
        id="planisphere"
        class="map"
      >
        <div
          id="position-container-top-left"
          class="position position-container-top-left"
        >
          <div
            class="GPwidget gpf-widget gpf-widget-button btn-title"
          >
            <button
              type="button"
              class="GPshowOpen gpf-btn-icon fr-btn fr-btn--tertiary gpf-btn--tertiary gpf-btn btn-title fr-px-4v"
              @click="modals.open('planisphere')"
            >
              <span>Mode planisphère activé</span>
              <span
                class="fr-icon-question-fill fr-ml-3v"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.planisphere-wrapper {
  position: absolute;
  inset: 0;
  z-index: 10;
  height: 100cqh;
  background: var(--background-disabled-grey);
  opacity: 1;
  pointer-events: auto;
}

.planisphere-wrapper.hidden {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}
.map {
  height: 100%;
}
.overlay-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 20;
  opacity: 1;
  transition: opacity 0s;

  display: flex;
  justify-content: center;
  align-items: center;
}
.overlay-mask p {
  color: white;
  font-size: 1.5em;
}

.overlay-mask.hidden {
  opacity: 0;
  pointer-events: none;
  transition: opacity 1s;
}

.btn-title {
  width: auto !important;
  white-space: nowrap;
}
</style>
