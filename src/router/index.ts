import { 
  type RouteRecordRaw, 
  createRouter, 
  createWebHistory } 
from 'vue-router'

import AsyncStorageInit from '../views/AsyncStorageInit.vue'
import Catalogue from '../views/Catalogue.vue'
import Login from '../views/Login.vue'
import Presentation from '../views/Presentation.vue'
import Accueil from '../views/Accueil.vue'

const MAIN_TITLE = 'Le service public des cartes et données du territoire | cartes.gouv.fr'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Carte',
    component: AsyncStorageInit,
  },
  {
    path: '/login',
    name: 'Se connecter',
    component: Login,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env?.BASE_URL || ''),
  routes,
})

router.beforeEach((to) => { // Cf. https://github.com/vueuse/head pour des transformations avancées de Head
  if (to.fullPath === '/accueil' && !window.location.href.includes('/accueil')) {
    window.open(to.href)
    return false
  }
  const specificTitle = to.meta.title ? `${to.meta.title} - ` : ''
  document.title = `${specificTitle}${MAIN_TITLE}`
})

export default router
