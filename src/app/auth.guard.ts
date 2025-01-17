import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private http: HttpClient) {}

  canActivate(): Observable<boolean> {
    return this.http
      .get<boolean>('http://localhost:8080/api/auth/validate-session', {
        withCredentials: true, // Include cookies
      })
      .pipe(
        map((isAuthenticated) => {
          if (isAuthenticated) {
            return true; // Allow access
          } else {
            this.router.navigate(['/login']); // Redirect to login
            return false;
          }
        }),
        catchError(() => {
          this.router.navigate(['/login']); // Redirect on error
          return [false];
        })
      );
  }
}
