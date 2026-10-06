<script setup lang="js">
import { onMounted, onBeforeUnmount } from 'vue'

import { useBaseUrl } from '@/composables/baseUrl'

import ovoidSvgUrl from '@gouvfr/dsfr/dist/artwork/background/ovoid.svg?url'
import technicalErrorSvgUrl from '@gouvfr/dsfr/dist/artwork/pictograms/system/technical-error.svg?url'

const siteBaseUrl = useBaseUrl()
const homeUrl = `${siteBaseUrl}/`
const contactUrl = `${siteBaseUrl}/nous-ecrire`

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
  <main class="fr-container">
    <div class="fr-my-7w fr-mt-md-12w fr-mb-md-10w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
      <div class="fr-py-0 fr-col-12 fr-col-md-6">
        <h1>Page non trouvée</h1>

        <p class="fr-text--sm fr-mb-3w">Erreur 404</p>

        <p class="fr-text--lead fr-mb-3w">La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée.</p>

        <p class="fr-text--sm fr-mb-5w">
          Si vous avez tapé l’adresse web dans le navigateur, vérifiez qu'elle est correcte. La page n’est peut-être plus
          disponible.
          <br>Dans ce cas, pour continuer votre visite vous pouvez consulter notre page d’accueil, ou effectuer une
          recherche avec notre moteur de recherche en haut de page. <br>Sinon contactez-nous pour que l’on puisse vous
          rediriger vers la bonne information.
        </p>

        <ul class="fr-btns-group fr-btns-group--inline-md">
          <li>
            <a
              class="fr-btn"
              :href="homeUrl"
            >
              Page d’accueil
            </a>
          </li>
          <li>
            <a
              class="fr-btn fr-btn--secondary"
              :href="contactUrl"
            >
              Contactez-nous
            </a>
          </li>
        </ul>
      </div>

      <div class="fr-col-12 fr-col-md-3 fr-col-offset-md-1 fr-px-6w fr-px-md-0 fr-py-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="fr-responsive-img fr-artwork"
          aria-hidden="true"
          width="160"
          height="200"
          viewBox="0 0 160 200"
        >
          <use
            class="fr-artwork-motif"
            :href="`${ovoidSvgUrl}#artwork-motif`"
          />
          <use
            class="fr-artwork-background"
            :href="`${ovoidSvgUrl}#artwork-background`"
          />
          <g transform="translate(40, 60)">
            <use
              class="fr-artwork-decorative"
              :href="`${technicalErrorSvgUrl}#artwork-decorative`"
            />
            <use
              class="fr-artwork-minor"
              :href="`${technicalErrorSvgUrl}#artwork-minor`"
            />
            <use
              class="fr-artwork-major"
              :href="`${technicalErrorSvgUrl}#artwork-major`"
            />
          </g>
        </svg>
      </div>
    </div>
  </main>
</template>