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

  errorMessage = signal('');
  successMessage = signal('');

  authService = inject(AuthService);

  // Inloggning
  login(): void {
    // nollställ tidigare meddelanden
    this.errorMessage.set('');
    this.successMessage.set('');

    const user: User = {
      email: this.email,
      password: this.password,
      created: new Date(),
    };

    this.authService.login(user).subscribe({
      next: () => {
        this.successMessage.set('Lyckad inloggning');
        this.email = '';
        this.password = '';
      },
      error: () => this.errorMessage.set('Felaktig epost/lösenord!'),
    });
  }
}
