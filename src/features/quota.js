/**
 * Gestion des erreurs / notifications sur le quota utilisateur.
 */

import { useServiceStore } from '@/stores/serviceStore';

// lib notification
import { push } from 'notivue';
import t from '@/features/translation';

/**
 * Détermine si une notification doit être affichée 
 * pour une erreur de quota.
 * 
 * @param {*} e - Erreur rencontrée.
 * @returns {boolean} - Indique si une notification doit être affichée.
 */
const isQuotaError = (e) => {
  var desc = e.error_description || e.data?.error_description;
  var type = e.error || e.data?.error;
  // error_description peut être une chaîne ou un tableau de messages
  var text = Array.isArray(desc) ? desc.join(" ") : desc;
  // message sur le quota des documents
  if (type === "Conflict" || text.includes("Quota")) {
    return true;
  }
  return false; // Par défaut, pas de notifications !
};

/**
 * Affiche une notification si l'erreur est liée au quota.
 * Le format de l'objet Error : 
 * {
 *   cause: {
 *     error_description: string | string[],
 *     message: string
 *   }
 * }
 * 
 * @param {Error} error - Erreur à afficher.
 */
export const notifyQuotaError = (error) => {
  var store = useServiceStore();
  if (!store.isAuthentificated) {
    return; // stoppe l'exécution si l'utilisateur n'est pas authentifié
  }

  console.error("Quota error info:", error);

  var e = error.cause;
  // on est sur une exception du service
  if (isQuotaError(e)) {
    var description = e.error_description || e.data?.error_description;
    var message = t.generic.quota_exceeded(Array.isArray(description) ? description.join(" ") : description);
    push.error({
      title: t.generic.error,
      message: message
    });
  }
};

/**
 * Affiche une notification si l'utilisateur approche du quota de documents.
 */
export const notifyQuotaWarning = () => {
  var store = useServiceStore();
  if (!store.isAuthentificated) {
    return; // stoppe l'exécution si l'utilisateur n'est pas authentifié
  }

  var service = store.getService();
  var sizeInfo = service.getUserSize();
  if (sizeInfo && sizeInfo.alert) {
    push.warning({
      title: t.generic.error,
      message: t.generic.quota_warning
    });
  }
};