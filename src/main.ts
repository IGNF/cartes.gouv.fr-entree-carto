import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvminint/vue-dsfr/styles'

import '@gouvfr/dsfr/dist/scheme/scheme.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons.min.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router/index'
import * as icons from './icons'

import './main.css'

addIcons(...Object.values(icons)) // Autoimporté grâce à ohVueIconAutoimportPreset dans vite.config.ts

createApp(App)
  .use(router)
  .mount('#app')
