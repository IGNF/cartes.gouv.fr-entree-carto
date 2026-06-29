
<script lang="js">
/**
 * @description
 * Composant de tri pour les listes de données.
 * 
 * @props
 * @prop {String} sortId - Identifiant unique du composant de tri.
 * @prop {Array} sortFields - Liste des champs de tri disponibles.
 * @prop {String} sortField - Champ de tri sélectionné.
 * @prop {String} sortOrder - Ordre de tri sélectionné (asc ou desc).
 * 
 * @fires update:sort-field - Événement émis lors de la mise à jour du champ de tri.
 * @fires update:sort-order - Événement émis lors de la mise à jour de l'ordre de tri.
 * @example
 * const sortFields = [
 *   { label: "Nom", value: "name" },
 *   { label: "Type", value: "type" },
 *   { label: "Date", value: "date" }
 * ];
 *
 * const sortField = ref("date");
 * const sortOrder = ref("desc"); // desc ou asc
 * 
 * const onUpdateSortField = (value) => {
 *   sortField.value = value;
 *   onUpdateDataList(); // Mettre à jour la liste de données après le tri
 * };
 * const onUpdateSortOrder = (value) => {
 *   sortOrder.value = value;
 *   onUpdateDataList(); // Mettre à jour la liste de données après le tri
 * };
 * 
 * <Sort 
 *   v-model:sort-field="sortField"
 *   v-model:sort-order="sortOrder"
 *   sort-id="sort-bookmark-data"
 *   :sort-fields="sortFields"
 *   @update:sort-field="onUpdateSortField"
 *   @update:sort-order="onUpdateSortOrder"
 * />
 * 
 */
export default {
  name: 'Sort'
};
</script>
<script setup lang="js">

defineProps({
  sortId: {
    type: String,
    required: true
  },
  sortFields: {
    type: Array,
    required: true
  },
  sortField: {
    type: String,
    required: true
  },
  sortOrder: {
    type: String,
    required: true
  }
});

defineEmits([
  'update:sort-field', 
  'update:sort-order'
]);

</script>

<template>
  <!-- UI
   ajouter un bouton pour changer l'ordre de tri (asc/desc) avec une icône appropriée
   ajouter un select pour choisir le champ de tri (nom, type, date)
   utiliser les props sortId, sortFields, sortField, sortOrder
   émettre les événements update:sort-field et update:sort-order lors de la sélection d'un champ de tri ou d'un ordre de tri
   utiliser les classes CSS appropriées pour le style et l'accessibilité
  -->
  <div class="container-sort">
    <label 
      :for="sortId" 
      class="fr-label-no"
    >Trier par</label>
    <select 
      :id="sortId" 
      :value="sortField" 
      class="fr-select-no" 
      @change="$emit('update:sort-field', $event.target.value)" 
    >
      <option 
        v-for="field in sortFields" 
        :key="field.value" 
        :value="field.value"
      >
        {{ field.label }}
      </option>
    </select>
    <button 
      :id="`${sortId}-order`"
      class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline"
      @click="$emit('update:sort-order', sortOrder === 'asc' ? 'desc' : 'asc')" 
    >
      {{ sortOrder === 'asc' ? '↑' : '↓' }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
  .container-sort {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    color: var(--text-action-high-blue-france);

    select.fr-select-no {
      /* surcharge la classe fr-select du DSFR */
      margin: unset;
      padding: 0.5rem;
      width: 30%;
    }
    button.fr-btn {
      /* surcharge la classe fr-btn du DSFR */
    }
  }
</style>