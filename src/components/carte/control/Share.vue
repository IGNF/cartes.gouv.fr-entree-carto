<script lang="js">
/**
 * @description
 * Panneau de partage de carte
 * 
 * {@link https://github.com/dnum-mi/vue-dsfr/tree/main/src/components/DsfrButton}
 * {@link https://github.com/dnum-mi/vue-dsfr/tree/main/src/components/DsfrModal}
 * {@link https://github.com/dnum-mi/vue-dsfr/tree/main/src/components/DsfrShare}
 */
export default {};
</script>

<script lang="js" setup>
import { RiShareLine } from "oh-vue-icons/icons";

import { useMapStore }  from '@/stores/mapStore';
const mapStore = useMapStore();

const props = defineProps({
  visibility: Boolean,
  shareOptions: Object
});

// paramètres du composant bouton
const btnTitle = "Ouvrir le panneau de partage de carte";
const btnIcon = "fr-icon-share-fill"; // FIXME icone de partage dsfr !?
const btnLabel = "";

// paramètres du composant de la modale
const title = "Partager une carte";
const size = "lg";

const shareModalOpened = ref(false);

const onModalShareOpen = () => {
  shareModalOpened.value = true;
}

const onModalShareClose = () => {
  shareModalOpened.value = false;
}

// les paramètres du composant de partage
// TODO finir de les remplir 

const mail = {
  "to": "mailto:user@example.com?subject=Sujet&body=Corps du courriel",
  "label": "Envoyer un mail"
};

const networks = [
  {
    "name": "facebook",
    "label": "Partager sur Facebook",
    "url": "https://www.facebook.com/sharer.php?u=[À MODIFIER - url de la page]"
  },
  {
    "name": "twitter-x",
    "label": "Partager sur X (anciennement Twitter)",
    "url": "https://twitter.com/intent/tweet?url=[À MODIFIER - url de la page]&text=[À MODIFIER - titre ou texte descriptif de la page]&via=[À MODIFIER - via]&hashtags=[À MODIFIER - hashtags]"
  },
  {
    "name": "linkedin",
    "label": "Partager sur LinkedIn",
    "url": "https://www.linkedin.com/shareArticle?url=[À MODIFIER - url de la page]&title=[À MODIFIER - titre ou texte descriptif de la page]"
  }
];

const iframe = computed(() => {
 return `<iframe 
    width="600" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
    sandbox="allow-forms allow-scripts allow-same-origin"
    src="${mapStore.permalinkShare}" 
    allowfullscreen>
  </iframe>`;
});

</script>

<template>
  <DsfrButton
    v-if="props.visibility"
    :label="btnLabel"
    :title="btnTitle"
    :icon="RiShareLine"
    icon-only
    no-outline
    style="width: 40px;height: 40px;"
    @click="onModalShareOpen"
  />
  <DsfrModal 
    :opened="shareModalOpened" 
    :title="title"
    :size="size" 
    @close="onModalShareClose">
    <!-- slot : c'est ici que l'on customise le contenu ! -->
    <div>
      <p>
        <DsfrShare
          copyLabel="Copier dans le presse-papier"
          :mail="mail"
          :networks="networks"
          title="Partages"
        />
      </p>
    </div>
    <div>
      <DsfrInput
        v-model="mapStore.permalink"
        label="Lien permanent vers la carte"
        placeholder=""
        label-visible
        readonly
        descriptionId=""
      />
      <DsfrInput
        v-model="iframe"
        label="Copiez le code HTML pour intégrer la carte dans un site"
        placeholder=""
        isTextarea="true"
        label-visible
        readonly
        descriptionId=""
        style="height: 200px;"
      />
    </div>
  </DsfrModal>
</template>

<!-- TODO 
    comment faire passer l'attribut className ?
    comment positionner le bouton sur la carte ? 
-->
<style>
  .shareButton {
    width: 40px;
    height: 40px;
  }
  .shareIframeInput {
    height: 200px;
  }
</style>