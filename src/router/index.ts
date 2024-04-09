import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/AppHome.vue'
import Map from '../views/portailCarto.vue'
import AboutUs from '../views/AboutUs.vue'

const MAIN_TITLE = 'Carte.gouv'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/carte',
    name: 'Carte',
    component: Map,
  },
  {
    path: '/a-propos',
    name: 'About',
    component: AboutUs,
  },
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
  const specificTitle = to.meta.title ? `${to.meta.title} - ` : ''
  document.title = `${specificTitle}${MAIN_TITLE}`
})

export default router
