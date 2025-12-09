import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showLogin = true;
  email = '';
  password = '';
  name = '';
  passwordReg = '';

  constructor(private router: Router) {}  // ← ahora funciona

  login() {
    if (this.email === 'test@test.com' && this.password === '123456') {
      alert('¡Login exitoso!');
      this.router.navigate(['/dashboard']);
    } else {
      alert('Usuario o contraseña incorrectos.');
    }
  }

  register() {
    if (!this.name || !this.email || !this.passwordReg) {
      alert('Completa todos los campos.');
      return;
    }
    alert(`Usuario ${this.name} registrado con éxito`);
    this.showLogin = true;
  }

  toggleForm() {
    this.showLogin = !this.showLogin;
  }
}
