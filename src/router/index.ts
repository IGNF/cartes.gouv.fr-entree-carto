import { 
  type RouteRecordRaw, 
  createRouter, 
  createWebHistory } 
from 'vue-router'

import Load from '../views/Load.vue'
import Embed from '../views/Embed.vue'
import Login from '../views/Login.vue'
import Logout from '../views/Logout.vue'
import Bookmarks from '../views/Bookmarks.vue'

const MAIN_TITLE = 'Le service public des cartes et données du territoire | cartes.gouv.fr'

// liste des routes disponibles
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Carte',
    component: Load,
  },
  {
    path: '/embed',
    name: 'Carte embarquée',
    component: Embed,
  },
  {
    path: '/login',
    name: 'Se connecter',
    component: Login
  },
  {
    path: '/logout',
    name: 'Se deconnecter',
    component: Logout
  },
  {
    path: '/bookmarks',
    name: 'Favoris',
    component: Bookmarks
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
