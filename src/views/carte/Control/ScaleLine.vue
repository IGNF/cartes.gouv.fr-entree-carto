<script setup lang="ts">
import type Map from 'ol/Map'
import { ScaleLine } from 'ol/control'

const props = defineProps({
  visibility: Boolean,
  scaleLineOptions: Object
})

const map = inject<Map>('map')

const scaleLine = ref(new ScaleLine(props.scaleLineOptions))

onMounted(() => {
  if (props.visibility) {
    map?.addControl(scaleLine.value)
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map?.removeControl(scaleLine.value)
  }
})

onUpdated(() => {
  if (props.visibility) {
    map?.addControl(scaleLine.value)
  }
})
</script>
