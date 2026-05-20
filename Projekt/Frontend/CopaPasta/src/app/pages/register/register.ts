import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { RegisterResponse } from '../../models/register-response';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  email: string = '';
  password: string = '';

  message = signal('');

  authService = inject(AuthService);

  register(): void {
    const user: User = {
      email: this.email,
      password: this.password,
      created: new Date(),
    };

    this.authService.register(user).subscribe({
      next: (res: RegisterResponse) => {
        this.message.set(res.message)
        this.email = '';
        this.password = '';  // Rensa formuläret efter registrering
      },
      error: (err) => this.message.set(err.error.message),
    });
  }
}
