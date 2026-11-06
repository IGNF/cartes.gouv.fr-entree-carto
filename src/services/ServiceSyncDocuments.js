import { watch } from 'vue';

export function useServiceSyncDocuments(auth, service, store, emitter, onError) {
  return watch(
    [() => auth.isAuthenticated.value, () => auth.user.value?.sub],
    async ([authenticated, subject], previous, onCleanup) => {
      let active = true;
      onCleanup(() => { active = false; });
      store.setAuthentificated(authenticated);
      service.resetDocuments();
      if (!authenticated || !subject) return;
      try {
        const documents = await service.getDocuments();
        if (!active) return;
        emitter.dispatchEvent('service:documents:loaded', { detail: documents });
        if (documents.some((result) => result.status === 'rejected')) onError();
      } catch {
        if (active) onError();
      }
    },
    { immediate: true, flush: 'sync' },
  );
}