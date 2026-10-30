import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvminint/vue-dsfr/styles'
import '@ignf/cartes.gouv.fr-vue-components/dist/index.css'

import '@gouvfr/dsfr/dist/scheme/scheme.min.css'

import 'notivue/notification.css'
import 'notivue/animations.css'

// chargement des CSS de la carte et des extensions
import "ol/ol.css";
import "geopf-extensions-openlayers/css/Dsfr.css";

import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import { createPinia } from 'pinia'
import { createAuth, createAuthFetch, createAuthGuard, useAuth } from 'authentification-vue-oidc'
import { createAuthOptions } from './config/authentification-options.js'
import { createLogger } from 'vue-logger-plugin'
import { createServices } from './plugins/Services.js'
import { createBusEvent } from './plugins/BusEvent.js'
import { createEulerian } from './plugins/Eulerian.js'
import { createMatomo } from './plugins/Matomo.js'

// library notification
import { createNotivue, push } from 'notivue'

import App from './App.vue'
import router from './router/index'

import { registeredIconCollections } from './iconscustom'

registeredIconCollections()

// https://vitejs.dev/guide/env-and-mode.html#node-env-and-modes
const isProduction = (import.meta.env.MODE === "production")

async function waitingPrepareApp() {
  // INFO
  // permet de mocker les appels IAM ou les requetes de l'entrepot
  // cf. ./mocks/handlers
  if (import.meta.env.VITE_HTTP_MOCK_REQUEST === '1') {
    const { worker } = await import('./mocks/browser')
    return worker.start({
      serviceWorker: {
        url: import.meta.env.BASE_URL + '/mockServiceWorker.js',
      },
      onUnhandledRequest(request, print) {
        // Ignore any requests containing in their URL.
        if (['data.geopf.fr', 'acwg.cartes.gouv.fr'].includes(new URL(request.url).hostname)) {
          return
        }
        // Otherwise, print an unhandled request warning.
        print.warning()
      }
    })
  }
  return Promise.resolve()
}

const logger = createLogger({
  enabled: true,
  level: isProduction ? 'error' : 'debug',
  callerInfo: true
})

const pinia = createPinia()

const notivue = createNotivue({
  position: 'bottom-center',
  limit: 3,
  enqueue: true,
  avoidDuplicates: false,
  notifications: {
    global: {
      duration: 2000
    }
  }
})

const bus = createBusEvent();

const eulerian = createEulerian({
  verbose : !isProduction, // option du plugin
  domain: "acwg.cartes.gouv.fr", // OBLIGATOIRE :domaine de tracking Eulerian 
  site: {
    environment: isProduction ? "production" : "development",
    entity: "IGN"
  }
})

const matomo = createMatomo({
  environment: isProduction ? "production" : "development",
  host: "https://matomo.ign.fr",
  siteId: "11"
})

const app = createApp(App);
app.use(createHead())
app.use(pinia)
app.use(logger)
app.use(notivue)
app.use(bus)
app.use(eulerian)
app.use(matomo)

waitingPrepareApp()
.then(async () => {
  const authOptions = createAuthOptions();
  app.use(createAuth(authOptions));

  const services = createServices({ fetcher: createAuthFetch() });
  app.use(services);

  const auth = useAuth();
  auth.on('error', (error) => {
    if (error.code !== 'LOGIN_REQUIRED') {
      push.warning({ title: 'Connexion', message: 'La connexion est indisponible. Vous pouvez reessayer.' });
    }
  });
  router.beforeEach(createAuthGuard());
  app.use(router);
  
  // Ensure initial route is fully resolved before first render.
  await router.isReady();
  app.mount('#app');

})
.catch(() => {
  console.error('Application initialization failed');
});
