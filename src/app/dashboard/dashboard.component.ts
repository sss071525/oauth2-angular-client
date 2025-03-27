import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DeviceInfoService } from '../services/device-info.service';

AuthService
@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService,private deviceInfoService:DeviceInfoService) { }
  userData: any = {}; // Store user data
  devices: any[] = [];

  ngOnInit(): void {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      this.userData = JSON.parse(storedData);
    }
    this.deviceInfoService.getDevices().subscribe(data => this.devices = data);

  }

  logout(): void {
   this.authService.logout();
    
  }

  logoutByDeviceId(device: any) {
    if(device.currentSession){
      alert("You cannot delete the current session");
    }else{
      let authorizationId = device.authorizationId;
      this.deviceInfoService.logoutDevice(authorizationId).subscribe(() => {
        this.devices = this.devices.filter(d => d.authorizationId !== authorizationId);
      });
    }
    
  }

  getBrowserIcon(browser: string): string {
    const lower = browser.toLowerCase();
  
    if (lower.includes('chrome')) return 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googlechrome.svg';
    if (lower.includes('firefox')) return 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/firefoxbrowser.svg';
    if (lower.includes('edge')) return 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoftedge.svg';
    if (lower.includes('safari')) return 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/safari.svg';
    if (lower.includes('brave')) return 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/brave.svg';
    return 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/internetexplorer.svg';
  }
  
    
}
