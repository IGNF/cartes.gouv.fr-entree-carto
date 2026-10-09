/**
 * @description
 * Ajoute un parametre anti-cache a une URL.
 *
 * @param {string} url
 * @returns {string}
 */
export function useCacheBuster(url) {
  return `${url}${url.includes('?') ? '&' : '?'}_=${Date.now()}`;
};