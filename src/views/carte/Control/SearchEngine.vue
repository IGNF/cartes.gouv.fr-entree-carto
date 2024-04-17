<script setup lang="ts">
import type Map from 'ol/Map'
import { SearchEngine } from 'geoportal-extensions-openlayers'

const props = defineProps({
  visibility: Boolean,
  searchEngineOptions: Object
})

const map = inject<Map>('map')

const searchengine = ref(new SearchEngine(props.searchEngineOptions))

onMounted(() => {
  if (props.visibility) {
    map?.addControl(searchengine.value)
  }
})

onBeforeUpdate(() => {
  if (!props.visibility) {
    map?.removeControl(searchengine.value)
  }
})

onUpdated(() => {
  if (props.visibility) {
    map?.addControl(searchengine.value)
  }
})
</script>

<style>
div[id^="GPsearchEngine-"]{
  left: 40vw;
}
</style>
