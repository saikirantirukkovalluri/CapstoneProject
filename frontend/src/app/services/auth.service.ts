import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'user' | 'admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isAuthenticated = false;
  private _role: UserRole | null = null;

  constructor(private router: Router) {}

  login(username: string, password: string, role: UserRole): boolean {
    // Mock validation
    if (username && password) {
      this._isAuthenticated = true;
      this._role = role;
      return true;
    }
    return false;
  }

  logout(): void {
    this._isAuthenticated = false;
    this._role = null;
    this.router.navigate(['/']);
  }

  get isAuthenticated(): boolean { return this._isAuthenticated; }
  get role(): UserRole | null { return this._role; }
}







