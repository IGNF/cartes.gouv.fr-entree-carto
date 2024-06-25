import {
  defineStore
} from 'pinia';


import {
  useStorage
} from '@vueuse/core';

const layerByDefault = "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2$GEOPORTAIL:OGC:WMTS";

/**
 * Store des objets de la carte
 * Enregistrement dans le LocalStorage
 * 
*/
export const useMapStore = defineStore('map', () => {
  const map = ref({});
  var zoom = useStorage('zoom', 12); // FIXME zoom absolu ?
  var x = useStorage('x', 283734.248995);
  var y = useStorage('y', 5655117.100650);
  var lon = useStorage('lon', 2.5479878714752027);
  var lat = useStorage('lat', 50.800781249995744);
  var center = computed(() => {
    return [x.value, y.value];
  });
  var layers = useStorage('layers', layerByDefault);
  if (!layers.value) {
    addLayer(layerByDefault);
  }

  watch(zoom, () => {
    localStorage.setItem('zoom', zoom.value);
  })
  watch(x, () => {
    localStorage.setItem('x', x.value);
  })
  watch(y, () => {
    localStorage.setItem('y', y.value);
  })
  watch(lon, () => {
    localStorage.setItem('lon', lon.value);
  })
  watch(lat, () => {
    localStorage.setItem('lat', lat.value);
  })
  watch(layers, () => {
    localStorage.setItem('layers', layers.value.toString()); // string
  })
  watch(center, () => {
    localStorage.setItem('center', center.value.toString()); // string
  })

  function getMap () {
    return map.value;
  }

  function setMap (m) {
    map.value = m;
  }

  function getLayers () {
    return layers.value.split(",").filter(function (l) {
      return !!l;
    }); // array
  }

  function addLayer (id) {
    if (getLayers().includes(id)) {
      return;
    }
    var l = getLayers();
    l.push(id);
    layers.value = l.toString(); // string
  }

  function removeLayer (id) {
    const index = getLayers().indexOf(id);
    if (index !== -1) {
      var l = getLayers();
      l.splice(index, 1);
      layers.value = l.toString(); // string
    }
  }

  return {
    map,
    zoom,
    center,
    x,
    y,
    lon,
    lat,
    getMap,
    setMap,
    getLayers,
    addLayer,
    removeLayer
  }
})