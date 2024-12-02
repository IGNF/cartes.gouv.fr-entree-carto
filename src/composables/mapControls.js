import { useMapStore } from "@/stores/mapStore"

// liste des contrôles utilisateurs disponibles
// (cette liste est recalculée à chaque fois que le mapStore est modifié)
export const selectedControls = computed(() => {
    const mapStore = useMapStore();
    let controls = mapStore.getControls();
    return controls;
});
