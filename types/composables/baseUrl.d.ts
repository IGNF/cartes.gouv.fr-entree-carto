/**
 * @description
 * Ajout de la base URL pour les liens externes de l'entête et du pied de page
 * vers le projet 'cartes.gouv.fr'
 * (Ceci est en fonction de l'environnement de build / deploiement)
 *
 * @returns URL
 * @see env
 * @example
 * // en developpement, http://localhost:[port]
 * // en production, https://cartes.gouv.fr
 */
export function useBaseUrl(): any;
