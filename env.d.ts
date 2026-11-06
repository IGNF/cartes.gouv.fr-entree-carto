/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly IAM_AUTHORITY?: string;
  readonly IAM_URL: string;
  readonly IAM_REALM: string;
  readonly IAM_CLIENT_ID: string;
  readonly IAM_REDIRECT_URI?: string;
  readonly IAM_POST_LOGOUT_REDIRECT_URI?: string;
  readonly IAM_SILENT_REDIRECT_URI?: string;
  readonly IAM_SCOPE: string;
  readonly IAM_STORAGE: 'memory' | 'session';
  readonly IAM_DEBUG: string;
  readonly IAM_ENTREPOT_API_URL: string;
  readonly IAM_DISABLE: string;
}

declare module 'virtual:pwa-register/vue' {
  import type { Ref } from 'vue'

  export type RegisterSWOptions = {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: any) => void
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Ref<boolean>
    offlineReady: Ref<boolean>
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
