import { defineStore } from 'pinia'

/**
 * Store des couches
 * - branchement sur l'aggregation des GetCapabilities
 * - utilisation des informations éditoriales : fonds de carte, thématique...
 * - ressources additionnelles : metadonnées, vignettes, ...
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
    getLayerByID : (state) => { return (id) => state.data.layers[id]; },
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
    getTileMatrixSetByID : (state) => { return (id) =>  state.data.tileMatrixSets[id]; }
  },
  // methodes
  methods: {
    
  },
  // actions
  actions: {
    /**
     * Téléchargement de l'aggregation des GetCapabilities
     * avec fusion avec les informations editoriales
     * /!\ opération asynchrone && initialisation de la carte /!\
     */
    async fetchData() {
      var urls = [
        import.meta.env.VITE_GPF_CONF_TECH_URL,
        import.meta.env.VITE_GPF_CONF_LAYERS_URL
      ]
      return Promise.all(
        urls.map((url) => fetch(url)
          .then((response) => response.json())))
          .then((jsons) => {
            var techs = jsons[0]
            var edito = jsons[1]
            Object.keys(edito.layers).forEach(id => {
              Object.assign(techs.layers[id], edito.layers[id]); // merge
            });
            this.data = techs
            this.isLoaded = true
          })
          .catch((e) => {
            console.error('An error occurred:', e)
          });
    }
  }
})
