import { 
  type RouteRecordRaw, 
  createRouter, 
  createWebHistory } 
from 'vue-router'

import CartoWrapper from '../views/CartoWrapper.vue'
import Catalogue from '../views/Catalogue.vue'
import Login from '../views/Login.vue'
import Presentation from '../views/Presentation.vue'
import Accueil from '../views/Accueil.vue'

const MAIN_TITLE = 'Carte.gouv'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Carte',
    component: CartoWrapper,
  },
  {
    path: '/accueil',
    name: 'Accueil',
    component: Accueil,
  },
  {
    path: '/catalogue',
    name: 'Catalogue',
    component: Catalogue,
  },
  {
    path: '/login',
    name: 'Se connecter',
    component: Login,
  },
  {
    path: '/presentation-generale',
    name: 'Présentation générale',
    component: Presentation,
  },
  { path: '/tuto', name: 'Commencer sur cartes.gouv.fr' },
  { path: '/a11y-conformite', component: { template: '<div>Conformité RGAA</div>' } },
  { path: '/mentions-legales', component: { template: '<div>Mentions légales</div>' } },
  { path: '/donnees-personnelles', component: { template: '<div>Données personnelles</div>' } },
  { path: '/cookies', component: { template: '<div>cookies</div>' } },
  { path: '/after', component: { template: '<div>after</div>' } },
  { path: '/before', component: { template: '<div>before</div>' } },
  { path: '/_frame', component: { template: '<div>frame</div>' } }
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
