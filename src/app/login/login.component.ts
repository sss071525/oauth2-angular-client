import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  isLoading = false;
  errorMessage = "";

constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.authService.getGeoLocationDetails();
    console.log(localStorage.getItem('geoLocationDetails'));
  }

  login() {
   // this.authService.login(this.username, this.password);
}

loginWithOAuth2(){
  this.authService.loginWithOAuth2();
}

}

