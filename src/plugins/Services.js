import { inject } from 'vue';
import Services from '@/services/Services';

const servicesSymbol = Symbol('vue-services-plugin');

export class PluginServices extends Services {
  /**
   * constructeur
   * @param {*} options
   */
  constructor(options) {
    console.debug(options);
    super(options);
  }

  /**
   * Installation du plugin
   * @param {*} app 
   */
  install(app) {
    app.provide(servicesSymbol, this);
    app.config.globalProperties.$services = this;
    app.provide('services', this);
  }
}

export function createServices(options) {
  return new PluginServices(options);
}

export function useServices() {
  const services = inject(servicesSymbol);
  return services;
}
