/**
 * Nettoie le localStorage en fonction de la configuration.
 * - Si clearAllItems = true, tout le localStorage est effacé.
 * - Sinon, seules les clefs spécifiées dans items sont vidées.
 * @param {string} namespace - Le préfixe à utiliser pour les clefs du localStorage.
 * @public
 */
export function useClearStorage(namespace: string): void;
