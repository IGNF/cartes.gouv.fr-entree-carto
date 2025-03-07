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
  const m_producers = ref([]);
  const m_layers = ref({});
  const m_generalOptions = ref({});
  const m_tileMatrixSets = ref({});
  const m_contacts = ref({});
  const m_territories = ref([]);
  const m_featured = ref([]);
  const isLoaded = ref(false);
  const error = ref("");
  const filterServices = "WMTS,WMS,TMS";
  const filterProjections = "IGNF:LAMB93,EPSG:2154";

  /**
   * @todo utiliser l'implementation officielle @link{https://vueuse.org/core/useFetch/}
   */
  async function fetchData() {
    try {

      const techUrl = import.meta.env.VITE_GPF_CONF_TECH_URL || "data/layers.json";
      const editoUrl =
        import.meta.env.VITE_GPF_CONF_EDITO_URL || "data/edito.json";
      const privateUrl =
        import.meta.env.VITE_GPF_CONF_PRIVATE_URL || "data/private.json";

      const editoRes = await fetch(editoUrl);
      const techRes = await fetch(techUrl);
      const privateRes = await fetch(privateUrl);

      const tech = await techRes.json();
      const edito = await editoRes.json();
      const priv = await privateRes.json();

      var themes = []
      var producers = []
      const editoWithTech = Object.fromEntries(
        Object.keys(edito.layers).map(id => {
          // si l'id de la couche dans edito a bien une correspondance dans tech ou private
          if (tech.layers.hasOwnProperty(id) || priv.layers.hasOwnProperty(id)) {
            // gestion des thematiques si c'est une string on tranforme en tableau
            let ret = edito.layers[id];
            if(edito.layers[id].hasOwnProperty("thematic") 
              && edito.layers[id].thematic.length > 0) {
                if (typeof edito.layers[id].thematic == 'string') {
                  // this line convert the thematic in array donc passe aussi dans la condition suivante
                  ret.thematic = [edito.layers[id].thematic];
                }
                if (Array.isArray(edito.layers[id].thematic)) {
                  themes.push(...edito.layers[id].thematic)
                }

            }
            // gestion des producers si c'est une string on tranforme en tableau
            if(edito.layers[id].hasOwnProperty("producer")
              && edito.layers[id].producer.length > 0) {
                if (typeof edito.layers[id].producer == 'string') {
                  // this line convert the thematic in array donc passe aussi dans la condition suivante
                  ret.producer = [edito.layers[id].producer];
                }
                if (Array.isArray(edito.layers[id].producer)) {
                  producers.push(...edito.layers[id].producer)
                }
            }
            // on rajoute les info edito à l'entrée
            return [id, {
              ...tech.layers[id],
              ...priv.layers[id],
              ...ret
            }]
          } else {
            // sinon on supprime l'entrée edito avec le filter
            return undefined;
          }
      }).filter(entry => entry));

      // on fusionne tech et priv avec l'objet edito nettoyé
      const res = {
        ...tech.layers,
        ...priv.layers,
        ...editoWithTech
      };

      // ajoute la clé aux propriétés
      Object.keys(res).map((key) => { 
        // On filtre les couches : 
        // - on garde celle qui correspondent à un des filterServices
        // - on supprime celles qui possèdent une des filterProjections
        if(filterServices.split(",").some(service => res[key].serviceParams.id.includes(service))
          && !filterProjections.split(",").some(proj => res[key].defaultProjection.includes(proj)))
        {
          res[key].key = key;
          let ret = {};
          ret[key] = res[key];
          // initialise les sans thématiques à Autres
          if (!ret[key].hasOwnProperty("thematic") || ret[key].thematic.length == 0) { ret[key].thematic =  ["Autres"];}
          if (!ret[key].hasOwnProperty("producer") || ret[key].producer.length == 0) { ret[key].producer =  ["Autres"];}
          return ret;
        } else  {
          delete res[key];
        }
      });

      m_territories.value = edito.territories;
      m_contacts.value = edito.contacts;
      m_informations.value = edito.informations;
      m_featured.value = edito.featured || [];
      m_layers.value = res;
      m_generalOptions.value.apiKeys = {
        ...tech.generalOptions.apiKeys,
        ...priv.generalOptions.apiKeys
      }
      m_tileMatrixSets.value = tech.tileMatrixSets;

      // Initialisation Objet thematiques 
      // réduction à des valeurs uniques
      m_thematics.value = [...new Set(themes)].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
      m_thematics.value.push("Autres");
      // Les layers sont des copies de m_layers
      // Structure : [["thematic1", [{layer1}, {layer2}, ...]], ...]
      m_thematics.value = m_thematics.value.map((thematic) => {
        return [thematic, getLayersByThematic(m_layers.value, thematic)]
      })
      // Initialisation Objet producers
      // réduction à des valeurs uniques
      m_producers.value = [...new Set(producers)].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
      m_producers.value.push("Autres");
      // Les layers sont des copies de m_layers
      // Structure : [["thematic1", [{layer1}, {layer2}, ...]], ...]
      m_producers.value = m_producers.value.map((producer) => {
        return [producer, getLayersByProducer(m_layers.value, producer)]
      })

      this.isLoaded = true;
      return res;

    } catch (err) {
      console.log(err);
      this.isLoaded = false;
      error.value = err.message;
    }

  }

  function getTerritories () {
    return m_territories.value;
  }

  function getContacts () {
    return m_contacts.value;
  }

  function getInformations() {
    return m_informations.value;
  }

  function getThematics() {
    return m_thematics;
  }
  function getLayersByThematic(layers, thematic) {
    return Object.keys(layers).filter(key => layers[key].thematic.includes(thematic))
    .map(layerID => {
        let layerObj = {}
        layerObj[layerID] = layers[layerID]
        return layers[layerID]
    })
    .sort((a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }))
  }

  function getProducers() {
    return m_producers;
  }

  function getLayersByProducer(layers, producer) {
    return Object.keys(layers).filter(key => layers[key].producer.includes(producer))
    .map(layerID => {
        let layerObj = {}
        layerObj[layerID] = layers[layerID]
        return layers[layerID]
    })
    .sort((a, b) => a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }))
  }

  function getFeatured() {
    return m_featured.value;
  }

  function getLayers() {
    return m_layers.value;
  }

  function getLayersSignatures() {
    return Object.fromEntries(Object.entries(m_layers.value).map(([key, val]) => [val.name, val.serviceParams.id.split(":")[1]]));
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
    filterProjections,
    filterServices,
    fetchData,
    getTerritories,
    getContacts,
    getInformations,
    getThematics,
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
    getGlobalConstraintsByName
  }
})
