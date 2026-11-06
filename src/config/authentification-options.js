import { authOptionsFromEnv } from 'authentification-vue-oidc';

export function createAuthOptions(env = {
  BASE_URL: import.meta.env.BASE_URL,
  IAM_AUTHORITY: import.meta.env.IAM_AUTHORITY,
  IAM_URL: import.meta.env.IAM_URL,
  IAM_REALM: import.meta.env.IAM_REALM,
  IAM_CLIENT_ID: import.meta.env.IAM_CLIENT_ID,
  IAM_REDIRECT_URI: import.meta.env.IAM_REDIRECT_URI,
  IAM_POST_LOGOUT_REDIRECT_URI: import.meta.env.IAM_POST_LOGOUT_REDIRECT_URI,
  IAM_SCOPE: import.meta.env.IAM_SCOPE,
  IAM_STORAGE: import.meta.env.IAM_STORAGE,
  IAM_DEBUG: import.meta.env.IAM_DEBUG,
  IAM_SILENT_REDIRECT_URI: import.meta.env.IAM_SILENT_REDIRECT_URI,
  IAM_ENTREPOT_API_URL: import.meta.env.IAM_ENTREPOT_API_URL,
  IAM_DISABLE: import.meta.env.IAM_DISABLE,
}, origin = window.location.origin) {
  const base = new URL(`${env.BASE_URL.replace(/\/$/, '')}/`, origin);
  return {
    ...authOptionsFromEnv({
      IAM_AUTHORITY: env.IAM_AUTHORITY || undefined,
      IAM_URL: env.IAM_URL,
      IAM_REALM: env.IAM_REALM,
      IAM_CLIENT_ID: env.IAM_CLIENT_ID,
      IAM_REDIRECT_URI: env.IAM_REDIRECT_URI || new URL('login', base).href,
      IAM_POST_LOGOUT_REDIRECT_URI: env.IAM_POST_LOGOUT_REDIRECT_URI || base.href,
      IAM_SCOPE: env.IAM_SCOPE?.replaceAll(',', ' ') || 'openid profile email',
      IAM_STORAGE: env.IAM_STORAGE || 'memory',
      IAM_DEBUG: env.IAM_DEBUG || 'false',
    }),
    silentRedirectUri: env.IAM_SILENT_REDIRECT_URI || new URL('silent-renew.html', base).href,
    silentRestore: env.IAM_DISABLE !== '1',
    apiBaseUrls: env.IAM_ENTREPOT_API_URL ? [env.IAM_ENTREPOT_API_URL] : [],
  };
}