import {
  defineStore
} from 'pinia';

/**
 * Store des couches
 * - branchement sur l'aggregation des GetCapabilities
 * - utilisation des informations éditoriales : fonds de carte, thématique...
 * - ressources additionnelles : metadonnées, vignettes, ...
 */
export const useDataStore = defineStore('data', () => {
  const m_informations = ref({});
  const m_thematics = ref([]);
  const m_layers = ref({});
  const m_generalOptions = ref({});
  const m_tileMatrixSets = ref({});
  const m_contacts = ref({});
  const isLoaded = ref(false);
  const error = ref("");

  // TODO utiliser l'implementation officielle 
  // https://vueuse.org/core/useFetch/
  async function fetchData() {
    try {

      const techUrl =
        import.meta.env.VITE_GPF_CONF_TECH_URL || "data/layers.json";
      const editoUrl =
        import.meta.env.VITE_GPF_CONF_EDITO_URL || "data/edito.json";

      const editoRes = await fetch(editoUrl);
      const techRes = await fetch(techUrl);

      const tech = await techRes.json();
      const edito = await editoRes.json();

      const editoWithTech = Object.fromEntries(Object.keys(edito.layers).map(id => {
        return [id, {
          ...tech.layers[id],
          ...edito.layers[id]
        }]
      }));

      const res = {
        ...tech.layers,
        ...editoWithTech
      }; // merge

      m_contacts.value = edito.contacts;
      m_informations.value = edito.informations;
      m_thematics.value = edito.thematics;
      m_layers.value = res;
      m_generalOptions.value = tech.generalOptions;
      m_tileMatrixSets.value = tech.tileMatrixSets;
      this.isLoaded = true;
      return res;

    } catch (err) {
      console.log(err);
      this.isLoaded = false;
      error.value = err.message;
    }

  }

  function getContacts () {
    return m_contacts.value;
  }

  function getInformations() {
    return m_informations.value;
  }

  function getThematics() {
    return m_thematics.value;
  }

  function getLayers() {
    return m_layers.value;
  }

  function getLayerIdByName(name, service) {
    // Ex. OCSGE.COUVERTURE.2011$GEOPORTAIL:OGC:WMS
    // ID : {name}$GEOPORTAIL:(OGC|GPP):(WMTS|WMS|TMS|WFS)
    for (const key in m_layers.value) {
      if (Object.hasOwnProperty.call(m_layers.value, key)) {
        const l = m_layers.value[key];
        if (l.name === name && l.serviceParams.id.split(":")[1] === service) {
          const id = l.name + "$GEOPORTAIL:" + l.serviceParams.id
          return id;
        }
      }
    }
  }

  function getLayerByName(name, service) {
    const id = this.getLayerIdByName(name, service);
    return this.getLayerByID(id);
  }

  function getLayerByID(id) {
    return m_layers.value[id];
  }

  function getLayerByTitle(title) {
    return Object.values(m_layers.value).filter((layer) => {
      if (title && layer.title == title) {
        return layer;
      }
    })
  }

  function getLayerKeysByID(id) {
    var layerKeys = [];
    var resourcesByKey = m_generalOptions.value.apiKeys;
    for (var key in resourcesByKey) {
      var resourcesArray = resourcesByKey[key];
      resourcesArray.forEach(function (layerId) {
        if (layerId === id) {
          layerKeys.push(key);
        }
      });
    }
    return layerKeys;
  }

  function getLayerParamsByName(name, service) {
    var params = null;
    if ((service === "WMS" || Object.keys(this.getTileMatrixSets()).length !== 0) && Object.keys(this.getLayers()).length !== 0) {
      var id = this.getLayerIdByName(name, service);
      params = this.getLayerParamsByID(id);
    }
    return params;
  }

  function getLayerParamsByID(id) {
    var params = null;
    if (id) {
      params = {};
      // get the layer Conf Object
      var l = this.getLayerByID(id);

      var keys = this.getLayerKeysByID(id);
      if (keys.length === 0) {
        return;
      }

      // get services params
      for (var i = 0; i < keys.length; i++) {
        // only one serverUrl is saved in Gp.Config : with multiKeys, we have to retrieve the key used in the serverUrl property
        if (l.serviceParams.serverUrl[keys[i]]) {
          params.url = l.serviceParams.serverUrl[keys[i]];
        }
      }

      const wmsTypeRegex = /\/v\//;
      // WMS vector style always empty (not in getCap)
      if (wmsTypeRegex.test(params.url)) {
        params.styles = " ";
      } else {
        // WMS raster style is defined in getCap
        params.styles = l.styles[0].name;
      }

      params.version = l.serviceParams.version;
      params.format = l.formats[0].name;
      params.projection = l.defaultProjection;

      // get layer info and constraints
      params.minScale = l.globalConstraint.minScaleDenominator;
      params.maxScale = l.globalConstraint.maxScaleDenominator;
      params.extent = l.globalConstraint.bbox;
      params.legends = l.legends;
      params.title = l.title;
      params.description = l.description;

      // FIXME : Informations  non disponibles avec les getCap
      // params.metadata = l.getMetadata();
      // params.originators = l.getOriginators();
      // params.quicklookUrl = l.getQuicklookUrl();

      // WMTS : get the tileMatrixSetLimits
      if (l.wmtsOptions) {
        params.tileMatrixSetLimits = l.wmtsOptions.tileMatrixSetLimits;
        var TMSLink = l.wmtsOptions.tileMatrixSetLink;
        if (TMSLink) {
          params.TMSLink = TMSLink;
          var tmsConf = this.getTileMatrixSetByID(TMSLink);
          // TODO : Get matrix origin : Gp.Point = Object{x:Float, y:Float}
          // params.matrixOrigin = tmsConf.getTopLeftCorner();
          params.matrixIds = Object.keys(tmsConf.tileMatrices);
          params.tileMatrices = tmsConf.tileMatrices;
          // FIXME : pseudo mercator resolutions by default ? Mauvaise idée...
          params.nativeResolutions = tmsConf.nativeResolutions;
        }
      }
    }
    return params;
  }

  function getGlobalConstraintsByID(id) {
    var params = null;

    if (id) {
        // get layer configuration object
        var l = this.getLayerByID(id);
        params = {};
        params.projection = l.defaultProjection;
        params.minScale = l.globalConstraint.minScaleDenominator;
        params.maxScale = l.globalConstraint.maxScaleDenominator;
        params.extent = l.globalConstraint.bbox;
    }

    return params;
  }

  function getGlobalConstraintsByName(name, service) {
    var id = this.getLayerIdByName(name, service);
    return this.getGlobalConstraintsByID(id);
  }

  function getTileMatrixSets() {
    return m_tileMatrixSets.value;
  }

  function getTileMatrixSetByID(id) {
    return m_tileMatrixSets.value[id];
  }

  return {
    error,
    isLoaded,
    fetchData,
    getContacts,
    getInformations,
    getThematics,
    getLayers,
    getLayerKeysByID,
    getLayerIdByName,
    getLayerByName,
    getLayerByID,
    getLayerByTitle,
    getTileMatrixSets,
    getTileMatrixSetByID,
    getLayerParamsByName,
    getLayerParamsByID,
    getGlobalConstraintsByID,
    getGlobalConstraintsByName
  }
})