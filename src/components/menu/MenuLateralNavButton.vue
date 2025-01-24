<script lang="js">
  /**
   * @description
   *
   * @property { String } icon nom de l'icône à afficher
   * @property { String } id du menu à ouvrir au clic sur l'icone
   * @property { Boolean } active boolean assurant le style actif ou inactif du bouton
   * @property { Boolean } title label du bouton
   *
   */
  export default {
    name: 'MenuLateralButton'
  };
</script>

<script setup lang="js">
import { useControlsPosition } from '@/composables/controls'
import { useMapStore } from "@/stores/mapStore"

const mapStore = useMapStore();

const props = defineProps({
    icon: String,
    id: String,
    active: Boolean,
    title: String,
    side: String,
    visibility: Boolean
})


const icon = props.icon

const emit = defineEmits(['tabClicked'])

const tabClicked = () => {
  if(props.side == "left") {
      closeLeftPanels()
  }
  if(props.side == "right") {
    closeRightPanels()
  }
  emit("tabClicked", props.id);
}

const controlsPosition = useControlsPosition()

function closePanel(control) {
  let button = [...control.element.children].filter(e => {
  if (e.className.includes("GPshowOpen"))
      return e
  })
  if (button[0].getAttribute("aria-pressed") === "true")
    button[0].click()
}
function closeRightPanels(event) {
  mapStore.getMap().getControls().getArray().forEach(control => {
    if (controlsPosition.right.includes(control.CLASSNAME)) {
      closePanel(control)
    }
  })
}
function closeLeftPanels() {
  mapStore.getMap().getControls().getArray().forEach(control => {
    if (controlsPosition.left.includes(control.CLASSNAME)) {
      closePanel(control)
    }
  })
}

function clickButton() {
  console.log("click on button" + props.id)
  button.click()
}
const button = ref(null)
const id = ref(props.id)
defineExpose({
  clickButton,
  button,
  id
})

onMounted(() => {
  if (props.id == "MenuCatalogue") {
    mapStore.setmenuCatalogueButton(button.value)
  }
})
</script>



<template>
  <div
  ref="button"
  >
    <DsfrButton
      :id="id"
      secondary
      :aria-label="title"
      :class="`${active ? 'active': ''}  navBarIcon ${visibility ? '' : 'invisibleNavButton'} navButton` "
      :icon="icon"
      :iconOnly="true"
      @click="tabClicked">
    </DsfrButton>
  </div>

</template>



<style scoped lang="scss">
.noclick {
    pointer-events: none;
}

.navButton {
  width: 40px;
  height: 40px;
  background-color: var(--background-default-grey);
}

.invisibleNavButton {
  display: none;
}

.navButton[aria-label]:hover::before {
  content: attr(aria-label);
  position: relative;
  top: 0;
  color: var(--text-default-grey);
  font-size: .75rem;
  width: fit-content;
  white-space: nowrap;
  background-repeat: no-repeat;
  filter: drop-shadow(0 2px 6px rgba(0,0,18,.16));
  filter: drop-shadow(var(--overlap-shadow));
}

</style>
