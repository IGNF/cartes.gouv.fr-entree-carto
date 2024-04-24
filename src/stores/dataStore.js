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
    data: undefined
  }),
  // getters
  getters: {
    getLayers : (state) => state.data.layers,
    getTileMatrixSets  : (state) => state.data.tileMatrixSets,
    // TODO getters : 
    // - recherche par couche
    // - recherche pat tms
    // - recherche des param tech pour une couche
  },
  // actions
  actions: {
    /**
     * Téléchargement des couches
     * @fixme opération asynchrone à gérer avec l'initialisation de la carte
     */
    async fetchData() {
      var url = "https://raw.githubusercontent.com/IGNF/geoportal-configuration/new-url/dist/fullConfig.json"
      try {
        const response = await fetch(url)
        this.data = await response.json()
      } catch (e) {
        console.error(e)
      }
    }
  }
})
