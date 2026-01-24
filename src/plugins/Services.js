import { inject } from 'vue';

import { serviceFactotyCreate } from '@/services/ServiceFactory';

const IAM_CHECK_SSO = import.meta.env.IAM_CHECK_SSO;
const servicesSymbol = Symbol('vue-services-plugin');

export class PluginServices {
  
  /**
   * constructeur
   * @param {*} options
  */
 constructor(options) {
    console.debug("connexion", options);
    this.instance = serviceFactotyCreate(options);
    this.instance.checkKeycloakSession(IAM_CHECK_SSO)
    .then((session) => {
      if (session) {
        console.warn('✓ Session Keycloak détectée');
      } else {
        console.warn('✗ Pas de session Keycloak');
      }
    })
    .catch((e) => {
      console.error(e);
    })
  }

  /**
   * Installation du plugin
   * @param {*} app 
   */
  install(app) {
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
