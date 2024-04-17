const overviewMap =
<script setup lang="ts">
import type Map from 'ol/Map'
import TileLayer from 'ol/layer/Tile.js'
import { OverviewMap } from 'ol/control'

const props = defineProps({
  visibility: Boolean,
  layer: TileLayer
})

const map = inject<Map>('map')

const overviewMap = ref(new OverviewMap({
  className: 'ol-overviewmap ol-custom-overviewmap',
  layers: [props.layer],
  collapseLabel: '\u00BB',
  label: '\u00AB',
  collapsed: false,
}))

onMounted(() => {
  if (props.visibility) {
    map?.addControl(overviewMap.value)
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map?.removeControl(overviewMap.value)
  }
})

onUpdated(() => {
  if (props.visibility) {
    map?.addControl(overviewMap.value)
  }
})
</script>

<style>
     #map .ol-custom-overviewmap {
        bottom: 30px;
        left: auto;
        right: 20px;
        top: auto;
      }
</style>
