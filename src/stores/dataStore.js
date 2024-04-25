import { defineStore } from 'pinia'

/**
 * Store des couches
 * - branchement sur l'aggregation des GetCapabilities (3.7Mo)
 * - utilisation des informations éditoriales : fonds de carte, thématique...
 * @todo ajouter les getters
 */
export const useDataStore = defineStore('data', {
  // state
  state: () => ({
    data: {},
    isLoaded: false
  }),
  // getters
  getters: {
    // TODO getters : 
    // - recherche des param tech pour une couche
    getLayers : (state) => state.data.layers,
    getLayerByID : (state) => { return (id) => state.data.layers[id] },
    getLayerByName : (state) => {
      // Ex. OCSGE.COUVERTURE.2011$GEOPORTAIL:OGC:WMS
      // ID : {name}$GEOPORTAIL:(OGC|GPP):(WMTS|WMS|TMS|WFS)
      return (name, service) => {
        var id = null;
        for (const key in state.data.layers) {
          if (Object.hasOwnProperty.call(state.data.layers, key)) {
            const l = state.data.layers[key];
            if (l.name === name && l.serviceParams.id.split(":")[1] === service) {
              id = l.name + "$GEOPORTAIL:" + l.serviceParams.id
              return state.data.layers[id];
            }
          }
        }
      }
    },
    getTileMatrixSets  : (state) => state.data.tileMatrixSets,
    getTileMatrixSetByName : (state) => {}
  },
  // actions
  actions: {
    /**
     * Téléchargement des couches
     * @todo opération asynchrone à gérer avec l'initialisation de la carte
     */
    async fetchData() {
      var url = "https://raw.githubusercontent.com/IGNF/geoportal-configuration/new-url/dist/fullConfig.json"
      try {
        const response = await fetch(url)
        this.data = await response.json()
        this.isLoaded = true
      } catch (e) {
        console.error(e)
      }
    }
  }
})
