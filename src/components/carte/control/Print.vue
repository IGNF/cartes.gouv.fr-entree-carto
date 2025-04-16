<script lang="js">
/**
 * @description
 * Panneau de partage de carte
 *
 * {@link https://github.com/dnum-mi/vue-dsfr/tree/main/src/components/DsfrButton}
 * {@link https://github.com/dnum-mi/vue-dsfr/tree/main/src/components/DsfrModal}
 */
export default {};
</script>

<script lang="js" setup>
import PrintModal from './PrintModal.vue';
const props = defineProps({
  mapId: String,
  visibility: Boolean,
  printOptions: Object
});

const printModal = ref(null)
const modal = ref(null)

function onModalPrintOpen() {
  printModal.value.onModalPrintOpen()
}

onUpdated(() => {
  /* hack pour surcharger le style modal dsfr */
    let modalDOM = modal.value.getElementsByClassName("fr-container")[0]
    if (modalDOM) {
      modalDOM.classList.add("modal-override");
      modalDOM.classList.remove("fr-container-md", "fr-container");
    }
});
</script>

<template>
  <div
    id="print-container"
    ref="modal"
  >
    <DsfrButton
      v-if="props.visibility"
      id="print-button-position"
      class="fr-btn fr-btn--md fr-btn fr-btn--secondary inline-flex justify-center print-button-size"
      title="Ouvrir le panneau d'impression carte"
      icon="px-print"
      icon-only
      no-outline
      @click="onModalPrintOpen"
    />
    <printModal
      ref="printModal"
      :print-options="printOptions"
    />
  </div>
</template>
<style>
canvas.fixedoverlay {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 0;
    width: 100%;
    height: 100%;
}
</style>
<style scoped>
  #print-button-position {
    position: absolute;
    right: 16px;
    top: 100px;
    z-index: 1000;
    background-color: var(--background-default-grey);
    overflow: visible;
  }

  #print-button-position[title]:hover:after {
    -webkit-mask-image: unset;
    mask-image: unset;
    background-color: unset;
    flex: unset;
    height: unset;
    -webkit-mask-size: unset;
    mask-size: unset;
    vertical-align: unset;
    content: attr(title);
    position: absolute;
    top: 0;
    color: var(--text-default-grey);
    font-size: .75rem;
    width: fit-content;
    white-space: nowrap;
    padding: .5rem .5rem 0.5rem 1.25rem;
    background-size: .375rem .5rem,.375rem .5rem,1px, 100%,calc(100% - 0.5rem) 100%;
    background-repeat: no-repeat;
    background-position: 0.125rem 50%, 100% 50%,0.375rem 100%,0.375rem 100%;
    filter: drop-shadow(0 2px 6px rgba(0,0,18,.16));
    filter: drop-shadow(var(--overlap-shadow));
    background-image: conic-gradient(from 56.31deg at 0% 50%,transparent 0deg,var(--background-overlap-grey) 0deg,var(--background-overlap-grey) 67.38deg,transparent 67.38deg),conic-gradient(from 56.31deg at 0% 50%,transparent 0deg,var(--border-default-grey) 0deg,var(--border-default-grey) 67.38deg,transparent 67.38deg),linear-gradient(90deg,var(--border-default-grey),var(--border-default-grey)),linear-gradient(90deg,var(--background-overlap-grey),var(--background-overlap-grey));
    transform: translateX(-262px);
  }
  .print-button-size {
    width: 40px;
    height: 40px;
  }

  /* positionnement absolu à adapter en fonction du positionnement
  des autres boutons car n'est pas dans la grille */
  @media (max-width: 576px){
    #print-button-position {
      top: 60px;
    }
  }

  @media (max-width: 627px) and (min-width: 576px){
    #print-button-position {
      top: 120px;
    }
  }
</style>