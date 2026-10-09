<script setup lang="js">
import { useHead } from '@unhead/vue'

import { useBaseUrl } from '@/composables/baseUrl'

useHead({
  meta: [{
    name: 'robots',
    content: 'noindex',
  }],
})

const siteBaseUrl = useBaseUrl();

function navigateTo(url) {
  window.location.assign(url)
}

const title = 'Page non trouvée'
const subtitle = 'Erreur 404'
const description = 'La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée.'
const help = `Si vous avez tapé l’adresse web dans le navigateur, vérifiez qu'elle est correcte. La page n’est peut-être plus disponible. Dans ce cas, pour continuer votre visite vous pouvez consulter notre page d’accueil, ou effectuer une recherche avec notre moteur de recherche en haut de page. Sinon contactez-nous pour que l’on puisse vous rediriger vers la bonne information.`
const buttons = [
  {
    label: 'Page d’accueil',
    onClick: () => navigateTo(siteBaseUrl),
  },
  {
    label: 'Contactez-nous',
    onClick: () => navigateTo(siteBaseUrl + '/nous-ecrire'),
    secondary: true,
  },
]
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

<style scoped lang="scss">
@use "@/assets/variables" as *;

@include max(md) {

  .not-found-page :deep(.fr-container.flex) {
    flex-direction: column;
  }

  .not-found-page :deep(.half) {
    width: 100%;
    max-width: 100%;
    min-width: 0;
  }

  .not-found-page :deep(.error-img) {
    max-width: 100%;
    height: auto;
  }
}
</style>

