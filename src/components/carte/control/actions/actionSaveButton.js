/**
 * Créer un document pour un vecteur de type :
 * - drawing
 * - import
 * - compute
 * 
 * @param {Object} data - parametres
 * @property {String} data.content - export data
 * @property {String} data.name - name
 * @property {String} data.description - description
 * @property {String} data.format - format : kml, geojson, ...
 * @property {String} data.target - internal, external
 * @property {String} data.compute - route
 * @property {String} data.type - drawing, import, bookmark, compute
 * @property {Object} data.layer - layer
 * @param {Object} iocEmitter - injection composant Emitter
 * @param {Object} iocService - injection composant Services
 */
const useCreateDocument = async (data, iocEmitter, iocService) => {
  try {
    const o = await iocService.setDocument(data)
    var uuid = o.uuid;
    var action = o.action;
    
    // mise à jour de l'id interne de la couche
    if (data.layer.gpResultLayerId) {
      data.layer.gpResultLayerId = `bookmark:${data.type}-${data.compute || data.format}:${uuid}`;
    }
    
    // mise à jour de l'entrée du gestionnaire de couche
    if (data.layer.gpResultLayerDiv) {
      var div = data.layer.gpResultLayerDiv.querySelector("label[id^=GPname_ID_]");
      if (div) {
        div.innerHTML = data.name;
        div.title = data.description;
      }  
    }

    // rendre public le document
    const s = await iocService.sharingDocument({
      uuid : uuid,
      type : data.type
    });
    console.debug(s);

    // mise à jour des extras du document
    const x = await iocService.updateMetadataDocument({
      uuid : uuid,
      type : data.type,
      name : data.name,
      description : data.description,
      // FIXME extra !? sinon, labels !
      extra : {
        format: data.format.toLowerCase(),
        target: "internal",
        date: new Date().toLocaleDateString()
      }
    });
    console.debug(x);

    // emettre un event pour prévenir l'ajout d'un croquis
    // au composant des favoris
    iocEmitter.dispatchEvent("document:saved", {
      uuid : uuid,
      action : action // added, updated, deleted
    });

    return o;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Mettre à jour un document pour un vecteur de type :
 * - drawing
 * - import
 * - compute
 * 
 * @param {Object} data - parametres
 * @property {String} data.content - export data
 * @property {String} data.name - name
 * @property {String} data.description - description
 * @property {String} data.format - format : kml, geojson, ...
 * @property {Object} data.layer - layer
 * @param {Object} iocEmitter - injection composant Emitter
 * @param {Object} iocService - injection composant Services
 */
const useUpdateDocument = async (data, iocEmitter, iocService) => {
  try {
    const o = await iocService.updateGeometryDocument(data);
    var uuid = o.uuid;
    var action = o.action;

    // mise à jour de l'entrée du gestionnaire de couche
    if (data.layer.gpResultLayerDiv) {
      var div = data.layer.gpResultLayerDiv.querySelector("label[id^=GPname_ID_]");
      if (div) {
        div.innerHTML = data.name;
        div.title = data.description;
      }  
    }

    const document = iocService.find(uuid);
    if (document && !document.public_url) {
      // rendre public le document
      const s = await iocService.sharingDocument({
        uuid : uuid,
        type : data.type
      });
      console.debug(s);
    }

    // mise à jour des extras du document
    const x = await iocService.updateMetadataDocument({
      uuid : uuid,
      type : data.type,
      name : data.name,
      description : data.description,
      // FIXME extra !? sinon, labels !
      extra : {
        format: data.format.toLowerCase(),
        target: "internal",
        date: new Date().toLocaleDateString()
      }
    });
    console.debug(x);
    
    // emettre un event pour prévenir l'ajout d'un croquis 
    // au composant des favoris
    iocEmitter.dispatchEvent("document:updated", {
      uuid : uuid,
      action : action // added, updated, deleted
    });

    return o;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

export {
  useCreateDocument,
  useUpdateDocument
}