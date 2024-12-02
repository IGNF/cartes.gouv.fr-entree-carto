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

import App from './App.vue'
import router from './router/index'
import * as icons from './icons'
import { customIcons } from './iconscustom'

import './main.css'

addIcons(...Object.values(icons)) // Autoimporté grâce à ohVueIconAutoimportPreset dans vite.config.ts
addIcons(...Object.values(customIcons))

// https://vitejs.dev/guide/env-and-mode.html#node-env-and-modes
const isProduction = (import.meta.env.MODE === "production")

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

createApp(App)
  .use(pinia)
  .use(router)
  .use(logger)
  .use(eulerian)
  .mount('#app')
