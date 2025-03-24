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
 * - format
 * - type ex. import, service, mapbox...
 * - target ex. internal ou external
 * 
 * ainsi que :
 * - opacity
 * - visible
 * - gray
 * 
 * Paramètre spécial :
 * // HACK pour stopper la propagation de la reactivité
 * // ex. les croquis en cours de modifications dans l'outil de dessin ! 
 * - stop
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
    if (params) {
      Object.keys(params).forEach(key => p.append(key, params[key]));
    }
    url += "?" + p.toString();
  }
  if (!url) {
    console.debug("toShare: URL publique non définie !");
  }
  return url;
};

/**
 * Retourne les paramètres utiles d'un document à partir d'un URL de partage
 * @param {*} url 
 * @returns {*} - les parametres de l'URL
 */
export const fromShare = (url) => {
  var params = {};
  params.url = url.split('?')[0];
  // les params de l'URL
  var p = new URLSearchParams(url.split('?')[1]);
  p.forEach((value, key) => {
    params[key] = value;
  });
  if (Object.keys(params).length === 0) {
    console.debug("fromShare: Params non défini !");
  }
  return params;
};