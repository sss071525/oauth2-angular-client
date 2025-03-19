import { Component,OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './authConfig';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  username: string = '';
  password: string = '';
  
  constructor(private authService: AuthService,public oauthService:OAuthService) {}

  ngOnInit(): void {
    //this.oauthService.configure(authConfig);
   // this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    //this.oauthService.initCodeFlow(); // ✅ Redirects to Spring Authorization Server

    this.authService.login(this.username, this.password);
  }

  logout() {
    this.oauthService.logOut(); // ✅ Logs out user
  }

  get accessToken() {
    return this.oauthService.getAccessToken(); // ✅ Get access token after login
  }


}