<script lang="js">
/**
 * @description
 * Panneau de partage de carte
 *
 * {@link https://github.com/dnum-mi/vue-dsfr/tree/main/src/components/DsfrButton}
 * {@link https://github.com/dnum-mi/vue-dsfr/tree/main/src/components/DsfrModal}
 * {@link https://github.com/dnum-mi/vue-dsfr/tree/main/src/components/DsfrShare}
 */
export default {
  name: 'Share'
};
</script>

<script lang="js" setup>
import ShareModal from '@/components/carte/control/ShareModal.vue'

const props = defineProps({
  mapId: String,
  visibility: Boolean,
  shareOptions: Object
});

const refModalShare = ref(null)

// paramètres du composant bouton
const btnTitle = "Ouvrir le panneau de partage de carte";
const btnIcon = "fr-icon-link"; // FIXME icone de partage dsfr !?
const btnLabel = "";

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

const onModalShareOpen = () => {
  refModalShare.value.onModalShareOpen()
}
</script>

<template>
  <div id="share-container" ref="target">
    <DsfrButton
      v-if="props.visibility"
      id="share-button-position"
      class="fr-btn fr-btn--md fr-btn fr-btn--secondary inline-flex justify-center share-button-size"
      :label="btnLabel"
      :aria-label="btnTitle"
      :icon="btnIcon"
      icon-only
      no-outline
      @click="onModalShareOpen"
    />
    <ShareModal ref="refModalShare"/>
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
    background-color: var(--background-default-grey);
    overflow: visible;
  }

  #share-button-position[aria-label]:hover::after {
    -webkit-mask-image: unset;
    mask-image: unset;
    background-color: unset;
    flex: unset;
    height: unset;
    -webkit-mask-size: unset;
    mask-size: unset;
    vertical-align: unset;
    content: attr(aria-label);
    position: absolute;
    top: 0;
    color: var(--text-default-grey);
    font-size: .75rem;
    width: fit-content;
    white-space: nowrap;
    padding: .5rem .5rem 0.5rem 1.25rem;
    background-size: .375rem .5rem,.375rem .5rem,1px, 100%,calc(100% - 0.5rem) 100%;
    background-repeat: no-repeat;
    background-position: 0.125rem 50%, 0% 50%,0.375rem 100%,0.375rem 100%;
    filter: drop-shadow(0 2px 6px rgba(0,0,18,.16));
    filter: drop-shadow(var(--overlap-shadow));
    background-image: conic-gradient(from 56.31deg at 0% 50%,transparent 0deg,var(--background-overlap-grey) 0deg,var(--background-overlap-grey) 67.38deg,transparent 67.38deg),conic-gradient(from 56.31deg at 0% 50%,transparent 0deg,var(--border-default-grey) 0deg,var(--border-default-grey) 67.38deg,transparent 67.38deg),linear-gradient(90deg,var(--border-default-grey),var(--border-default-grey)),linear-gradient(90deg,var(--background-overlap-grey),var(--background-overlap-grey));
    transform: translateX(32px);
  }
  .share-button-size {
    width: 40px;
    height: 40px;
  }
  /* positionnement absolu à adapter en fonction du positionnement
  des autres boutons car n'est pas dans la grille */
  @media (max-width: 576px){
    #share-button-position {
      top: 255px;
    }
  }

  @media (max-width: 627px) and (min-width: 576px){
    #share-button-position {
      top: 120px;
    }
  }
</style>
