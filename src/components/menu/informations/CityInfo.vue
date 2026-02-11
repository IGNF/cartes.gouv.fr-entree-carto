<script setup lang="js">
import { getCityInfo, getClosestCities } from '@/features/cityinfo';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});

const commune = ref(props.data);
console.warn('Informations de la ville :', commune.value);

/**
 * Récupérer les informations de la ville à partir du code INSEE
 * @param codeInsee 
 */
async function onCommuneClick (codeInsee, city) {
  const dataCity = await getCityInfo(codeInsee, city);
  const closestCities = await getClosestCities(city, dataCity.centre[0], dataCity.centre[1]);
  commune.value = dataCity;
  commune.value.closest_cities = closestCities || []; 
}
</script>

<template>
  <div class="fr-callout">
    <h6 
      v-if="commune.nom" 
      class="fr-callout__title"
    >
      {{ commune.nom }}
    </h6>
    <div 
      v-if="commune.departement" 
      class="fr-callout__text"
    >
      {{ commune.departement }}
    </div>
    <div 
      v-if="commune.region" 
      class="fr-callout__text"
    >
      <strong>Région :</strong> {{ commune.region }}
    </div>
    <div 
      v-if="commune.closest_cities && commune.closest_cities.length" 
      class="fr-callout__text"
    >
      <strong>Villes les plus proches :</strong>
      <ul class="fr-mb-0">
        <li 
          v-for="city in commune.closest_cities" 
          :key="city.code_insee"
        >
          <a 
            href="#" 
            class="fr-link" 
            @click.prevent="onCommuneClick(city.code_insee, commune.nom)"
          >
            {{ city.nom }}
          </a>
          <span v-if="city.distance"> ({{ typeof city.distance === 'number' ? city.distance.toFixed(2) : parseFloat(city.distance).toFixed(2) }} km)</span>
        </li>
      </ul>
    </div>
  </div>
</template>
