import { defineStore } from 'pinia'

/**
 * Store des objets de la carte
 * Enregistrement dans le LocalStorage
 * @todo à completer
 */
export const useMapStore = defineStore('map', {
  state: () => ({
    map: null,
    zoom: 0,
    center: []
  }),
  getters: {
    getMap: (state) => state.map,
    getZoom: (state) => state.zoom,
    getCenter: (state) => state.center
  },
  actions: {
    setMap(map) {
      this.map = map;
    },
    setZoom(zoom) {
      this.zoom = zoom;
      localStorage.setItem('zoom', zoom)
    },
    setCenter(center) {
      this.center = center;
      localStorage.setItem('center', center)
    }
  }
});
