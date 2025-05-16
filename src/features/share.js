import { useServiceStore } from '@/stores/serviceStore';

/**
 * @description
 * 
 * Les paramètres utiles à placer dans l'URL de partage afin d'identifier la 
 * bonne configuration d'une donnée à afficher sur la carte :
 * - url
 * - id
 * - name
 * - description
 * - format ex. json, gpx, kml...
 * - type ex. import, service, mapbox...
 * - target ex. internal ou external
 * - kind ex. wmts, wms, mapbox
 * - compute ex. isocurve
 * 
 * ainsi que :
 * - opacity
 * - visible
 * - position
 * - grayscale
 * 
 * Paramètre spécial :
 * // HACK pour stopper la propagation de la reactivité
 * // ex. les croquis en cours de modifications dans l'outil de dessin ! 
 * - stop
 * 
 * Une fonction de reduction d'url de partage est prévue
 * pour éviter d'avoir une URL trop longue.
 */

/**
 * Retourne une URL à partir des informations d'un document
 * @param {*} document 
 * @param {*} params 
 * @returns {String} - URL de partage
 */
export const toShare = (document, params) => {
  var store = useServiceStore();
  var service = store.getService();

  if (!document) {
    console.debug("toShare: Document non défini !");
    return;
  }

  var url = null;
  if (document.public_url) {
    var url = document.public_url;
    var p = new URLSearchParams();
    p.append("id", document._id);
    p.append("name", document.name);
    p.append("description", document.description);
    p.append("format", document.labels.find((e) => service.labelsFormats.includes(e)));
    p.append("type", document.labels.find((e) => service.labels.includes(e)));
    p.append("target", document.labels.find((e) => service.labelsTarget.includes(e)));
    p.append("kind", document.labels.find((e) => service.labelsService.includes(e)));
    p.append("compute", document.labels.find((e) => service.labelsCompute.includes(e)));
    if (params) {
      Object.keys(params).forEach(key => p.append(key, params[key]));
    }
    url += "?" + p.toString();
  }
  if (!url) {
    console.debug("toShare: URL publique non définie !");
    return;
  }
  return _reduce(url);
};

/**
 * Retourne les paramètres utiles d'un document à partir d'un URL de partage
 * @param {*} url 
 * @returns {*} - les parametres de l'URL
 */
export const fromShare = (url) => {
  // a t on une URL de partage réduite ?
  // ex. ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk.bin?n=gris&f=mapbox&t=service&c=internal&k=mapbox&v=1&o=0.5&g=0
  // ou ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk.bin(n=gris,f=mapbox,t=service,c=internal,k=mapbox,v=1,o=0.5,g=0)
  var params = {};
  
  if (!url) {
    console.debug("toShare: URL publique non définie !");
    return;
  }

  var _url;
  var _params;
  if (SEPARATOR_REDUCED_GROUP) {
    _url = url.split('(')[0];
    _params = url.split('(')[1].split(')')[0];
  } else {
    _url = url.split(SEPARATOR_REDUCED_URL)[0];
    _params = url.split(SEPARATOR_REDUCED_URL)[1];
  }
  
  var p = new URLSearchParams(_params);
  p.forEach((value, key) => {
    params[key] = value;
  });
  if (Object.keys(params).length === 0) {
    console.debug("fromShare: Document non défini !");
    return;
  }
  params.u = _url.split('?')[0];
  params.i = params.i || params.u.split('.')[0];
  return _extend(params);
};

// EVOLUTION
// pour les URL réduites, on peut la parametrer
// par défaut, on utilise le ? pour séparateur d'url / kvp
// et le & pour le séparateur des parametres
// ex. 
// ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk.bin?n=gris&f=mapbox&t=service&c=internal&k=mapbox&v=1&o=0.5&g=0
// on peut aussi choisir de ne pas utiliser le ? et le &
// et grouper les parametres entre parenthèses si besoin
// ex.
// ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk.bin(n=gris,f=mapbox,t=service,c=internal,k=mapbox,v=1,o=0.5,g=0)
const SEPARATOR_REDUCED_URL = '?'; // TODO autre choix
const SEPARATOR_REDUCED_PARAMS = '&'; // TODO autre choix 
const SEPARATOR_REDUCED_GROUP = false; // TODO choix true -> ()
const REDUCED_BASE_URL = import.meta.env.VITE_GPF_BASE_URL_DOCUMENT || 'https://data.geopf.fr/documents/'; 
const REDUCED_KVP = {
  "url": {k:"u", opt:false},
  "id": {k:"i", opt:false},
  "name": {k:"n", opt:false},
  "description": {k:"d", opt:true},
  "format": {k:"f", opt:false},
  "type": {k:"t", opt:false}, 
  "target": {k:"c", opt:false},
  "kind": {k:"k", opt:false},
  "compute": {k:"w", opt:false},
  "position": {k:"p", opt:false},
  "opacity": {k:"o", opt:false},
  "visible": {k:"v", opt:false},
  "grayscale": {k:"g", opt:false},
  "stop": {k:"s", opt:false},
};

/**
 * Réduit une URL de partage
 * @param {*} url 
 * @returns {String} - URL réduite
 */
const _reduce = (url) => {
  // Réduire l'URL avec un mapping des parametres et une url reduite au minima
  // ex. 
  // https://data.geopf.fr/documents/ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk.bin?id=b95feb80-da74-451f-a0e5-cc6dc3c4acb4&name=gris&description=Import+Mapbox&format=mapbox&type=service&target=internal&kind=mapbox&visible=true&opacity=0.5&grayscale=false
  // devient :
  // ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk.bin?n=gris&f=mapbox&t=service&c=internal&k=mapbox&v=1&o=0.5&g=0
  // ou
  // ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk.bin(n=gris,f=mapbox,t=service,c=internal,k=mapbox,v=1,o=0.5,g=0)
  var p = new URL(url);
  var params = new URLSearchParams(p.search);
  var reduced = new URLSearchParams();
  params.forEach((value, key) => {
    // on ne garde pas les parametres qui n'ont pas de valeur
    if (value === '' || value === undefined || value === 'undefined') {
      return;
    }
    if (REDUCED_KVP[key]) {
      if (REDUCED_KVP[key].opt) {
        // on ne garde pas les parametres optionnels
        return;
      }
      // on remplace le parametre par son équivalent réduit
      reduced.append(REDUCED_KVP[key].k, value);
    } else {
      reduced.append(key, value);
    }
  });
  // on ajoute l'url de base
  var reducedUrl = (p.origin + p.pathname).replace(REDUCED_BASE_URL, '') +
    (SEPARATOR_REDUCED_GROUP ? '' : SEPARATOR_REDUCED_URL) + 
    (SEPARATOR_REDUCED_GROUP ? '(' : '') +
    reduced.toString().replace('&', SEPARATOR_REDUCED_PARAMS) +
    (SEPARATOR_REDUCED_GROUP ? ')' : '');
  return reducedUrl;
};

/**
 * Retourne les parametres complets d'une URL de partage réduite
 * @param {*} params 
 * @returns {*} - parametres étendus
 */
const _extend = (params) => {
  // Etendre les paramètres
  // ex. ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk.bin?n=gris&f=mapbox&t=service&c=internal&k=mapbox&v=1&o=0.5&g=0&p=5
  // ou ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk.bin(n=gris,f=mapbox,t=service,c=internal,k=mapbox,v=1,o=0.5,g=0,p=5)
  // {
  //  u : ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk.bin
  //  i : b95feb80-da74-451f-a0e5-cc6dc3c4acb4 ou ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk
  //  n : gris
  //  d : Import+Mapbox
  //  f : mapbox
  //  t : service
  //  c : internal
  //  k : mapbox
  //  w : route
  //  p : 5
  //  v : 1
  //  o : 0.5
  //  g : 0
  // }
  // devient :
  // {
  //  url : https://data.geopf.fr/documents/ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk.bin
  //  id : b95feb80-da74-451f-a0e5-cc6dc3c4acb4 ou  ZSqrOC52yNfWvvJF4sUMz6FLjX4ZQPsMYAIPz1A0UDHoOk
  //  name : gris
  //  description : Import+Mapbox
  //  format : mapbox
  //  type : service
  //  target : internal
  //  kind : mapbox
  //  compute : route
  //  position : 5
  //  visible : true
  //  opacity : 0.5
  //  grayscale : false
  // }

  // on remplace les parametres réduits par les parametres complets
  var p = {};
  Object.keys(REDUCED_KVP).forEach(key => {
    p[REDUCED_KVP[key].k] = key;
  });

  var newParams = {};
  // on remplace les parametres par leur équivalent
  Object.keys(params).forEach(key => {
    var pvalue = params[key]; // TODO convertir les valeurs en booléen ou en nombre
    if (p[key]) {
      // on remplace le parametre par son équivalent
      newParams[p[key]] = pvalue;
    } else {
      newParams[key] = pvalue;
    }
  });
  // on complète l'url
  newParams.url = REDUCED_BASE_URL + newParams.url;
  return newParams;
};