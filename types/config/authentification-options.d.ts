export function createAuthOptions(env?: {
    BASE_URL: any;
    IAM_AUTHORITY: any;
    IAM_URL: any;
    IAM_REALM: any;
    IAM_CLIENT_ID: any;
    IAM_REDIRECT_URI: any;
    IAM_POST_LOGOUT_REDIRECT_URI: any;
    IAM_SCOPE: any;
    IAM_STORAGE: any;
    IAM_DEBUG: any;
    IAM_SILENT_REDIRECT_URI: any;
    IAM_ENTREPOT_API_URL: any;
    IAM_DISABLE: any;
}, origin?: string): {
    silentRedirectUri: any;
    silentRestore: boolean;
    apiBaseUrls: any[];
    authority?: string | undefined;
    clientId?: string | undefined;
    redirectUri?: string | undefined;
    postLogoutRedirectUri?: string | undefined;
    scope?: string | undefined;
    storage?: ("memory" | "session" | import("authentification-vue-oidc").StorageAdapter) | undefined;
    onError?: ((error: import("authentification-vue-oidc").AuthError) => void) | undefined;
    logger?: ((message: string, context?: Record<string, unknown>) => void) | undefined;
    debug?: boolean | undefined;
};
