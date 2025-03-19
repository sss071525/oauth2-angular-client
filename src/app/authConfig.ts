import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:9000', // ✅ Spring Authorization Server URL
  clientId: 'angular-client', // ✅ Must match Spring Boot `clientId`
  redirectUri: 'http://localhost:4200/callback', // ✅ Must match Spring Boot `redirectUri`
  responseType: 'code', // ✅ Use Authorization Code Flow
  scope: 'openid+profile', // ✅ Ensure these scopes match Spring Boot
  strictDiscoveryDocumentValidation: false, // ✅ Allow local authorization server
  useHttpBasicAuth: false,
  showDebugInformation: true, // ✅ Debug logs in the console
  requireHttps: false, // ✅ Only for local development
  disablePKCE: false // ✅ Enable PKCE for security
};
