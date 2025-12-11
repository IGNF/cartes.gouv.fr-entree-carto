import { OAuth2Token } from './token';
import { OAuth2Client } from './client';
type FetchMiddleware = (request: Request, next: (request: Request) => Promise<Response>) => Promise<Response>;
type OAuth2FetchOptions = {
    /**
     * Reference to OAuth2 client.
     */
    client: OAuth2Client;
    /**
     * You are responsible for implementing this function.
     * it's purpose is to supply the 'initial' oauth2 token.
     *
     * This function may be async. Return `null` to fail the process.
     */
    getNewToken(): OAuth2Token | null | Promise<OAuth2Token | null>;
    /**
     * If set, will be called if authentication fatally failed.
     */
    onError?: (err: Error) => void;
    /**
     * This function is called whenever the active token changes. Using this is
     * optional, but it may be used to (for example) put the token in off-line
     * storage for later usage.
     */
    storeToken?: (token: OAuth2Token) => void;
    /**
     * Also an optional feature. Implement this if you want the wrapper to try a
     * stored token before attempting a full re-authentication.
     *
     * This function may be async. Return null if there was no token.
     */
    getStoredToken?: () => OAuth2Token | null | Promise<OAuth2Token | null>;
    /**
     * Whether to automatically schedule token refresh.
     *
     * Certain execution environments, e.g. React Native, do not handle scheduled
     * tasks with setTimeout() in a graceful or predictable fashion. The default
     * behavior is to schedule refresh. Set this to false to disable scheduling.
     */
    scheduleRefresh?: boolean;
};
export declare class OAuth2Fetch {
    private options;
    /**
     * Current active token (if any)
     */
    private token;
    /**
     * If the user had a storedToken, the process to fetch it
     * may be async. We keep track of this process in this
     * promise, so it may be awaited to avoid race conditions.
     *
     * As soon as this promise resolves, this property gets nulled.
     */
    private activeGetStoredToken;
    constructor(options: OAuth2FetchOptions);
    /**
     * Does a fetch request and adds a Bearer / access token.
     *
     * If the access token is not known, this function attempts to fetch it
     * first. If the access token is almost expiring, this function might attempt
     * to refresh it.
     */
    fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
    /**
     * This function allows the fetch-mw to be called as more traditional
     * middleware.
     *
     * This function returns a middleware function with the signature
     *    (request, next): Response
     */
    mw(): FetchMiddleware;
    /**
     * Returns current token information.
     *
     * There result object will have:
     *   * accessToken
     *   * expiresAt - when the token expires, or null.
     *   * refreshToken - may be null
     *
     * This function will attempt to automatically refresh if stale.
     */
    getToken(): Promise<OAuth2Token>;
    /**
     * Returns an access token.
     *
     * If the current access token is not known, it will attempt to fetch it.
     * If the access token is expiring, it will attempt to refresh it.
     */
    getAccessToken(): Promise<string>;
    /**
     * Keeping track of an active refreshToken operation.
     *
     * This will allow us to ensure only 1 such operation happens at any
     * given time.
     */
    private activeRefresh;
    /**
     * Forces an access token refresh
     */
    refreshToken(): Promise<OAuth2Token>;
    /**
     * Timer trigger for the next automated refresh
     */
    private refreshTimer;
    private scheduleRefresh;
}
export {};
