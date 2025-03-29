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
    title: 'Authentification',
    not_authentificated: 'Vous devez vous authentifier',
    failed: (value) => { return `Exception sur l'authentication : ${value}` }
  },
  bookmark: {
    title: 'Espace personnel',
    failed: (value) => { return `Exception sur l'espace personnel : ${value}` },
    failed_add_data: (value) => { return `Erreur sur l'ajout de la donnée : ${value}` },
    success_add_data: (value) => { return `Ajout sur la carte de la donnée de type ${value}` },
    failed_type_unknow: (value) => { return `Impossible de determiner le type de données : ${value}` },
    failed_not_yet_implemented: (value) => { return `Pas encore implementé : ${value} !` },
  },
  drawing: {
    title: 'Croquis',
    save_success: 'Le croquis est enregistré dans l\'espace personnel',
    save_failed: 'Une erreur est survenue sur l\'enregistrement du croquis'
  },
  layerimport: {
    title: 'Import de couche',
    add_success_service: (value) => { return `La couche du service ${value} est ajoutée à la carte` },
    add_failed_service: (value) => { return `Une erreur est survenue dans l\'ajout de la couche ${value} !` }
  },
  layerswitcher: {
    title: 'Gestionnaire de couche',
    add_success: 'La couche est ajoutée à la carte',
    add_failed: 'Une erreur est survenue dans l\'ajout de la couche',
    remove_success: 'La couche est supprimé de la carte',
    remove_failed: 'Une erreur est survenue dans la suppression de la couche',
    failed_not_yet_implemented: 'L\'édition de ce type de données n\'est pas encore gérée !',
  },
  searchengine: {
    title: 'Recherche de couche'
  },
  ol: {
    title: 'OpenLayers',
    failed: (value) => { return `Exception sur OpenLayers : ${value}` },
    failed_format: (value) => { return `Le format n'est pas reconnu : ${value}` },
    failed_source: (value) => { return `Exception sur l'initialisation de la source de type ${value} !` },
    failed_layer: (value) => { return `Exception sur l'initialisation de la couche de type ${value} !` },
    failed_mapbox: (value) => { return `Exception de la couche MapBox : ${value} !` }
  }
}
