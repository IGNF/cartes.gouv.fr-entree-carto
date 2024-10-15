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
import { useDataStore }  from '@/stores/dataStore';
import { useMapStore }  from '@/stores/mapStore';
import { useEulerian } from '@/plugins/Eulerian.js';
import { useClipboard } from '@vueuse/core'

const eulerian = useEulerian();
const dataStore = useDataStore();
const mapStore = useMapStore();

const props = defineProps({
  visibility: Boolean,
  shareOptions: Object
});

// paramètres du composant bouton
const btnTitle = "Ouvrir le panneau de partage de carte";
const btnIcon = "fr-icon-link"; // FIXME icone de partage dsfr !?
const btnLabel = "";

// paramètres du composant de la modale
const title = "Partager une carte";
const size = "lg";

const shareModalOpened = ref(false);

const onModalShareOpen = () => {
  shareModalOpened.value = true;
  eulerian.pause();
};
const onModalShareClose = () => {
  shareModalOpened.value = false;
  eulerian.resume();
};

// les paramètres du composant de partage
const contacts = dataStore.getContacts();
const permalinkEncoded = computed(() => {
  return encodeURI(mapStore.permalink).replaceAll("&", "%26")
})
const mail = computed(() => {
  return  {
    address : contacts.mail,
    subject : "Cartes à consulter sur cartes.gouv.fr",
    body : "Bonjour,%0AJe vous invite à consulter cette carte sur Cartes.gouv.fr :%0A" + `${permalinkEncoded.value}`
  }
});

const shareMail = computed(() => {
  return {
    "to" : `mailto:${mail.value.address}?subject=${mail.value.subject}&body=${mail.value.body}`,
    "label" : "Envoyer un mail"
  };
})
const shareNetworks = computed(() => {
  return [
    {
    "name": "facebook",
    "label": "Partager sur Facebook",
    "url": contacts.networks.facebook + "?display=popup&u=" + mapStore.permalink
    },
    {
      "name": "twitter-x",
      "label": "Partager sur X (anciennement Twitter)",
      "url": contacts.networks.twitter + "?url=" + permalinkEncoded.value + "&text=Ma carte IGN&via=&hashtags=IGNFrance"
    },
    {
      "name": "linkedin",
      "label": "Partager sur LinkedIn",
      "url": contacts.networks.linkedin + "?url=" + mapStore.permalink + "&title=Ma%20carte%20IGN"
    },
    {
      "name": "instagram",
      "label": "Partager sur Instagram",
      "url": contacts.networks.instagram
    }
  ]
});

// creation de l'iframe de partage
const iframe = computed(() => {
 return `<iframe 
    width="600" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
    sandbox="allow-forms allow-scripts allow-same-origin"
    src="${mapStore.permalinkShare}" 
    allowfullscreen>
  </iframe>`;
});
const clipboardSource = ref('')
const { text, copy, copied, isSupported } = useClipboard({ clipboardSource })

const target = ref(null);

const icon = "co-copy"
const defaultScale = ref(0.8325);
const iconProps = computed(() => typeof icon === 'string'
  ? { scale: defaultScale.value, name: icon }
  : { scale: defaultScale.value, ...icon },
);

onMounted(() => {
  nextTick(function () {
    //code here
  })
});

onBeforeMount(() => {
  nextTick(function () {
    //code here
  })
});
</script>

<template>
  <div id="share-container" ref="target">
    <DsfrButton
      v-if="props.visibility"
      id="share-button-position"
      class="fr-btn fr-btn--md inline-flex justify-center share-button-size"
      :label="btnLabel"
      :title="btnTitle"
      :icon="btnIcon"
      icon-only
      no-outline
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
            :mail="shareMail"
            :networks="shareNetworks"
            title="Partages"
          />
        </p>
      </div>
      <div>
        <p>
          <DsfrInput
            v-model="mapStore.permalink"
            label="Lien permanent vers la carte"
            placeholder=""
            label-visible
            readonly
            descriptionId=""
          >
          <template #label>
            Lien permanent vers la carte
            <DsfrButton
            tertiary
            :noOutline="true"
            @click="copy(mapStore.permalink)">
            <VIcon
            v-bind="iconProps"/>  
          </DsfrButton>
          </template>
          </DsfrInput>
        </p>
        <p>
          <DsfrInput
            v-model="iframe"
            placeholder=""
            isTextarea="true"
            label-visible
            readonly
            descriptionId=""
            style="height: 200px;"
          >
          <template #label>
            Copiez le code HTML pour intégrer la carte dans un site
            <DsfrButton
            tertiary
            :noOutline="true"
            @click="copy(iframe)">
            <VIcon
            v-bind="iconProps"/>  
          </DsfrButton>
          </template>
          </DsfrInput>
        </p>
      </div>
    </DsfrModal>
  </div>
</template>

<style>
  .fr-btn--instagram::before {
    -webkit-mask-image: url("../../../../node_modules/@gouvfr/dsfr/dist/icons/logo/instagram-line.svg");
    mask-image: url("../../../../node_modules/@gouvfr/dsfr/dist/icons/logo/instagram-line.svg");
  }
</style>

<style scoped>
  #share-container {}
  #share-button-position {
    position: absolute;
    left: 10px;
    top: 56px;
    z-index: 1000;
  }
  .share-button-size {
    width: 40px;
    height: 40px;
    color: white;
  }
  .share-iframe-input {
    height: 200px;
  }

  /* positionnement absolu à adapter en fonction du positionnement
  des autres boutons car n'est pas dans la grille */
  @media (max-width: 576px){
    #share-button-position {
      top: 60px;
    }
  }

  @media (max-width: 627px) and (min-width: 576px){
    #share-button-position {
      top: 120px;
    }
  }
</style>