import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  dropdownDescubrir = false;
  dropdownReservar = false;
  
  // Modal de login/registro
  mostrarModalAuth = false;
  modoRegistro = false;
  usuarioLogueado: Usuario | null = null;
  
  // Formulario
  email = '';
  password = '';
  nombre = '';
  apellido = '';
  telefono = '';
  
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.usuario$.subscribe(usuario => {
      this.usuarioLogueado = usuario;
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  openDescubrir() {
    this.dropdownDescubrir = true;
  }

  closeDescubrir() {
    this.dropdownDescubrir = false;
  }

  openReservar() {
    this.dropdownReservar = true;
  }

  closeReservar() {
    this.dropdownReservar = false;
  }

  abrirModalLogin() {
    this.mostrarModalAuth = true;
    this.modoRegistro = false;
    this.limpiarFormulario();
    // notificar a la app que se abrió el modal de auth para que otros modales se cierren
    try { window.dispatchEvent(new CustomEvent('app:auth-open')); } catch {}
  }

  abrirModalRegistro() {
    this.mostrarModalAuth = true;
    this.modoRegistro = true;
    this.limpiarFormulario();
    try { window.dispatchEvent(new CustomEvent('app:auth-open')); } catch {}
  }

  cerrarModal() {
    this.mostrarModalAuth = false;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.email = '';
    this.password = '';
    this.nombre = '';
    this.apellido = '';
    this.telefono = '';
  }

  iniciarSesion() {
    if (!this.email || !this.password) {
      alert('Por favor completa email y contraseña');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        alert('✓ Inicio de sesión exitoso');
        this.cerrarModal();
        this.menuOpen = false;
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        alert('✗ Email o contraseña incorrectos');
      }
    });
  }

  registrarse() {
    if (!this.nombre || !this.apellido || !this.email || !this.password) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const nuevoUsuario: Usuario = {
      id: 'u_' + Date.now(),
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      contrasena: this.password,
      fotoPerfil: 'https://via.placeholder.com/150',
      fechaRegistro: new Date(),
      ciudad: ''
    };

    this.authService.register(nuevoUsuario, this.password).subscribe({
      next: (response) => {
        alert('✓ Registro exitoso. Por favor inicia sesión');
        this.modoRegistro = false;
        this.limpiarFormulario();
      },
      error: (err) => {
        console.error('Error al registrar:', err);
        alert('✗ Error al registrar usuario');
      }
    });
  }

  cerrarSesion() {
    this.authService.logout();
    this.usuarioLogueado = null;
  }
}
