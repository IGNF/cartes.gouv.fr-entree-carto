import {
    defineStore
  } from 'pinia';
  

export const useMapStore = defineStore('menu', () => {

    const buttonWidth = ref(40)
    const buttonHeight = ref(40)
    const marginTop = ref(12)
    const gutter = ref(4)


    const leftControlsTop = computed(() => {
        return  marginTop + (buttonHeight + gutter) * leftMenuCount
    })
    const rightControlsTop = computed(() => {
        return  marginTop + (buttonHeight + gutter) * rightMenuCount
    })

    const leftMenuCount = ref(0)
    const rightMenuCount = ref(0)

    function setLeftMenuCount(val)  {
        leftMenuCount.value = val
    }
    function setRightMenuCount(val)  {
        rightMenuCount.value = val       
    }
    function getLeftMenuCount(val)  {
        return leftMenuCount.value
    }
    function getRightMenuCount(val)  {
        return rightMenuCount.value       
    }
    function toCssPixel(val) {
        return val + 'px'
    }
    
    return {
        map,
        zoom,
        center,
        x,
        y,
        lon,
        lat,
        firstVisit,
        noInformation,
        title,
        comment,
        info,
        geolocation,
        permalink,
        permalinkShare,
        getMap,
        setMap,
        getLayers,
        cleanLayers,
        addLayer,
        removeLayer,
        updateLayerProperty,
        getLayerProperty,
        getControls,
        cleanControls,
        addControl,
        removeControl
      }
})