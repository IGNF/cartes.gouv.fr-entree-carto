import { OAuth2Token } from './token';
import { AuthorizationCodeRequest, ClientCredentialsRequest, IntrospectionRequest, IntrospectionResponse, PasswordRequest, OAuth2TokenTypeHint, RefreshRequest, RevocationRequest, TokenResponse } from './messages';
import { OAuth2AuthorizationCodeClient } from './client/authorization-code';
type ClientCredentialsParams = {
    scope?: string[];
    extraParams?: Record<string, string>;
    /**
     * The resource  the client intends to access.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc8707
     */
    resource?: string | string[];
};
type PasswordParams = {
    username: string;
    password: string;
    scope?: string[];
    /**
     * The resource  the client intends to access.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc8707
     */
    resource?: string | string[];
};
/**
 * Extra options that may be passed to refresh()
 */
type RefreshParams = {
    scope?: string[];
    /**
     * The resource  the client intends to access.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc8707
     */
    resource?: string | string[];
};
export interface ClientSettings {
    /**
     * The hostname of the OAuth2 server.
     * If provided, we'll attempt to discover all the other related endpoints.
     *
     * If this is not desired, just specify the other endpoints manually.
     *
     * This url will also be used as the base URL for all other urls. This lets
     * you specify all the other urls as relative.
     */
    server?: string;
    /**
     * OAuth2 clientId
     */
    clientId: string;
    /**
     * OAuth2 clientSecret
     *
     * This is required when using the 'client_secret_basic' authenticationMethod
     * for the client_credentials and password flows, but not authorization_code
     * or implicit.
     */
    clientSecret?: string;
    /**
     * The /authorize endpoint.
     *
     * Required only for the browser-portion of the authorization_code flow.
     */
    authorizationEndpoint?: string;
    /**
     * The token endpoint.
     *
     * Required for most grant types and refreshing tokens.
     */
    tokenEndpoint?: string;
    /**
     * Introspection endpoint.
     *
     * Required for, well, introspecting tokens.
     * If not provided we'll try to discover it, or otherwise default to /introspect
     */
    introspectionEndpoint?: string;
    /**
     * Revocation endpoint.
     *
     * Required for revoking tokens. Not supported by all servers.
     * If not provided we'll try to discover it, or otherwise default to /revoke
     */
    revocationEndpoint?: string;
    /**
     * OAuth 2.0 Authorization Server Metadata endpoint or OpenID
     * Connect Discovery 1.0 endpoint.
     *
     * If this endpoint is provided it can be used to automatically figure
     * out all the other endpoints.
     *
     * Usually the URL for this is: https://server/.well-known/oauth-authorization-server
     */
    discoveryEndpoint?: string;
    /**
     * Fetch implementation to use.
     *
     * Set this if you wish to explicitly set the fetch implementation, e.g. to
     * implement middlewares or set custom headers.
     */
    fetch?: typeof fetch;
    /**
     * Client authentication method that is used to authenticate
     * when using the token endpoint.
     *
     * Can be one of 'client_secret_basic' | 'client_secret_post'.
     *
     * The default value is 'client_secret_basic' if not provided.
     */
    authenticationMethod?: string;
}
type OAuth2Endpoint = 'tokenEndpoint' | 'authorizationEndpoint' | 'discoveryEndpoint' | 'introspectionEndpoint' | 'revocationEndpoint';
export declare class OAuth2Client {
    settings: ClientSettings;
    constructor(clientSettings: ClientSettings);
    /**
     * Refreshes an existing token, and returns a new one.
     */
    refreshToken(token: OAuth2Token, params?: RefreshParams): Promise<OAuth2Token>;
    /**
     * Retrieves an OAuth2 token using the client_credentials grant.
     */
    clientCredentials(params?: ClientCredentialsParams): Promise<OAuth2Token>;
    /**
     * Retrieves an OAuth2 token using the 'password' grant'.
     */
    password(params: PasswordParams): Promise<OAuth2Token>;
    /**
     * Returns the helper object for the `authorization_code` grant.
     */
    get authorizationCode(): OAuth2AuthorizationCodeClient;
    /**
     * Introspect a token
     *
     * This will give information about the validity, owner, which client
     * created the token and more.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc7662
     */
    introspect(token: OAuth2Token): Promise<IntrospectionResponse>;
    /**
     * Revoke a token
     *
     * This will revoke a token, provided that the server supports this feature.
     *
     * @see https://datatracker.ietf.org/doc/html/rfc7009
     */
    revoke(token: OAuth2Token, tokenTypeHint?: OAuth2TokenTypeHint): Promise<void>;
    /**
     * Returns a url for an OAuth2 endpoint.
     *
     * Potentially fetches a discovery document to get it.
     */
    getEndpoint(endpoint: OAuth2Endpoint): Promise<string>;
    private discoveryDone;
    private serverMetadata;
    /**
     * Fetches the OAuth2 discovery document
     */
    private discover;
    /**
     * Does a HTTP request on the 'token' endpoint.
     */
    request(endpoint: 'tokenEndpoint', body: RefreshRequest | ClientCredentialsRequest | PasswordRequest | AuthorizationCodeRequest): Promise<TokenResponse>;
    request(endpoint: 'introspectionEndpoint', body: IntrospectionRequest): Promise<IntrospectionResponse>;
    request(endpoint: 'revocationEndpoint', body: RevocationRequest): Promise<void>;
    /**
     * Converts the JSON response body from the token endpoint to an OAuth2Token type.
     */
    tokenResponseToOAuth2Token(resp: Promise<TokenResponse>): Promise<OAuth2Token>;
}
/**
 * Generates a query string.
 *
 * This function filters out any undefined values.
 */
export declare function generateQueryString(params: Record<string, undefined | number | string | string[]>): string;
export {};
