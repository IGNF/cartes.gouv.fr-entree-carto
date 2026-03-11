<script lang="js">
  /**
   * @description
   *
   * @property { String | Object } icon nom de l'icône à afficher
   * @property { String } id du menu à ouvrir au clic sur l'icône
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
import { useDomStore } from "@/stores/domStore"

const mapStore = useMapStore();
const domStore = useDomStore();

const props = defineProps({
    icon: {
        type: [String, Object],
        default: ''
    },
    id: String,
    active: Boolean,
    title: String,
    side: String,
    visibility: Boolean,
    secondary: Boolean
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
  button.value.children[0].click()
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
    domStore.setmenuCatalogueButton(button.value)
  }
})
</script>

<template>
  <div ref="button">
    <DsfrButton
      :id="id"
      :secondary="secondary"
      :aria-label="title"
      :class="`${active ? 'active': ''}  navBarIcon ${visibility ? '' : 'invisibleNavButton'} navButton` "
      :icon="icon"
      :icon-only="true"
      @click="tabClicked"
    />
  </div>
</template>

<style lang="scss">
@use "@/assets/variables" as *;

.noclick {
    pointer-events: none;
}
.navButton {
  position: relative;
  width: $widget-btn-size;
  height: $widget-btn-size;
  border-radius: $widget-btn-radius;
  justify-content: center;
  padding: $widget-btn-padding !important;

  @include widget-btn-style;
  box-shadow: inset 0 0 0 $widget-btn-padding var(--background-default-grey), var(--raised-shadow);
}
.left .navButton[aria-label]:hover::before {
  padding: .5rem .5rem 0.5rem 1.25rem;
  background-size: .375rem .5rem,.375rem .5rem,1px, 100%,calc(100% - 0.5rem) 100%;
  background-position: 0.125rem 50%, 0% 50%,0.375rem 100%,0.375rem 100%;
  background-image: conic-gradient(from 56.31deg at 0% 50%,transparent 0deg,var(--background-overlap-grey) 0deg,var(--background-overlap-grey) 67.38deg,transparent 67.38deg),conic-gradient(from 56.31deg at 0% 50%,transparent 0deg,var(--border-default-grey) 0deg,var(--border-default-grey) 67.38deg,transparent 67.38deg),linear-gradient(90deg,var(--border-default-grey),var(--border-default-grey)),linear-gradient(90deg,var(--background-overlap-grey),var(--background-overlap-grey));
  transform: translate($widget-btn-size - $widget-btn-padding, $widget-btn-padding);
}
.right .navButton[aria-label]:hover::before {
  padding: .5rem 1.25rem .5rem .5rem;
  background-size: .375rem .5rem, .375rem .5rem, 1px 100%, 100%;
  background-position: calc(100% - 0.125rem) 50%, 100% 50%, calc(100% - 0.375rem) 0, calc(100% - 0.375rem) 0;
  background-image: conic-gradient(from 236.31deg at 100% 50%, transparent 0deg, var(--background-overlap-grey) 0deg, var(--background-overlap-grey) 67.38deg, transparent 67.38deg), conic-gradient(from 236.31deg at 100% 50%, transparent 0deg, var(--border-default-grey) 0deg, var(--border-default-grey) 67.38deg, transparent 67.38deg), linear-gradient(90deg, var(--border-default-grey), var(--border-default-grey)), linear-gradient(90deg, var(--background-overlap-grey), var(--background-overlap-grey));
  transform: translate(calc(-100% + $widget-btn-padding), $widget-btn-padding);
}
.navButton[aria-label]:hover .vicon {
  position: absolute;
}
.navButton:not(:disabled):hover {
  @include widget-btn-style-hover;
}
.navButton[aria-pressed="true"],
.is_expanded .navButton,
.is_expanded .navButton:not(:disabled):hover {
  @include widget-btn-style-active;
}

.navButton.invisibleNavButton {
  display: none;
}

.navButton[aria-label]:hover::before {
  content: attr(aria-label);
  position: absolute;
  top: 0;
  left: 0;
  color: var(--text-default-grey);
  font-size: .75rem;
  width: fit-content;
  white-space: nowrap;
  background-repeat: no-repeat;
  filter: drop-shadow(0 2px 6px rgba(0,0,18,.16));
  filter: drop-shadow(var(--overlap-shadow));
}
// remove tooltip if already open
.is_expanded .navButton[aria-label]:hover::before {
  content: none;
}
// le navButton quand il y a au moins 1 widget (n=4)
#mainMap:has(.position-container-top-right .gpf-widget:nth-child(4)) ~ .menu-toggle-wrap.right .navButton {
  border-radius: $widget-btn-radius $widget-btn-radius 0 0;
  box-shadow: inset 0 0 0 $widget-btn-padding var(--background-default-grey), 0 -2px 3px var(--shadow-color); // --raised-shadow mais remontee
}
// la séparation
#mainMap:has(.position-container-top-right .gpf-widget:nth-child(4)) ~ .menu-toggle-wrap.right .navButton::after {
  content: "";
  display: block;
  height: 1px;
  position: absolute;
  bottom: 0;
  background: var(--border-default-grey);
  width: calc(100% - $widget-btn-padding * 2);
}
</style>
