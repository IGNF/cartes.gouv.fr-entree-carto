import { ref } from 'vue';

const openModals = ref(new Map());

export function useModals() {
  const open = (name) => {
    if (typeof name !== 'string') return;
    openModals.value.set(name, true);
  };

  const close = (name) => {
    if (typeof name !== 'string') return;
    openModals.value.delete(name);
  };

  const isOpen = (name) => {
    if (typeof name !== 'string') return false;
    return openModals.value.get(name) === true;
  };

  return { open, close, isOpen };
}