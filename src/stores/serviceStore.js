import {
  defineStore
} from 'pinia';

import Services from '@/services/Services';

// INFO
// le store est connecté au plugin 'pinia-plugin-store'
// ce qui va enregistrer les properties de la classe Services
// dans le localStorage
export const useServiceStore = defineStore({
  id: 'service',
  state: () => ({
    service: new Services()
  }),
  getters: {
    // ex.
    // service: (state) => state.service
  },
  actions: {
    getService () {
      return this.service;
    },
    setService (s) {
      if (s) {
        this.service = s;
      } else {
        this.service = new Services();
      }
    }
  }
});