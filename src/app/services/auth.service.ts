import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authServerUrl = 'http://localhost:9000'; // Spring Authorization Server
  private loginApiUrl = 'http://localhost:9000/auth/login'; // ✅ Custom Login API
  private redirectUri = 'http://localhost:4200/callback';
  private clientId = 'angular-client';

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Authenticate User via Custom API
  login(username: string, password: string) {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    this.http.post(this.loginApiUrl, body.toString(), { headers, responseType: 'text' }).subscribe((response: any) => {
      window.location.href = response; // ✅ Redirect to Authorization Code Flow
    });
  }

  // ✅ Exchange Authorization Code for Access Token
  getAccessToken(authCode: string) {
    const url = `${this.authServerUrl}/oauth2/token`;

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', 'angular-client')
      .set('redirect_uri', this.redirectUri)
      .set('code', authCode)
      .set('code_verifier', 'your_generated_verifier'); // PKCE

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
      .set('client_id', 'angular-client')
      .set('refresh_token', refreshToken);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post(url, body.toString(), { headers }).subscribe((response: any) => {
      localStorage.setItem('access_token', response.access_token);
    });
  }

  // ✅ Logout User
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }

  // ✅ Check if User is Logged In
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}


