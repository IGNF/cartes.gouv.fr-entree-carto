"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Fetch = void 0;
class OAuth2Fetch {
    constructor(options) {
        /**
         * Current active token (if any)
         */
        this.token = null;
        /**
         * If the user had a storedToken, the process to fetch it
         * may be async. We keep track of this process in this
         * promise, so it may be awaited to avoid race conditions.
         *
         * As soon as this promise resolves, this property gets nulled.
         */
        this.activeGetStoredToken = null;
        /**
         * Keeping track of an active refreshToken operation.
         *
         * This will allow us to ensure only 1 such operation happens at any
         * given time.
         */
        this.activeRefresh = null;
        /**
         * Timer trigger for the next automated refresh
         */
        this.refreshTimer = null;
        if ((options === null || options === void 0 ? void 0 : options.scheduleRefresh) === undefined) {
            options.scheduleRefresh = true;
        }
        this.options = options;
        if (options.getStoredToken) {
            this.activeGetStoredToken = (async () => {
                this.token = await options.getStoredToken();
                this.activeGetStoredToken = null;
            })();
        }
        this.scheduleRefresh();
    }
    /**
     * Does a fetch request and adds a Bearer / access token.
     *
     * If the access token is not known, this function attempts to fetch it
     * first. If the access token is almost expiring, this function might attempt
     * to refresh it.
     */
    async fetch(input, init) {
        // input might be a string or a Request object, we want to make sure this
        // is always a fully-formed Request object.
        const request = new Request(input, init);
        return this.mw()(request, req => fetch(req));
    }
    /**
     * This function allows the fetch-mw to be called as more traditional
     * middleware.
     *
     * This function returns a middleware function with the signature
     *    (request, next): Response
     */
    mw() {
        return async (request, next) => {
            const accessToken = await this.getAccessToken();
            // Make a clone. We need to clone if we need to retry the request later.
            let authenticatedRequest = request.clone();
            authenticatedRequest.headers.set('Authorization', 'Bearer ' + accessToken);
            let response = await next(authenticatedRequest);
            if (!response.ok && response.status === 401) {
                const newToken = await this.refreshToken();
                authenticatedRequest = request.clone();
                authenticatedRequest.headers.set('Authorization', 'Bearer ' + newToken.accessToken);
                response = await next(authenticatedRequest);
            }
            return response;
        };
    }
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
    async getToken() {
        if (this.token && (this.token.expiresAt === null || this.token.expiresAt > Date.now())) {
            // The current token is still valid
            return this.token;
        }
        return this.refreshToken();
    }
    /**
     * Returns an access token.
     *
     * If the current access token is not known, it will attempt to fetch it.
     * If the access token is expiring, it will attempt to refresh it.
     */
    async getAccessToken() {
        // Ensure getStoredToken finished.
        await this.activeGetStoredToken;
        const token = await this.getToken();
        return token.accessToken;
    }
    /**
     * Forces an access token refresh
     */
    async refreshToken() {
        var _a, _b;
        if (this.activeRefresh) {
            // If we are currently already doing this operation,
            // make sure we don't do it twice in parallel.
            return this.activeRefresh;
        }
        const oldToken = this.token;
        this.activeRefresh = (async () => {
            var _a, _b;
            let newToken = null;
            try {
                if (oldToken === null || oldToken === void 0 ? void 0 : oldToken.refreshToken) {
                    // We had a refresh token, lets see if we can use it!
                    newToken = await this.options.client.refreshToken(oldToken);
                }
            }
            catch (err) {
                console.warn('[oauth2] refresh token not accepted, we\'ll try reauthenticating');
            }
            if (!newToken) {
                newToken = await this.options.getNewToken();
            }
            if (!newToken) {
                const err = new Error('Unable to obtain OAuth2 tokens, a full reauth may be needed');
                (_b = (_a = this.options).onError) === null || _b === void 0 ? void 0 : _b.call(_a, err);
                throw err;
            }
            return newToken;
        })();
        try {
            const token = await this.activeRefresh;
            this.token = token;
            (_b = (_a = this.options).storeToken) === null || _b === void 0 ? void 0 : _b.call(_a, token);
            this.scheduleRefresh();
            return token;
        }
        catch (err) {
            if (this.options.onError) {
                this.options.onError(err);
            }
            throw err;
        }
        finally {
            // Make sure we clear the current refresh operation.
            this.activeRefresh = null;
        }
    }
    scheduleRefresh() {
        var _a;
        if (!this.options.scheduleRefresh) {
            return;
        }
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
        if (!((_a = this.token) === null || _a === void 0 ? void 0 : _a.expiresAt) || !this.token.refreshToken) {
            // If we don't know when the token expires, or don't have a refresh_token, don't bother.
            return;
        }
        const expiresIn = this.token.expiresAt - Date.now();
        // We only schedule this event if it happens more than 2 minutes in the future.
        if (expiresIn < 120 * 1000) {
            return;
        }
        // Schedule 1 minute before expiry
        this.refreshTimer = setTimeout(async () => {
            try {
                await this.refreshToken();
            }
            catch (err) {
                // eslint-disable-next-line no-console
                console.error('[fetch-mw-oauth2] error while doing a background OAuth2 auto-refresh', err);
            }
        }, expiresIn - 60 * 1000);
    }
}
exports.OAuth2Fetch = OAuth2Fetch;
//# sourceMappingURL=fetch-wrapper.js.map