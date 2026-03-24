import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLogger } from 'vue-logger-plugin';
import { useServiceStore } from '@/stores/serviceStore';

const AUTO_SSO_ATTEMPTED_KEY = 'auth:auto-sso-attempted';

const IAM_CHECK_SSO_DISABLE = import.meta.env.IAM_CHECK_SSO_DISABLE;
const IAM_CHECK_SSO_TYPE = import.meta.env.IAM_CHECK_SSO_TYPE;
const IAM_CHECK_SSO_AUTO_AUTH = import.meta.env.IAM_CHECK_SSO_AUTO_AUTH;

export function useAuthentication(deps = {}) {
  const router = useRouter();
  const log = useLogger();
  // service et store (injection)
  const service = deps.service ?? inject('services');
  const serviceStore = deps.serviceStore ?? useServiceStore();
  // actions
  const onLogin = deps.onLogin ?? (() => {});
  const onLogout = deps.onLogout ?? (() => {});
  const onError = deps.onError ?? ((e) => { console.error('Authentication error :', e); });

  if (!service) {
    throw new Error('Missing "services" injection for useAuthentication().');
  }

  const authenticated = ref(false);

  const cleanAutoSSOAttemptedFlag = () => {
    sessionStorage.removeItem(AUTO_SSO_ATTEMPTED_KEY);
  };

  const setAutoSSOAttemptedFlag = () => {
    sessionStorage.setItem(AUTO_SSO_ATTEMPTED_KEY, '1');
  };

  const hasAutoSSOBeenAttempted = () => {
    return sessionStorage.getItem(AUTO_SSO_ATTEMPTED_KEY) === '1';
  };

  // INFO
  // en mode de navigation privée, des excpetions sont levées lors de l'accès au "silent SSO en iframe"
  // car l’accès storage/cookies tiers est bloqué !
  // > requestStorageAccess: Must be handling a user gesture to use.
  // > requestStorageAccess: Permission denied.
  const checkSessionKeyCloak = async () => {
    const autoSsoAlreadyAttempted = hasAutoSSOBeenAttempted();

    if (autoSsoAlreadyAttempted) {
      return false;
    }

    let hasKeycloakSession = false;
    try {
      console.debug('Checking Keycloak session...');
      hasKeycloakSession = await service.checkKeycloakSession(IAM_CHECK_SSO_TYPE);
      console.debug(`Keycloak session check : ${hasKeycloakSession} !`);
    } catch (error) {
      setAutoSSOAttemptedFlag();
      console.warn('Keycloak session check failed, disabling auto-SSO retry for this tab session.', error);
      return false;
    }

    if (hasKeycloakSession) {
      setAutoSSOAttemptedFlag();
      console.debug('Keycloak session detected, redirecting to /login for silent auto-auth.');
      if (IAM_CHECK_SSO_AUTO_AUTH === '1') {
        await router.push({ path: '/login', query: { from: 'auto-sso' } });
      }
      return true;
    }

    return false;
  };

  const checkAuthentication = async () => {
    authenticated.value = Boolean(service.authenticated);

    try {
      const status = await service.resolveAccessStatus();

      if (status !== 'no-auth') {
        log.debug(`Access validated : ${status} !`);
        serviceStore.setAuthentificateSyncNeeded(false);
        router.replace({ path: '/', query: undefined });
      }

      if (status === 'login') {
        log.debug('User connected.');
        cleanAutoSSOAttemptedFlag();
        authenticated.value = true;
        onLogin();
        return;
      }

      if (status === 'logout') {
        log.debug('User disconnected.');
        cleanAutoSSOAttemptedFlag();
        authenticated.value = false;
        onLogout();
        return;
      }

      if (service.isAuthenticatedLocally()) {
        log.debug('User already authentificate locally, checking session validity...');
        const isValid = await service.validateAuthentication();
        log.debug(`Checking session validity : ${isValid} !`);
        authenticated.value = Boolean(isValid);

        if (!isValid && service.authenticated) {
          console.warn('Incoherent local session (401 côté IAM/API), redirect to logout.');
          authenticated.value = false;
          router.push({ path: '/logout', query: { from: 'authInvalid' } });
          return;
        }

        log.debug('validateAuthentication() finished !');
      } else {
        if (IAM_CHECK_SSO_DISABLE !== '1') {
          const redirectedToLogin = await checkSessionKeyCloak();
          if (redirectedToLogin) {
            return;
          }
        }

        authenticated.value = false;
      }
    } catch (e) {
      console.warn(e);
      onError(e);
    } finally {
      log.debug('resolveAccessStatus() finished !');
    }
  };

  return {
    authenticated,
    checkAuthentication
  };
}
