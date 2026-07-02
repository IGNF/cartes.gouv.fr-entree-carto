import { 
  type RouteLocationNormalized,
  type RouteRecordRaw, 
  createRouter, 
  createWebHistory } 
from 'vue-router'

import { ROUTE_NAMES } from './routeNames'

const MAIN_TITLE = 'cartes.gouv.fr | Explorer les cartes'

// liste des routes disponibles
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: ROUTE_NAMES.MAP,
    component: () => import('../views/Load.vue'), // Lazy loading
  },
  {
    path: '/embed',
    name: ROUTE_NAMES.EMBED,
    component: () => import('../views/Embed.vue'), // Lazy loading
  },
  {
    path: '/login',
    name: ROUTE_NAMES.LOGIN,
    component: () => import('../views/Login.vue'), // Lazy loading
  },
  {
    path: '/logout',
    name: ROUTE_NAMES.LOGOUT,
    component: () => import('../views/Logout.vue'), // Lazy loading
  },
  {
    path: '/bookmarks',
    name: ROUTE_NAMES.BOOKMARKS,
    component: () => import('../views/Bookmarks.vue'), // Lazy loading
  },
  {
    path: '/plan/:slug(.*)*',
    name: ROUTE_NAMES.PLAN,
    component: () => import('../views/Plan.vue'), // Lazy loading
    props: true
  },
  {
    path: '/photo/:slug(.*)*',
    name: 'Photo',
    component: () => import('../views/Photo.vue'), // Lazy loading
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env?.BASE_URL || ''),
  routes,
})

router.beforeEach((to) => {
  // Utilisation de requestIdleCallback pour les tâches non critiques
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => {
      updateTitle(to)
    })
  } else {
    updateTitle(to)
  }
  
  if (to.fullPath === '/accueil') {
    return handleAccueilRedirect(to)
  }
  
  return true
})
function updateTitle(to: RouteLocationNormalized) {
  const specificTitle = to.meta.title ? `${to.meta.title} - ` : ''
  document.title = `${specificTitle}${MAIN_TITLE}`
}

function handleAccueilRedirect(to: RouteLocationNormalized) {
  if (!window.location.href.includes('/accueil')) {
    const resolved = router.resolve(to.fullPath)
    window.open(resolved.href)
    return false
  }
  return true
}

export default router
