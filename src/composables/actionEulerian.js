/**
 * @description
 * Ajout les attributs Eulerian sur l'element HTML
 * 
 * @example
 * <button id="..." 
 *    class="..." 
 *    title="Calculer une isochrone" 
 *    tabindex="0" 
 *    aria-pressed="false" 
 *    type="button" 
 *    data-fr-analytics-action="Calculer une isochrone" 
 *    data-fr-js-button-actionee="true">
 * </button>
 */
export function useActionButtonEulerian(element) {
  element.setAttribute("data-fr-analytics-action", element.title);
  element.setAttribute("data-fr-js-button-actionee", true);
};