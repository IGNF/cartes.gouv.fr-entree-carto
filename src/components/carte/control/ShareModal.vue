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
import TextCopyToClipboard from '@/components/utils/TextCopyToClipboard.vue'

const eulerian = useEulerian();
const dataStore = useDataStore();
const mapStore = useMapStore();

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

const target = ref(null);

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

defineExpose({
  onModalShareOpen,
  onModalShareClose
})
</script>

<template>
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
            <TextCopyToClipboard
              :copiedText="mapStore.permalink"
              label="Lien permanent"
              description="Toute personne ayant ce lien peut visualiser votre carte sans avoir à se créer de compte."
            />
          </template>
          </DsfrInput>
        </p>
        <p>
          <DsfrInput
            v-model="iframe"
            placeholder=""
            isTextarea
            label-visible
            readonly
            descriptionId=""
            style="height: 200px;"
          >
          <template #label>
            <TextCopyToClipboard
              :copiedText="iframe"
              label="Iframe"
              description="Insérer directement dans vos mails,  Réseaux sociaux ..."
            />
          </template>
          </DsfrInput>
        </p>
      </div>
    </DsfrModal>
</template>

<style>
  .fr-btn--instagram::before {
    -webkit-mask-image: url("../../../../node_modules/@gouvfr/dsfr/dist/icons/logo/instagram-line.svg");
    mask-image: url("../../../../node_modules/@gouvfr/dsfr/dist/icons/logo/instagram-line.svg");
  }
</style>

<style scoped>
  
  .share-iframe-input {
    height: 200px;
  }

</style>
