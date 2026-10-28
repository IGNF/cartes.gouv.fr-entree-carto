import Documents from '@/services/ServiceDocuments';
import ServiceError from '@/services/ServiceError';
import { useServiceStore } from '@/stores/serviceStore';

const DOCUMENTS_DEBUG_STORAGE_KEY = 'service:documents:debug';

class Service {
  #fetch;
  #pending = false;
  #emitter;
  #generation = 0;
  #debug;

  constructor({ fetcher = fetch, emitter = null, api = import.meta.env.IAM_ENTREPOT_API_URL, debug = import.meta.env.IAM_DEBUG === 'true' } = {}) {
    this.api = api;
    this.documents = useServiceStore().documents;
    this.#fetch = fetcher;
    this.#emitter = emitter;
    this.#debug = debug === true;
    this.saveStore();
  }

  getGeneration() {
    return this.#generation;
  }

  resetDocuments() {
    this.#generation += 1;
    const store = useServiceStore();
    store.setDocuments({});
    this.documents = store.documents;
    this.saveStore();
  }

  getFetch() {
    this.#pending = true;
    const generation = this.#generation;
    return async (...args) => {
      const response = await this.#fetch(...args);
      if (generation !== this.#generation) {
        throw new DOMException('Document request cancelled', 'AbortError');
      }
      for (const method of ['json', 'text', 'blob', 'arrayBuffer']) {
        const read = response[method].bind(response);
        response[method] = async () => {
          const data = await read();
          if (generation !== this.#generation) {
            throw new DOMException('Document request cancelled', 'AbortError');
          }
          return data;
        };
      }
      return response;
    };
  }

  setFetch(fetcher) {
    this.#fetch = fetcher;
  }

  saveStore() {
    this.#pending = false;
    try {
      sessionStorage.removeItem(DOCUMENTS_DEBUG_STORAGE_KEY);
      if (this.#debug) {
        sessionStorage.setItem(DOCUMENTS_DEBUG_STORAGE_KEY, JSON.stringify(this.documents));
      }
    } catch {
      return;
    }
  }

  throwError(error) {
    this.#pending = false;
    throw ServiceError.from(error);
  }

  isPending() {
    return this.#pending;
  }

  stopPending() {
    this.#pending = false;
  }

  getEmitter() {
    return this.#emitter;
  }

  setEmitter(emitter) {
    this.#emitter = emitter;
  }
}

Object.assign(Service.prototype, Documents);

export default Service;