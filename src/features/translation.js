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
    not_authentificated: "Vous devez vous authentifier",
    need_authentification: "Veuillez vous reconnecter pour sauvegarder votre document",
    failed: (value) => { return `Exception sur l'authentication : ${value}` }
  },
  bookmark: {
    title: "Espace personnel",
    failed: (value) => { return `Exception sur l'espace personnel : ${value}` },
    success_add_data: (value) => { return `Ajout sur la carte de la donnée de type ${value}` },
    failed_add_data: (value) => { return `Erreur sur l'ajout de la donnée : ${value}` },
    success_save_map: "La carte est enregistrée dans l'espace personnel",
    failed_save_map: "Une erreur est survenue sur l'enregistrement de la carte",
    success_copy_permalink: "Le permalien est copié",
    failed_type_unknow: (value) => { return `Impossible de determiner le type de données : ${value}` },
    failed_not_yet_implemented: (value) => { return `Pas encore implementé : ${value} !` },
    failed_transform_format: "Une erreur est survenue sur la transformation du format de la couche",
    failed_export_data: (value) => { return `Erreur sur l'export de la donnée : ${value}` },
    failed_copy_permalink: (value) => { return `Erreur sur la copie du permalien : ${value}` },
    failed_delete_data: (value) => { return `Erreur sur la suppression de la donnée : ${value}` },
    failed_rename_data: (value) => { return `Erreur sur le renommage de la donnée : ${value}` },
    warning_delete_document_in_bookmarks_carte: "Attention : le document supprimé est encore présent dans un document de type carte, il ne sera plus disponible sur les cartes enregistrées et donc sur le permalien !",
    confirm_delete_document: "Voulez-vous vraiment supprimer le document ?",
    confirm_delete_document_with_name: (value) => { return `Voulez-vous vraiment supprimer le document ${value} ?` },
    confirm_delete_document_in_bookmarks_carte: "Voulez-vous vraiment supprimer le document ? Attention : le document supprimé est encore présent dans un document de type carte, il ne sera plus disponible sur les cartes enregistrées et donc sur le permalien !"
  },
  drawing: {
    title: "Croquis",
    save_success: "Le croquis est enregistré dans l'espace personnel",
    save_failed: "Une erreur est survenue sur l'enregistrement du croquis",
    restore_failed : "Une erreur est survenue lors de la restauration du document"
  },
  layerimport: {
    title: "Import de couche",
    save_success: "L'import est enregistré dans l'espace personnel",
    save_failed: "Une erreur est survenue sur l'enregistrement de l'import",
    add_success_service: (value) => { return `La couche du service ${value} est ajoutée à la carte` },
    add_failed_service: (value) => { return `Une erreur est survenue dans l'ajout de la couche ${value} !` },
    add_success_mapbox: "La couche MapBox est ajoutée à la carte",
    add_failed_mapbox: "Une erreur est survenue dans l'ajout de la couche MapBox !",
  },
  layerswitcher: {
    title: "Gestionnaire de couche",
    add_success: "La couche est ajoutée à la carte",
    add_failed: "Une erreur est survenue dans l'ajout de la couche",
    remove_success: "La couche est supprimée de la carte",
    remove_failed: "Une erreur est survenue dans la suppression de la couche",
    failed_not_yet_implemented: "L'édition de ce type de données n'est pas encore gérée !",
  },
  route: {
    title: "Itinéraire",
    failed_import: "La couche importée ne semble pas être un calcul d'itinéraire !",
    save_already: "Le calcul d'itinéraire a déjà été enregistré dans l'espace personnel",
    save_success: "Le calcul d'itinéraire est enregistré dans l'espace personnel",
    save_failed: "Une erreur est survenue sur l'enregistrement du calcul d'itinéraire"
  },
  iso: {
    title: "Isochrone",
    failed_import: "La couche importée ne semble pas être un calcul d'isochrone !",
    save_already: "Le calcul d'isochrone a déjà été enregistré dans l'espace personnel",
    save_success: "Le calcul d'isochrone est enregistré dans l'espace personnel",
    save_failed: "Une erreur est survenue sur l'enregistrement du calcul d'isochrone"
  },
  profil: {
    title: "Profil altimétrique",
    failed_import: "La couche importée ne semble pas être un calcul de profil !",
    save_already: "Le calcul de profil a déjà été enregistré dans l'espace personnel",
    save_success: "Le calcul de profil est enregistré dans l'espace personnel",
    save_failed: "Une erreur est survenue sur l'enregistrement du calcul de profil"
  },
  searchengine: {
    title: "Recherche de couche"
  },
  territories: {
    title: 'Territoires',
    change: "Les territoires ont été modifiés",
    reset: "Tous les territoires ont été réinitialisés",
    remove: (value) => { return `Le territoire ${value} a été supprimé` },
    add: (value) => { return `Le territoire ${value} a été ajouté` }
  },
  ol: {
    title: "OpenLayers",
    failed: (value) => { return `Exception sur OpenLayers : ${value}` },
    failed_format: (value) => { return `Le format n'est pas reconnu : ${value}` },
    failed_source: (value) => { return `Exception sur l'initialisation de la source de type ${value} !` },
    failed_layer: (value) => { return `Exception sur l'initialisation de la couche de type ${value} !` },
    failed_mapbox: (value) => { return `Exception de la couche MapBox : ${value} !` },
    exception_load_layer: "Exception lors du chargement de la couche !",
  },
  notification: {
    title: "Ajout de couche",
    unknown_add_layer: (name, service) => { return `La couche ${name} du service ${service} n'est pas reconnue dans le catalogue !` },
    exception_add_layer: (name, message) => { return `Exception lors de l'ajout de la couche ${name} : ${message}` }
  }
}
