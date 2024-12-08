<script lang="js">
/**
 * @description
 * Favoris
 * 
 */
export default {};
</script>

<script setup lang="js">
import { inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const service = inject('services');

const title = "Favoris";
const description = "Not yet implemented !";

onBeforeMount(() => {

});

onMounted(() => {

});

</script>

<template>
  <div class="fr-container fr-p-2w">
    <h2>{{ title }}</h2>
      <DsfrAlert
        type="info"
        title="Information"
        :description="description"
        :closed="false"
        :closeable="false"
      />
  </div>
  <slot></slot>
</template>