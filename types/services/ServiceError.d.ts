export default ServiceError;
/**
 * Erreurs levées par l'API pour les raisons suivantes :
 * - erreur du service sous-jacent (HTTP)
 * - erreur d'usage (ex: paramètre manquant)
 * - erreur sur l'authentification (ex: token invalide)
 * - erreur de synchronisation des documents (ex: document supprimé ailleurs)
 * - erreur réseau / timeout
 * - raison inconnue
 */
export type ServiceError = {
    /**
     * - Message d'erreur
     */
    message: string;
    /**
     * - Statut HTTP éventuel, -1 sinon.
     */
    status: number;
    /**
     * - Type d'erreur (TYPE_SRVERR, TYPE_USEERR, TYPE_AUTHERR, TYPE_SYNCERR, TYPE_NETERR, TYPE_TIMEOUT ou TYPE_UNKERR).
     */
    type: string;
    /**
     * - Code fonctionnel optionnel (ex: DOC_DELETED_REMOTELY)
     */
    code?: string | undefined;
};
/**
 * Erreurs levées par l'API pour les raisons suivantes :
 * - erreur du service sous-jacent (HTTP)
 * - erreur d'usage (ex: paramètre manquant)
 * - erreur sur l'authentification (ex: token invalide)
 * - erreur de synchronisation des documents (ex: document supprimé ailleurs)
 * - erreur réseau / timeout
 * - raison inconnue
 *
 * @typedef {Object} ServiceError
 * @property {String} message - Message d'erreur
 * @property {Number} status - Statut HTTP éventuel, -1 sinon.
 * @property {String} type - Type d'erreur (TYPE_SRVERR, TYPE_USEERR, TYPE_AUTHERR, TYPE_SYNCERR, TYPE_NETERR, TYPE_TIMEOUT ou TYPE_UNKERR).
 * @property {String} [code] - Code fonctionnel optionnel (ex: DOC_DELETED_REMOTELY)
 *
 * @example
 * // Création d'une erreur de service
 * const error = new ServiceError({
 *   message: "Le service est indisponible",
 *   status: 503,
 *   type: ServiceError.TYPE_SRVERR
 * });
 *
 * // Création d'une erreur de synchronisation
 * const syncError = new ServiceError({
 *   message: "Le document n'existe plus sur le serveur.",
 *   status: 404,
 *   type: ServiceError.TYPE_SYNCERR,
 *   code: "DOC_DELETED_REMOTELY"
 * });
 *
 * {
 *   "message": "Le document (2afd1652-d22b-499e-88d0-384bfd09130d) n'existe plus sur le serveur.",
 *   "type": "SYNCHRONIZATION_ERROR",
 *   "status": 404,
 *   "code": "DOC_DELETED_REMOTELY",
 *   "name": "ServiceError",
 *   "stack": "...",
 *   "cause": {
 *     "name": "Error",
 *     "message": "Le document (2afd1652-d22b-499e-88d0-384bfd09130d) n'existe plus sur le serveur.",
 *     "status": 404,
 *     "code": "DOC_DELETED_REMOTELY"
 *   }
 * }
 */
declare class ServiceError {
    /**
     * Convertit une cause en objet sérialisable.
     * @param {*} cause
     * @returns {*}
     */
    static serializeCause(cause: any): any;
    /**
     * Normalise une erreur applicative ou technique en ServiceError.
     * @param {*} error
     * @param {Object} [fallback]
     * @param {String} [fallback.type]
     * @param {String} [fallback.message]
     * @param {String} [fallback.code]
     * @returns {ServiceError}
     */
    static from(error: any, fallback?: {
        type?: string | undefined;
        message?: string | undefined;
        code?: string | undefined;
    }): ServiceError;
    /**
     * Crée une instance de ServiceError.
     * @param {Object|String} error - Options de création de l'objet erreur.
     * @param {String} error.message - Message d'erreur à retourner à l'utilisateur.
     * @param {String} [error.type=TYPE_UNKERR] - Type d'erreur
     * @param {Number} [error.status=-1] - Statut de l'erreur : avec TYPE_SRVERR, correspond au [statut HTTP de la réponse du service web sous-jacent]{@link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes}.
     * @param {String} [error.code] - Code fonctionnel optionnel.
     */
    constructor(error: Object | string);
    message: any;
    status: any;
    type: any;
    code: any;
    name: string;
    stack: string | undefined;
    /**
     * Rend l'erreur sérialisable en JSON.
     * @returns {Object}
     */
    toJSON(): Object;
}
declare namespace ServiceError {
    let TYPE_SRVERR: string;
    let TYPE_USEERR: string;
    let TYPE_AUTHERR: string;
    let TYPE_SYNCERR: string;
    let TYPE_NETERR: string;
    let TYPE_TIMEOUT: string;
    let TYPE_RATEERR: string;
    let TYPE_UNKERR: string;
}
