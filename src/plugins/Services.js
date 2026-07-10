import { inject } from 'vue';

import { serviceFactotyCreate } from '@/services/ServiceFactory';

const servicesSymbol = Symbol('vue-services-plugin');

export class PluginServices {
  
  /**
   * constructeur
   * @param {*} options
  */
  constructor(options) {
    console.debug("connexion", options);
    this.instance = serviceFactotyCreate(options);
  }

  /**
   * Installation du plugin
   * @param {*} app 
   */
  install(app) {
    if (typeof this.instance.setEmitter === 'function') {
      this.instance.setEmitter(app.config.globalProperties.$emitter || null);
    }
    app.provide(servicesSymbol, this);
    app.config.globalProperties.$services = this;
    app.provide('services', this.instance);
  }
}

export function createServices(options) {
  return new PluginServices(options);
}

export function useServices() {
  const services = inject(servicesSymbol);
  return services;
}
