import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  role: UserRole = 'user';

  constructor(private auth: AuthService, private router: Router) {}

  login(): void {
    const success = this.auth.login(this.username, this.password, this.role);
    if (success) {
      if (this.role === 'admin') {
        this.router.navigate(['/admin/bookings']);
      } else {
        this.router.navigate(['/user']);
      }
    } else {
      alert('Invalid credentials');
    }
  }
}


