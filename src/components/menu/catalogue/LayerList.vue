<script setup lang="js">
const props = defineProps({
    layers: Object
})

const modelValue = ref()
</script>

<template>
    <template v-for="layer in layers" :key="layer.id">
        <DsfrCheckbox
        :model-value="modelValue"
        :label="layer.title"
        :id="layer.id"
        :hint="layer.description"
        />
    </template>
</template>