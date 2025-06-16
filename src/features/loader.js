let loadCount = 0;
const fallbackTimeouts = new Set();
const fallbackDelay = 5000; // délai maximum pour un "loadend" naturel

export const mapLoader = (map) => {
  function startLoading() {
    const target = map.getTargetElement();
    if (loadCount === 0) {
      target.classList.add('spinner');
    }
  
    loadCount++;
  
    // Démarre un fallback timeout au cas où `loadend` ne survient pas
    const timeoutId = setTimeout(() => {
      console.warn('Fallback loadend déclenché');
      endLoading();
      fallbackTimeouts.delete(timeoutId);
    }, fallbackDelay);
  
    fallbackTimeouts.add(timeoutId);
  }
  
  function endLoading() {
    const target = map.getTargetElement();
  
    loadCount = Math.max(0, loadCount - 1);
    if (loadCount === 0) {
      target.classList.remove('spinner');
    }
  }
  
  map.on('loadstart', startLoading);
  map.on('loadend', () => {
    // Lors d’un vrai loadend, on supprime un timeout s’il en reste
    const timeoutId = fallbackTimeouts.values().next().value;
    if (timeoutId) {
      clearTimeout(timeoutId);
      fallbackTimeouts.delete(timeoutId);
    }
  
    endLoading();
  });
};
