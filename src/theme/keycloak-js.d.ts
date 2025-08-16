declare module "keycloak-js" {
  export interface KeycloakConfig {
    url: string;
    realm: string;
    clientId: string;
  }

  export interface KeycloakInitOptions {
    onLoad?: "login-required" | "check-sso";
    silentCheckSsoRedirectUri?: string;
    flow?: "standard" | "implicit" | "hybrid";
    pkceMethod?: "S256";
  }

  export default class Keycloak {
    constructor(config?: KeycloakConfig);
    init(options?: KeycloakInitOptions): Promise<boolean>;
    login(): Promise<void>;
    logout(options?: { redirectUri?: string }): Promise<void>;
    token?: string;
    tokenParsed?: any;
    authenticated?: boolean;
    subject?: string;
    realmAccess?: { roles: string[] };
    resourceAccess?: Record<string, any>;
    updateToken(minValidity: number): Promise<boolean>;
    clearToken(): void;
    onTokenExpired?: () => void;
  }
}
