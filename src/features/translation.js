/**
 * Libellé des messages
 * 
 * @example
 * import t from "@/features/translation.js";
 * push.success({
 *   title: t.bookmark.title,
 *   message: t.bookmark.success_add_data("permalien")
 * });
 */

export default {
  auth: {
    title: "Authentification",
    failed: (value) => { return `Exception sur l'authentication : ${value}`; }
  },
  bookmark: {
    title: "Espace personnel",
    failed: (value) => { return `Exception sur l'espace personnel : ${value}`; },
    failed_add_data: (value) => { return `Erreur sur l'ajout de la donnée : ${value}`; },
    success_add_data: (value) => { return `Ajout sur la carte de la donnée de type ${value}`; },
    failed_type_unknow: (value) => { return `Impossible de determiner le type de données : ${value}`; },
    failed_not_yet_implemented: (value) => { return `Pas encore implementé : ${value} !`; },
  },
  ol: {
    title: "OpenLayers",
    failed: (value) => { return `Exception sur OpenLayers : ${value}`; },
    failed_format: (value) => { return `Le format n'est pas reconnu : ${value}`; },
    failed_source: (value) => { return `Exception sur l'initialisation de la source de type ${value} !`; },
    failed_layer: (value) => { return `Exception sur l'initialisation de la couche de type ${value} !`; },
    failed_mapbox: (value) => { return `Exception de la couche MapBox : ${value} !`; }
  }
};