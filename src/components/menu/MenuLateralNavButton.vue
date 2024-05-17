<script setup lang="js">
import { OhVueIcon as VIcon } from 'oh-vue-icons'

const props = defineProps({
    icon: String,
    id: String,
    active: Boolean
})


const icon = props.icon
const defaultScale = 2;
const iconProps = computed(() => typeof icon === 'string'
  ? { scale: defaultScale.value, name: icon }
  : { scale: defaultScale.value, ...icon },
);

const emit = defineEmits(['changeTab'])

const changeTab = (e) => {
    const tabId = e.target.id
    emit("changeTab", tabId);
}

</script>



<template>
    <button :id="id" 
    :class="`${active ? 'active': ''}  'navBarIcon'`"
    @click="changeTab">
        <div class="noclick">
            <VIcon
        v-bind="iconProps"/>  
        </div>
    </button>
</template>



<style scoped lang="scss">
.noclick {
    pointer-events: none;
}

.active {
    color : #8585f6;
}

</style>
