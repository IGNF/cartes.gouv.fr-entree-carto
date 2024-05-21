import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

/**
 * Store des objets de la carte
 * Enregistrement dans le LocalStorage
 * 
 */


export const useMapStore = defineStore('map', () => {
const map = ref({})
const zoom = useStorage('zoom', 12)
const lat = useStorage('lat', 283734.248995)
const long = useStorage('long', 5655117.100650)
const center = computed(() => {
    return [lat.value, long.value]
})

watch(zoom, ()=> {
  localStorage.setItem('zoom', zoom.value)
})

watch(lat, ()=> {
  localStorage.setItem('lat', lat.value)
})
watch(long, ()=> {
  localStorage.setItem('long', long.value)
})

  return {
    map,
    zoom,
    center,
    lat,
    long
 }
})
