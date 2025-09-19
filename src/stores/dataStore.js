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
  const m_layers = ref({});
  const m_generalOptions = ref({});
  const m_tileMatrixSets = ref({});
  const m_contacts = ref({});
  const m_territories = ref([]);
  const m_featured = ref([]);
  const m_alerts = ref([]);
  const m_topics = ref([]);
  const isLoaded = ref(false);
  const error = ref("");
  const filterServices = "WMTS,WMS,TMS";
  const filterProjections = "IGNF:LAMB93,EPSG:2154";

  const themes = ref([])
  const producers = ref([])

  const m_thematics = computed(() => {
    let ret = []
    ret = [...new Set(Object.values(m_layers.value)
                .flatMap(layer => layer?.thematic || [])
                .filter(thematic => typeof thematic === 'string'))
          ].sort((a, b) => {
            if (a === 'Autres') return 1; // 'Autres' vient après b
            if (b === 'Autres') return -1; // a vient avant 'Autres'
            return a.localeCompare(b, 'fr', { sensitivity: 'base' })
          });
    // Structure : [["thematic1", [{layer1}, {layer2}, ...]], ...]
    ret = ret.map((thematic) => {
      return [thematic, getLayersByThematic(thematic)]
    })
    return ret
  });

  const m_producers = computed(() => {
    let ret = []
    ret = [...new Set(Object.values(m_layers.value)
                    .flatMap(layer => layer?.producer || [])
                    .filter(producer => typeof producer === 'string'))
          ].sort((a, b) => {
            if (a === 'Autres') return 1; // 'Autres' vient après b
            if (b === 'Autres') return -1; // a vient avant 'Autres'
            return a.localeCompare(b, 'fr', { sensitivity: 'base' })
          });
    // Structure : [["thematic1", [{layer1}, {layer2}, ...]], ...]
    return ret.map((producer) => {
      return [producer, getLayersByProducer(producer)]
    })
  });

  /**
   * @todo utiliser l'implementation officielle @link{https://vueuse.org/core/useFetch/}
   */
  async function fetchData() {
    try {

      var alertsRes = null;

      // on utilise les annexes pour les alertes
      // la stabilité n'étant pas fiable, on prévoit
      // un fallback (pour test)
      try {
        const alertsConfURL = import.meta.env.VITE_GPF_CONF_ALERTS;
        alertsRes = await fetch(alertsConfURL);
        if (!alertsRes.ok) throw new Error('Erreur HTTP');
      } catch (e) {
        // fallback uniquement sur un souci de réseau !
        alertsRes = await fetch("data/alerts.json");
      }

      const alerts = await alertsRes.json();

      m_alerts.value = alerts;

      const entreeCartoConfURL = import.meta.env.VITE_GPF_CONF_ENTREE_CARTO;
      const entreeCartoRes = await fetch(entreeCartoConfURL)
      const conf = await entreeCartoRes.json();

      m_territories.value = conf.territories;
      m_contacts.value = conf.contacts;
      m_featured.value = conf.featured || [];
      m_layers.value = conf.layers;
      m_generalOptions.value.apiKeys = {
        ...conf.generalOptions.apiKeys
      }
      m_tileMatrixSets.value = conf.tileMatrixSets;
      m_topics.value = conf.topics || [];

      this.isLoaded = true;
      return conf.layers;

    } catch (err) {
      console.log(err);
      this.isLoaded = false;
      error.value = err.message;
    }
  }

  function getTerritories() {
    return m_territories.value;
  }

  function getContacts() {
    return m_contacts.value;
  }

  function getAlerts() {
    return m_alerts.value.filter((alert) => alert.visibility.map);
  }

  function getThematics() {
    return m_thematics.value;
  }
  function getLayersByThematic(thematic) {
    return Object.keys(m_layers.value)
      .filter(key => m_layers.value[key].thematic.includes(thematic))
      .map(layerID => { return layerID })
  }

  function getProducers() {
    return m_producers.value;
  }

  function getLayersByProducer(producer) {
    return Object.keys(m_layers.value)
      .filter(key => m_layers.value[key].producer.includes(producer))
      .map(layerID => { return layerID })
  }

  function getFeatured() {
    return m_featured.value;
  }

  function getLayers() {
    return m_layers.value;
  }

  function getLayersSignatures() {
    return Object.fromEntries(
      Object.entries(m_layers.value)
        .map(([key, val]) => [val.name, val.serviceParams.id.split(":")[1]])
    );
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
      // par défaut, les projections devraient être en Geographique
      // sauf si renseignée
      params.projection = l.globalConstraint.crs; 
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

  function getTopics() {
    return m_topics.value;
  }

  return {
    error,
    isLoaded,
    filterProjections,
    filterServices,
    producers,
    themes,
    fetchData,
    getTerritories,
    getContacts,
    getAlerts,
    getLayersByThematic,
    getThematics,
    getLayersByProducer,
    getProducers,
    getFeatured,
    getLayers,
    getLayersSignatures,
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
    getGlobalConstraintsByName,
    getTopics
  }
})
