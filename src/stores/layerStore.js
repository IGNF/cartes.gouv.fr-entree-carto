import {
    defineStore
  } from 'pinia';
  
  /**
   * Store des objets de la carte
   * Enregistrement dans le LocalStorage
   * 
  */
  export const useLayerStore = defineStore('layer', () => {
    const olLayers = reactive([])
  
    function addOlLayer (l) {
      olLayers.push(l)
    }
    function removeOlLayer (ol_uid) {
      let index = olLayers.map(l => l.ol_uid).indexOf(ol_uid)
      delete olLayers[index]
     }
  
    return {
      olLayers,
      addOlLayer,
      removeOlLayer
    }
  })