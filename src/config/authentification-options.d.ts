
/// <reference types="vite/client" />

export interface AuthEnv {
  BASE_URL: string;
  IAM_AUTHORITY?: string;
  IAM_URL?: string;
  IAM_REALM?: string;
  IAM_CLIENT_ID?: string;
  IAM_REDIRECT_URI?: string;
  IAM_POST_LOGOUT_REDIRECT_URI?: string;
  IAM_SCOPE?: string;
  IAM_STORAGE?: string;
  IAM_DEBUG?: string;
  IAM_SILENT_REDIRECT_URI?: string;
  IAM_ENTREPOT_API_URL?: string;
  IAM_DISABLE?: string;
}

export declare function createAuthOptions(
  env?: AuthEnv,
  origin?: string
): ReturnType<typeof import('authentification-vue-oidc').authOptionsFromEnv> & {
  silentRedirectUri: string;
  silentRestore: boolean;
  apiBaseUrls: string[];
};
