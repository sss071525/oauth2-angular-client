import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { PkceService } from './pkce.service';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authServerUrl = 'http://localhost:8080'; // Spring Authorization Server
  private loginApiUrl = 'http://localhost:8080/oauth2/login'; //
  private redirectUri = 'http://localhost:4200/callback';
  private tokenEndpoint = 'http://localhost:8080/oauth2/token'; // Replace with your token endpoint
  private authorizationEndpoint = 'http://localhost:8080/oauth2/authorize'; // Replace with your auth server URL
  private clientId = 'public-client';
  private customLoginApiUrl = 'http://localhost:8080/auth/token'; // ✅ Custom Login API
  codeVerifier = '';
  constructor(private http: HttpClient, private router: Router,private pkceService:PkceService) {}

  // ✅ Authenticate User via Custom API
  async login(username: string, password: string) {
    const loginPayload = { username, password };
    try {
      const response: any = await firstValueFrom(
        this.http.post(this.customLoginApiUrl, loginPayload)
      );
      localStorage.setItem('userData', JSON.stringify(response)); // Store tokens
      this.router.navigate(['/dashboard']); // Navigate to dashboard
    } catch (error) {
      console.error(error);
      alert("Something wrong with the login credentials");
    }
  }

  
  async loginWithOAuth2(): Promise<void> {
    this.codeVerifier = this.pkceService.generateCodeVerifier();
    localStorage.setItem('pkce_code_verifier', this.codeVerifier); // 👈 store before redirect
    const codeChallenge = await this.pkceService.generateCodeChallenge(this.codeVerifier);
    const params = new HttpParams()
      .set('response_type', 'code')
      .set('client_id', this.clientId)
      .set('redirect_uri', this.redirectUri)
      .set('code_challenge', codeChallenge)
      .set('code_challenge_method', 'S256')
      .set('scope', 'openid profile email'); // Add required scopes

    const authUrl = `${this.authorizationEndpoint}?${params.toString()}`;
    window.location.href = authUrl; // Redirect to the authorization server
  }

  // ✅ Logout User
  logout() {
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }

  // ✅ Check if User is Logged In
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  exchangeAuthorizationCode(code: string): void {
    let codeVerifier = localStorage.getItem('pkce_code_verifier');
    if (!codeVerifier) {
      alert("Missing PKCE code verifier");
      return;
    }
    localStorage.removeItem('pkce_code_verifier');
    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', this.clientId)
      .set('redirect_uri', this.redirectUri)
      .set('code', code)
      .set('code_verifier', codeVerifier);
    this.http.post<any>(this.tokenEndpoint, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).subscribe({
      next: (response) => {
        
        localStorage.setItem('userData', JSON.stringify(response)); // Store tokens in localStorage
        this.router.navigate(['/dashboard']); // Navigate to the dashboard
      },
      error: (err) => {
        console.error('Token exchange error:', err);
      }
    });
  }

  // ✅ Exchange Authorization Code for Access Token
  getAccessToken(authCode: string) {
    const url = `${this.authServerUrl}/oauth2/token`;

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', this.clientId)
      .set('redirect_uri', this.redirectUri)
      .set('code', authCode)
      .set('code_verifier', this.codeVerifier); // PKCE

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post(url, body.toString(), { headers }).subscribe((response: any) => {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      this.router.navigate(['/dashboard']); // ✅ Redirect after login
    });
  }

  // ✅ Refresh Access Token
  refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return;

    const url = `${this.authServerUrl}/oauth2/token`;
    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('client_id', this.clientId)
      .set('refresh_token', refreshToken);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post(url, body.toString(), { headers }).subscribe((response: any) => {
      localStorage.setItem('access_token', response.access_token);
    });
  }

}


