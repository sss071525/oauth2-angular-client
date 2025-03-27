import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class DeviceInfoService {

  private readonly DEVICE_ID_KEY = 'device_id';


  constructor() { }

  getDeviceMetadata(): DeviceMetadata {
    const deviceId = this.getOrCreateDeviceId();
    const userAgent = navigator.userAgent;
    const browser = this.getBrowserName(userAgent);
    const deviceType = /Mobi|Android/i.test(userAgent) ? 'Mobile' : 'Laptop/Desktop';
    const operatingSystem = this.getOSName();
    return {
      deviceId,
      userAgent,
      browser,
      deviceType,
      operatingSystem
    };
  }

  private getBrowserName(ua: string): string {
    if ((navigator as any).brave) return 'Brave'; // quick guess, not guaranteed
  
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('MSIE') || ua.includes('Trident')) return 'Internet Explorer';
  
    return 'Unknown';
  }

  private getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem(this.DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem(this.DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  }

  private getOSName() {
    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();

    if (platform.includes('win')) return 'Windows';
    if (platform.includes('mac')) return 'macOS';
    if (platform.includes('linux')) return 'Linux';
    if (/android/.test(userAgent)) return 'Android';
    if (/iphone|ipad|ipod/.test(userAgent)) return 'iOS';

    return 'Unknown';
  }
}

export interface DeviceMetadata {
  deviceId: string;
  userAgent: string;
  browser: string;
  deviceType: string;
  operatingSystem: string;
}


