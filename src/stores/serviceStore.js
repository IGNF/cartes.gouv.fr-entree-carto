import {
  defineStore
} from 'pinia';

import Service from '@/services/serviceConnection';

export const useServiceStore = defineStore('service', () => {
  
  /////////////
  // objet service
  /////////////
  const service = ref(new Service());

  //////////////////
  // getter/setter
  //////////////////

  function getService () {
    return service.value;
  }
  function setService (s) {
    service.value = s;
  }

  return {
    getService,
    setService
  };
});