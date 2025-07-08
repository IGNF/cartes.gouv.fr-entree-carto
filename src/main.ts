import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvminint/vue-dsfr/styles'

import '@gouvfr/dsfr/dist/scheme/scheme.min.css'

import 'notivue/notification.css'
import 'notivue/animations.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createLogger } from 'vue-logger-plugin'
// plugin local
import { createEulerian } from './plugins/Eulerian'
import { createServices } from './plugins/Services'
import { createBusEvent } from './plugins/BusEvent'

// library notificaiton
import { createNotivue } from 'notivue'

import { storePlugin } from 'pinia-plugin-store'

import App from './App.vue'
import router from './router/index'

import './main.css'

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
        if (request.url.includes('data.geopf.fr') ||
            request.url.includes('acwg.cartes.gouv.fr')
        ) {
          return
        }
        // Otherwise, print an unhandled request warning.
        print.warning()
      }
    })
  }
  return Promise.resolve()
}

// INFO
// on recupere les info de connexion de la session, et les transmettre !
const storage = sessionStorage.getItem('service')
const services = createServices(storage ? JSON.parse(storage).connexion : {})

const eulerian = createEulerian({
  verbose : !isProduction, // option du plugin
  domain: "acwg.cartes.gouv.fr", // OBLIGATOIRE :domaine de tracking Eulerian 
  isActionEnabled: "reduce", // on limite le tracking uniquement sur les elements "data-fr-analytics-action"
  site: {
    environment: isProduction ? "production" : "development",
    entity: "IGN"
  }
})

const logger = createLogger({
  enabled: true,
  level: isProduction ? 'error' : 'debug',
  callerInfo: true
})

const pinia = createPinia()

const notivue = createNotivue({
  position: 'bottom-center',
  limit: 10,
  enqueue: true,
  avoidDuplicates: false,
  notifications: {
    global: {
      duration: 3000
    }
  }
})

const bus = createBusEvent();

// INFO
// on enregistre les informations de connexion dans le sessionStorage
const store = storePlugin({
  stores: ['service'],
  storage: sessionStorage,
})
pinia.use(store)

const app = createApp(App);
app.use(pinia)
app.use(router)
app.use(logger)
app.use(eulerian)
app.use(services)
app.use(notivue)
app.use(bus)

waitingPrepareApp().then(() => {
  app.mount('#app')
})
