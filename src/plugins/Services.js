import { inject } from 'vue';

import { serviceFactotyCreate } from '@/services/ServiceFactory';

const IAM_CHECK_SSO_DISABLE = import.meta.env.IAM_CHECK_SSO_DISABLE;;
const IAM_CHECK_SSO_TYPE = import.meta.env.IAM_CHECK_SSO_TYPE;

const servicesSymbol = Symbol('vue-services-plugin');

export class PluginServices {
  
  /**
   * constructeur
   * @param {*} options
  */
  constructor(options) {
    console.debug("connexion", options);
    this.instance = serviceFactotyCreate(options);
    if (IAM_CHECK_SSO_DISABLE !== '1') {
      this.instance.checkKeycloakSession(IAM_CHECK_SSO_TYPE)
      .then((session) => {
        if (session) {
          console.warn('✓ 🔑 Session Keycloak détectée');
        } else {
          console.warn('✗ 🔓 Pas de session Keycloak');
        }
      })
      .catch((e) => {
        console.error(e);
      })
    }
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
