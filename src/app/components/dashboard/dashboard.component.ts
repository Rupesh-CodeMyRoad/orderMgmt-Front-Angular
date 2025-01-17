import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  isAdmin = false;
  isUser = false;
  userName = '';
  profilePicture = '';
  nonAdminUsers: { name: string; email: string; role: string }[] = []; // Array for non-admin users

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    this.isAdmin = roles.includes('ROLE_ADMIN');
    this.isUser = roles.includes('ROLE_USER');

    // Fetch user details
    this.http
      .get<{ name: string; profilePicUrl: string }>(
        'http://localhost:8080/api/public/getDetail',
        { withCredentials: true }
      )
      .subscribe({
        next: (response) => {
          this.userName = response.name;
          this.profilePicture = response.profilePicUrl;
        },
        error: () => {
          alert('Failed to load user details.');
        },
      });

    // Fetch all users excluding admins (only for admins)
    if (this.isAdmin) {
      this.http
        .get<{ name: string; email: string; role: string }[]>(
          'http://localhost:8080/api/public/users',
          { withCredentials: true }
        )
        .subscribe({
          next: (users) => {
            this.nonAdminUsers = users.filter((user) => user.role !== 'ADMIN');
          },
          error: () => {
            alert('Failed to load users.');
          },
        });
    }
  }

  navigateToCustomerDetails() {
    this.router.navigate(['/customer']);
  }

  logout() {
    this.http
      .post(
        'http://localhost:8080/api/auth/logout',
        {},
        { withCredentials: true }
      )
      .subscribe({
        next: () => {
          localStorage.removeItem('roles'); // Clear stored roles
          this.router.navigate(['/login']); // Redirect to login page
        },
        error: () => alert('Logout failed'),
      });
  }
}
