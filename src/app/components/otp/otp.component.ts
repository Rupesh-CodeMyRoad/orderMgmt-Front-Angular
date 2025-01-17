import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OtpComponent implements OnInit {
  email: string | null = null;
  otp: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || null; // Validate and handle undefined
    });
  }

  verifyOtp() {
    console.log('Email:', this.email);
    console.log('OTP:', this.otp);
    if (this.email && this.otp) {
      const url = `http://localhost:8080/api/auth/verify?email=${this.email}&otp=${this.otp}`;
      this.http.get(url, { withCredentials: true }).subscribe({
        next: () => {
          alert('OTP Verified....Redirecting to login page');
          this.router.navigate(['/login']); // Correct target for navigation
        },
        error: () => alert('Invalid OTP. Please try again.'),
      });
    } else {
      alert('Please enter a valid OTP.');
    }
  }
}
