import { 
  type RouteRecordRaw, 
  createRouter, 
  createWebHistory } 
from 'vue-router'

import Carto from '../views/Carto.vue';
import Login from '../views/Login.vue';

const MAIN_TITLE = 'Carte.gouv'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Carte',
    component: Carto,
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
