<script setup lang="js">
import { onMounted, onBeforeUnmount } from 'vue'

import { useBaseUrl } from '@/composables/baseUrl'

const siteBaseUrl = useBaseUrl()
const homeUrl = `${siteBaseUrl}/`
const contactUrl = `${siteBaseUrl}/nous-ecrire`

const title = 'Page non trouvée'
const subtitle = 'Erreur 404'
const description = 'La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée.'
const help = `Si vous avez tapé l’adresse web dans le navigateur, vérifiez qu'elle est correcte. La page n’est peut-être plus disponible. Dans ce cas, pour continuer votre visite vous pouvez consulter notre page d’accueil, ou effectuer une recherche avec notre moteur de recherche en haut de page. Sinon contactez-nous pour que l’on puisse vous rediriger vers la bonne information.`
const buttons = [
  {
    label: 'Page d’accueil',
    href: homeUrl,
  },
  {
    label: 'Contactez-nous',
    href: contactUrl,
    secondary: true,
  },
]

const robotsMetaSelector = 'meta[name="robots"]'
let robotsMetaElement = null
let createdRobotsMeta = false
let previousRobotsContent = null

onMounted(() => {
  robotsMetaElement = document.querySelector(robotsMetaSelector)
  if (!robotsMetaElement) {
    robotsMetaElement = document.createElement('meta')
    robotsMetaElement.name = 'robots'
    document.head.appendChild(robotsMetaElement)
    createdRobotsMeta = true
  } else {
    previousRobotsContent = robotsMetaElement.getAttribute('content')
  }

  robotsMetaElement.setAttribute('content', 'noindex')
})

onBeforeUnmount(() => {
  if (!robotsMetaElement) {
    return
  }

  if (createdRobotsMeta) {
    robotsMetaElement.remove()
    return
  }

  if (previousRobotsContent === null) {
    robotsMetaElement.removeAttribute('content')
    return
  }

  robotsMetaElement.setAttribute('content', previousRobotsContent)
})
</script>

<template>
  <div class="not-found-page fr-container fr-my-7w fr-mt-md-12w fr-mb-md-10w">
    <DsfrErrorPage
      :title="title"
      :subtitle="subtitle"
      :description="description"
      :help="help"
      :buttons="buttons"
    />
  </div>
</template>

<style scoped>
.not-found-page {
  max-width: 100%;
  overflow-x: hidden;
}

@media (max-width: 48em) {
  .not-found-page {
    margin-top: 2rem;
    margin-bottom: 2rem;
    padding-inline: 1rem;
  }
}
</style>

