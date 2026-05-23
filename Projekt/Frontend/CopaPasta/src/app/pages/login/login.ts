import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';

  message = signal('');

  authService = inject(AuthService);

  // Inloggning
  login(): void {
    const user: User = {
      email: this.email,
      password: this.password,
      created: new Date(),
    };

    this.authService.login(user).subscribe({
      next: () => {
        this.message.set('Lyckad inloggning');
        this.email = '';
        this.password = '';
        },
      error: () => this.message.set('Felaktig epost/lösenord!'),
    });
  }
}
