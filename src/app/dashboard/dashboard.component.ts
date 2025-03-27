import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
AuthService
@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService) { }
  userData: any = {}; // Store user data
  ngOnInit(): void {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      this.userData = JSON.parse(storedData);
    }
  }

  logout(): void {
   this.authService.logout();
    
  }
    
}
