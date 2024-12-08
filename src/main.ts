import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvminint/vue-dsfr/styles'

import '@gouvfr/dsfr/dist/scheme/scheme.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createLogger } from 'vue-logger-plugin'
// plugin local
import { createEulerian } from './plugins/Eulerian'
import { createServices } from './plugins/Services'

import { storePlugin } from 'pinia-plugin-store'

import App from './App.vue'
import router from './router/index'
import * as icons from './icons'
import { customIcons } from './iconscustom'

import './main.css'

addIcons(...Object.values(icons)) // Autoimporté grâce à ohVueIconAutoimportPreset dans vite.config.ts
addIcons(...Object.values(customIcons))

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
var storage = localStorage.getItem('service')
const services = createServices(storage ? JSON.parse(storage).connexion : {})

const eulerian = createEulerian({
  verbose : !isProduction, // option du plugin
  domain: "acwg.cartes.gouv.fr", // OBLIGATOIRE :domaine de tracking Eulerian 
  isActionEnabled: false, // on desactive le tracking global
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

// INFO
// on enregistre les informations de connexion dans le localStorage
const store = storePlugin({
  stores: ['service'],
  storage: localStorage,
})
pinia.use(store)

const app = createApp(App);
app.use(pinia)
app.use(router)
app.use(logger)
app.use(eulerian)
app.use(services)

waitingPrepareApp().then(() => {
  app.mount('#app')
})
