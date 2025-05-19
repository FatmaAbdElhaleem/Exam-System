import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.authService.saveUser(response.user);
        this.router.navigate(['/exams']);
      },
      error: (err) => {
        this.error = err.error.msg || 'Registration failed';
      },
    });
  }
}