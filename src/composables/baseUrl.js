export function useBaseUrl() {
  return import.meta.env.VITE_GPF_BASE_URL_EXTERNAL || location.origin;
};
