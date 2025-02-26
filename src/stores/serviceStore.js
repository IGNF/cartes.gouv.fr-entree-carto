import {
  defineStore
} from 'pinia';

import { serviceFactotyCreate } from '@/services/ServiceFactory';

// INFO
// le store est connecté au plugin 'pinia-plugin-store'
// ce qui va enregistrer les properties de la classe Services
// dans le localStorage
export const useServiceStore = defineStore({
  id: 'service',
  state: () => ({
    connexion: {}
  }),
  getters: {
    // ex.
    // service: (state) => state.connexion
  },
  actions: {
    getService () {
      return this.connexion;
    },
    setService (s) {
      this.connexion = serviceFactotyCreate(s);
    }
  }
});