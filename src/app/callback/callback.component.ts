import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: false,
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class CallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const authCode = params['code'];
      if (authCode) {
        alert("IN call abck");
        // this.authService.exchangeAuthorizationCodeForToken(authCode).subscribe(response => {
        //   console.log('Access Token:', response);
        //   this.router.navigate(['/']);
        // });
      }
    });
  }
}