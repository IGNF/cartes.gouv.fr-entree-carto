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
 */

class ServiceError {

    /**
     * Crée une instance de ServiceError.
     * @param {Object|String} error - Options de création de l'objet erreur.
     * @param {String} error.message - Message d'erreur à retourner à l'utilisateur.
     * @param {String} [error.type=TYPE_UNKERR] - Type d'erreur
     * @param {Number} [error.status=-1] - Statut de l'erreur : avec TYPE_SRVERR, correspond au [statut HTTP de la réponse du service web sous-jacent]{@link https://en.wikipedia.org/wiki/List_of_HTTP_status_codes}.
     * @param {String} [error.code] - Code fonctionnel optionnel.
     */
    constructor (error) {
        if (!(this instanceof ServiceError)) {
            throw new TypeError("Le constructeur ServiceError ne peut pas être appelé comme une fonction.");
        }

        var e = error;
        if (typeof error === "string" || error instanceof String) {
            this.message = error;
            this.status = -1;
            this.type = ServiceError.TYPE_UNKERR;
        } else {
            this.message = e.message || "indéfini!?";
            this.type = e.type || ServiceError.TYPE_UNKERR;
            this.status = e.status || -1;
            this.code = e.code;
        }

        this.name = "ServiceError";
        this.stack = (new Error()).stack;
    }

    /**
     * Normalise une erreur applicative ou technique en ServiceError.
     * @param {*} error
     * @param {Object} [fallback]
     * @param {String} [fallback.type]
     * @param {String} [fallback.message]
     * @param {String} [fallback.code]
     * @returns {ServiceError}
     */
    static from (error, fallback) {
        if (error instanceof ServiceError) {
            return error;
        }

        var options = fallback || {};
        var message = options.message || "Erreur inconnue";
        var type = options.type || ServiceError.TYPE_UNKERR;
        var status = -1;
        var code = options.code;

        if (typeof error === "string" || error instanceof String) {
            message = String(error);
        } else if (error) {
            message = error.message || message;
            if (typeof error.status === "number") {
                status = error.status;
            }
            if (error.type) {
                type = error.type;
            }
            if (error.code) {
                code = error.code;
            }
        }

        // Certaines erreurs encapsulent le statut HTTP dans cause.status.
        var causeStatus = error?.cause?.status;
        if (typeof causeStatus === "number") {
            status = causeStatus;
        }

        // Classification auto si le type n'est pas explicitement donné.
        if (type === ServiceError.TYPE_UNKERR) {
            if (status === 401 || status === 403) {
                type = ServiceError.TYPE_AUTHERR;
            } else if (status === 400 || status === 422) {
                type = ServiceError.TYPE_USEERR;
            } else if (status === 404 || status === 409 || status === 412) {
                type = ServiceError.TYPE_SYNCERR;
            } else if (status === 429) {
                type = ServiceError.TYPE_RATEERR;
            } else if (status >= 500) {
                type = ServiceError.TYPE_SRVERR;
            }
        }

        // Classification réseau/browser
        if (error?.name === "AbortError") {
            type = ServiceError.TYPE_TIMEOUT;
        }
        if (error instanceof TypeError && String(error.message || "").toLowerCase().includes("fetch")) {
            type = ServiceError.TYPE_NETERR;
        }

        var serviceError = new ServiceError({
            message,
            type,
            status,
            code
        });

        if (error) {
            serviceError.cause = error;
        }

        return serviceError;
    }

}

/**
 * Erreur levée lorsque le service sous-jacent répond en erreur.
 *
 * @type {String}
 * @constant
 * @static
 */
ServiceError.TYPE_SRVERR = "SERVICE_ERROR";

/**
 * Erreur levée lorsque l'API ne peut pas traiter la demande 
 * en raison d'une erreur d'usage (ex: paramètre manquant).
 *
 * @type {String}
 * @constant
 * @static
 */
ServiceError.TYPE_USEERR = "USAGE_ERROR";

/**
 * Erreur levée lorsque l'API ne peut pas traiter la demande 
 * en raison d'une erreur d'authentification (ex: token invalide).
 *
 * @type {String}
 * @constant
 * @static
 */
ServiceError.TYPE_AUTHERR = "AUTHENTICATION_ERROR";

/**
 * Erreur levée lorsqu'une opération n'est plus cohérente avec l'état distant
 * (ex: document supprimé sur une autre instance).
 *
 * @type {String}
 * @constant
 * @static
 */
ServiceError.TYPE_SYNCERR = "SYNCHRONIZATION_ERROR";

/**
 * Erreur levée sur incident réseau (DNS, coupure, CORS, offline, ...).
 *
 * @type {String}
 * @constant
 * @static
 */
ServiceError.TYPE_NETERR = "NETWORK_ERROR";

/**
 * Erreur levée sur timeout/abandon de requête.
 *
 * @type {String}
 * @constant
 * @static
 */
ServiceError.TYPE_TIMEOUT = "TIMEOUT_ERROR";

/**
 * Erreur levée en cas de dépassement de limite (HTTP 429).
 *
 * @type {String}
 * @constant
 * @static
 */
ServiceError.TYPE_RATEERR = "RATE_LIMIT_ERROR";

/**
 * Erreur levée lorsque l'API ne peut pas traiter la demande pour une raison
 * autre que les deux cas précédents.
 *
 * @type {String}
 * @constant
 * @static
 */
ServiceError.TYPE_UNKERR = "UNKNOWN_ERROR";

export default ServiceError;
