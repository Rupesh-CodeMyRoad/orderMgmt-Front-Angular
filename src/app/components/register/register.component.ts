import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule], // Add CommonModule here
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user = { name: '', email: '', password: '', dateOfBirth: '' };
  profilePic: File | null = null;
  cv: File | null = null;
  profilePicError: string | null = null; // Ensure this property exists
  cvError: string | null = null; // Ensure this property exists

  constructor(private http: HttpClient, private router: Router) {}

  onFileSelected(event: any, field: 'profilePic' | 'cv') {
    const file = event.target.files[0];

    if (field === 'profilePic') {
      if (file && file.type !== 'image/jpeg') {
        this.profilePicError = 'Profile picture must be a JPEG file.';
        this.profilePic = null;
      } else {
        this.profilePicError = null;
        this.profilePic = file;
      }
    } else if (field === 'cv') {
      if (file && file.type !== 'application/pdf') {
        this.cvError = 'CV must be a PDF file.';
        this.cv = null;
      } else {
        this.cvError = null;
        this.cv = file;
      }
    }
  }

  register() {
    if (!this.profilePic || !this.cv) {
      alert('Please upload valid files before submitting.');
      return;
    }

    const formData = new FormData();
    // Append text fields
    formData.append('name', this.user.name);
    formData.append('email', this.user.email);
    formData.append('password', this.user.password);
    formData.append('dateOfBirth', this.user.dateOfBirth);

    // Append files
    if (this.profilePic) {
      formData.append('profilePic', this.profilePic);
    }
    if (this.cv) {
      formData.append('cv', this.cv);
    }
    formData.append('profilePic', this.profilePic);
    formData.append('cv', this.cv);

    this.http
      .post('http://localhost:8080/api/auth/register', formData, {
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          alert('Registration successful! Redirecting to OTP verification...');
          this.router.navigate(['/otp'], {
            queryParams: { email: this.user.email },
          });
        },
        error: () => alert('Registration failed! Please try again.'),
      });
  }
}
