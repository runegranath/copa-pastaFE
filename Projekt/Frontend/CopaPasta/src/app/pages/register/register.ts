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
    // Rensa tidigare meddelanden
    this.message.set('');
    // email måste vara minst 7 tecken
    if (this.email.length < 7) {
      this.message.set('E-post måste vara minst 7 tecken långt');
      return; 
    }

    if (this.password.length < 5) {
      this.message.set('Lösenordet måste vara minst 5 tecken långt och innehålla en siffra');
      return; 
    }

    // \d letar efter valfri siffra och .test() returnerar true om det finns en siffra i lösenordet
    const hasNumber = /\d/.test(this.password); 
    if (!hasNumber) {
      this.message.set('Lösenordet måste innehålla minst en siffra');
      return;
    }

    const user: User = {
      email: this.email,
      password: this.password,
      created: new Date(),
    };

    this.authService.register(user).subscribe({
      next: (res: RegisterResponse) => {
        this.message.set(res.message);
        this.email = '';
        this.password = ''; // Rensa formuläret efter registrering
      },
      error: (err) => this.message.set(err.error.message),
    });
  }
}
