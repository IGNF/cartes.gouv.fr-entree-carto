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
    // function removeOlLayer (l) {
    //   olLayers.push(l)
    //  }
  
    return {
      olLayers,
      addOlLayer
    }
  })