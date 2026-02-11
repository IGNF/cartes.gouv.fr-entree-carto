import { 
  type RouteRecordRaw, 
  type RouteLocationNormalized,
  createRouter, 
  createWebHistory 
} from 'vue-router'

const MAIN_TITLE = 'Le service public des cartes et données du territoire | cartes.gouv.fr'

// liste des routes disponibles
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Carte',
    component: () => import('../views/Load.vue'), // Lazy loading
  },
  {
    path: '/embed',
    name: 'Carte embarquée',
    component: () => import('../views/Embed.vue'), // Lazy loading
  },
  {
    path: '/login',
    name: 'Se connecter',
    component: () => import('../views/Login.vue'), // Lazy loading
  },
  {
    path: '/logout',
    name: 'Se deconnecter',
    component: () => import('../views/Logout.vue'), // Lazy loading
  },
  {
    path: '/bookmarks',
    name: 'Favoris',
    component: () => import('../views/Bookmarks.vue'), // Lazy loading
  }
  ,
  {
    path: '/data/:slug',
    name: 'Data',
    component: () => import('../views/Data.vue'), // Lazy loading
    props: true
  }
  ,
  {
    path: '/plan/:slug(.*)*',
    name: 'Plan',
    component: () => import('../views/Plan.vue'), // Lazy loading
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
    window.open(to.fullPath)
    return false
  }
  return true
}

export default router
