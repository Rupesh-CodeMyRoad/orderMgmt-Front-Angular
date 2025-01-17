import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    this.http
      .post<{ roles: string[] }>(
        'http://localhost:8080/api/auth/login',
        { email: this.email, password: this.password },
        { withCredentials: true }
      )
      .subscribe({
        next: (response) => {
          const roles = response.roles; // Extract roles from the response
          localStorage.setItem('roles', JSON.stringify(roles)); // Store roles for later use
          this.router.navigate(['/dashboard']); // Redirect to the common dashboard
        },
        error: () => alert('Invalid credentials'),
      });
  }

  redirectToRegister() {
    this.router.navigate(['/register']); // Navigate to the registration page
  }
}
