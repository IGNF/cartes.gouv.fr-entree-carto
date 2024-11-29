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

import './main.css'

addIcons(...Object.values(icons)) // Autoimporté grâce à ohVueIconAutoimportPreset dans vite.config.ts
addIcons({
  name: "catalogIcon",
  width: 24,
  height: 24,
  raw: "<path d='M13 21V23H11V21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H9C10.1947 3 11.2671 3.52375 12 4.35418C12.7329 3.52375 13.8053 3 15 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H13ZM20 19V5H15C13.8954 5 13 5.89543 13 7V19H20ZM11 19V7C11 5.89543 10.1046 5 9 5H4V19H11Z'/>"
})
addIcons({
  name: "menuWidgetIcon",
  width: 24,
  height: 24,
  raw: "<path d='M5.32894 3.27158C6.56203 2.8332 7.99181 3.10749 8.97878 4.09446C10.0997 5.21537 10.3014 6.90741 9.58381 8.23384L20.2925 18.9437L18.8783 20.358L8.16933 9.64875C6.84276 10.3669 5.1502 10.1654 4.02903 9.04421C3.04178 8.05696 2.76761 6.62665 3.20652 5.39332L5.44324 7.63C6.02903 8.21578 6.97878 8.21578 7.56456 7.63C8.15035 7.04421 8.15035 6.09446 7.56456 5.50868L5.32894 3.27158ZM15.6963 5.15512L18.8783 3.38735L20.2925 4.80157L18.5247 7.98355L16.7569 8.3371L14.6356 10.4585L13.2214 9.04421L15.3427 6.92289L15.6963 5.15512ZM8.97878 13.2869L10.393 14.7011L5.08969 20.0044C4.69917 20.3949 4.066 20.3949 3.67548 20.0044C3.31285 19.6418 3.28695 19.0699 3.59777 18.6774L3.67548 18.5902L8.97878 13.2869Z'/>"
})

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
