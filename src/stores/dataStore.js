import { defineStore } from 'pinia'

/**
 * Store des couches
 * - branchement sur l'aggregation des GetCapabilities
 * - utilisation des informations éditoriales : fonds de carte, thématique...
 * - ressources additionnelles : metadonnées, vignettes, ...
 */
export const useDataStore = defineStore('data', () => {
const layers = ref({})
const loading = ref(true)
const error = ref("")


 async function fetchData() {
  try {
    const techUrl = import.meta.env.VITE_GPF_CONF_TECH_URL || "data/layers.json";
    const editoUrl = import.meta.env.VITE_GPF_CONF_EDITO_URL || "data/edito.json";
    const editoRes = await fetch(editoUrl);
    const techRes = await fetch(techUrl);
    const tech = await techRes.json();
    const edito = await editoRes.json();
    const editoWithTech = Object.fromEntries(Object.keys(edito.layers).map(id => {
      return [id, {...tech.layers[id], ...edito.layers[id]}] 
    }));
    const res = {...tech.layers, ...editoWithTech} // merge
    layers.value = res
    loading.value = false;
    return res
  }
  catch(err) {
    console.log(err)
    loading.value = false;
    error.value = err.message;
  }

}

function getLayerByName(name, service) {
  // Ex. OCSGE.COUVERTURE.2011$GEOPORTAIL:OGC:WMS
  // ID : {name}$GEOPORTAIL:(OGC|GPP):(WMTS|WMS|TMS|WFS)
  for (const key in layers.layers) {
    if (Object.hasOwnProperty.call(layers.layers, key)) {
      const l = layers.layers[key];
      if (l.name === name && l.serviceParams.id.split(":")[1] === service) {
        const id = l.name + "$GEOPORTAIL:" + l.serviceParams.id
        return layers.layers[id];
      }
    }
  }
}

function getLayerByID(id) {
  return layers.layers[id];
}

function getTileMatrixSets() {
  return layers.tileMatrixSets;
}

function getTileMatrixSetByID(id) {
  return layers.tileMatrixSets[id];
}

return {
    layers,
    error,
    loading,
    fetchData,
    getLayerByName,
    getLayerByID,
    getTileMatrixSets,
    getTileMatrixSetByID,
 }
})