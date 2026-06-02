import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RegisterResponse } from '../models/register-response';
import { User } from '../models/user';
import { LoginResponse } from '../models/login-response';
import { Login } from '../pages/login/login';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  url: string = 'http://localhost:3000/api';

  token = signal(localStorage.getItem('token') || '');
  isLoggedIn = computed(() => !!this.token()); // returnera true om token finns, annars false

  router = inject(Router);

  // Registrera konto
  register(user: User): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.url + '/register', user);
  }

  // Inloggning
  login(user: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url + '/login', user).pipe(
      // När vi får svaret, kör en tap
      tap((response) => {
        // spara token i signalen och localStorage
        this.token.set(response.token);
        localStorage.setItem('token', response.token);
      }),
    );
  }

  // Utloggning
  logout(): void {
    this.token.set(''); // Rensa token i signalen
    localStorage.removeItem('token'); // Ta bort token från localStorage
    this.router.navigate(['/']);
  }
}
