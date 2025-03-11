import { Component } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  user = { username: '', email: '', password: '' };
  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.user).subscribe(
      response => alert('Registration Successful'),
      error => alert('User already exists')
    );
    localStorage.setItem('token', 'user123');
    this.router.navigate(['/app/home']);
  }
}
