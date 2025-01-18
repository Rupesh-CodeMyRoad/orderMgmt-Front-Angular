import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OtpComponent implements OnInit {
  email: string | null = null;
  otp1: string = '';
  otp2: string = '';
  otp3: string = '';
  otp4: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || null;
    });
  }

  verifyOtp() {
    const otp = `${this.otp1}${this.otp2}${this.otp3}${this.otp4}`;
    if (this.email && otp.length === 4) {
      const url = `http://localhost:8080/api/auth/verify?email=${this.email}&otp=${otp}`;
      this.http.get(url, { withCredentials: true }).subscribe({
        next: () => {
          alert('OTP Verified....Redirecting to login page');
          this.router.navigate(['/login']);
        },
        error: () => alert('Invalid OTP. Please try again.'),
      });
    } else {
      alert('Please enter a valid 4-digit OTP.');
    }
  }
}
