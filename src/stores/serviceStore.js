import {
  defineStore
} from 'pinia';

export const useServiceStore = defineStore({
  id: 'service',
  state: () => ({
    documents: {},
    authentificated : false
  }),
  getters: {
    isAuthentificated : (state) => state.authentificated
  },
  actions: {
    setDocuments (documents) {
      this.documents = documents;
    },
    setAuthentificated (b) {
      const value = Boolean(b);
      this.authentificated = value;
    },
    getAuthentificated () {
      return this.authentificated;
    }
  }
});