# Authentification & Espace personnel

## Authentification / Session partagée

### Workflow de connexion / déconnexion utilisateur

```mermaid
sequenceDiagram
    autonumber
    participant U as Utilisateur
    participant M as Menu/Header
    participant R as Router Vue
    participant N as CustomNavigation
    participant S as Service
    participant K as IAM/Keycloak
    participant A as API Entrepot

    U->>R: Ouvre "/"
    R->>N: checkAuthentication()
    N->>S: resolveAccessStatus()

    alt status = login
        N-->>U: Connecte
    else status = logout
        N-->>U: Deconnecte
    else status = no-auth
        alt session locale existante
            N->>S: validateAuthentication()
            S->>A: GET /me
            A-->>S: 200 ou 401
            alt 401 + incoherence locale
                N->>R: push("/logout?from=authInvalid")
            else 200
                N-->>U: Session locale valide
            end
        else pas de session locale
            alt IAM_CHECK_SSO_DISABLE != 1
                N->>S: checkSessionKeyCloak() -> checkKeycloakSession(IAM_CHECK_SSO_TYPE)
                S->>K: check-sso silent
                K-->>S: session active ? true/false
                S-->>N: resultat check SSO

                alt resultat == true AND IAM_CHECK_SSO_AUTO_AUTH == 1
                    N->>R: push("/login?from=auto-sso")
                    N-->>U: Connexion en cours (utilisateur connecté après retour IAM)
                else resultat == true AND IAM_CHECK_SSO_AUTO_AUTH != 1
                    N-->>U: Session detectee, auto-auth desactive
                     N-->>U: Action manuelle sur le bouton "Se connecter"
                else resultat == false
                    N-->>U: Reste non connecte
                end
            else IAM_CHECK_SSO_DISABLE == 1
                N-->>U: Check SSO desactive, reste non connecte
            end
        end
    end

    Note over U,M: Connexion manuelle
    U->>M: Clique "Se connecter"
    M->>R: push("/login")
    R->>K: Redirection IAM (authorize)
    K-->>R: Retour "/login?code&state&session_state"
    R->>N: checkAuthentication() (nouveau cycle)
    N->>S: resolveAccessStatus() -> getAccessToken()
    S->>A: getUserMe + getDocuments
    A-->>S: 200
    S-->>N: status=login
    N->>R: replace("/")

    Note over U,M: Deconnexion manuelle
    U->>M: Clique "Se deconnecter"
    M->>R: push("/logout")
    R->>K: IAM logout
    K-->>R: Retour app (callback logout)
    R->>N: checkAuthentication()
    N->>S: resolveAccessStatus() => status=logout
    N->>R: replace("/")
```

### Workflow de partage de session

```mermaid
sequenceDiagram
    autonumber
    participant U as Utilisateur
    participant B1 as Brique A (deja connectee)
    participant IAM as IAM/Keycloak (SSO)
    participant B2 as Brique B (entree-carto)
    participant NAV as CustomNavigation
    participant SRV as ServiceLocal

    U->>B1: Se connecte sur une autre brique
    B1->>IAM: Authentification OIDC
    IAM-->>B1: Session SSO IAM active (navigateur)

    U->>B2: Ouvre entree-carto
    B2->>NAV: checkAuthentication()
    NAV->>SRV: resolveAccessStatus()
    SRV-->>NAV: status = no-auth (pas de callback local)

    NAV->>SRV: checkSessionKeyCloak() -> checkKeycloakSession(IAM_CHECK_SSO_TYPE)
    SRV->>IAM: check-sso silencieux (iframe/prompt=none)
    IAM-->>SRV: resultat session SSO (true/false)
    SRV-->>NAV: resultat

    alt resultat == true AND IAM_CHECK_SSO_AUTO_AUTH == 1
        NAV->>B2: Redirection /login?from=auto-sso
        B2->>IAM: Demande authorize OIDC (sans ressaisie)
        IAM-->>B2: Retour /login?code&state&session_state
        B2->>NAV: checkAuthentication() (nouveau cycle)
        NAV->>SRV: resolveAccessStatus() -> getAccessToken()
        SRV-->>NAV: status=login (utilisateur connecte sur B2)
    else resultat == true AND IAM_CHECK_SSO_AUTO_AUTH != 1
        NAV-->>U: Session partagee detectee (auto-login desactive)
    else resultat == false
        NAV-->>U: Pas de session IAM partagee, utilisateur non connecte
    end
```

### Configuration

Ex. .env.development-local 
```ini
# verification de session SSO (1=désactivé)
IAM_CHECK_SSO_DISABLE=0
IAM_CHECK_SSO_AUTO_AUTH=1 
IAM_CHECK_SSO_TYPE="keycloak" # 'keycloak' | 'natif' (experimental !)
IAM_CHECK_SSO_TIMEOUT=5000
IAM_CHECK_SSO_CLIENT_ID="cartes-gouv-public"

# désactivation de l'interface de connexion (1=désactivé)
IAM_DISABLE=0
# local|remote
IAM_AUTH_MODE="local"
# Mode auth local
IAM_URL="https://sso.geopf.fr"
IAM_REALM="geoplateforme"
# client_id de l'application carto sur le sso :
# "cartes-gouv-public" ou "cartes-gouv-fr-carto" (GLGe8lcjSj7OytvAeHXABrZRFjbu31ny) 
IAM_CLIENT_ID="cartes-gouv-public"
IAM_CLIENT_SECRET=
```

Pour activer le partage de session : `IAM_CHECK_SSO_DISABLE=0`
Pour activer l'auto login sur une session sso détectée : `IAM_CHECK_SSO_AUTO_AUTH=1`

## Espace personnel

> TODO
