import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from '../../layout/admin-layout/admin-layout.component';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent {
  usuarios = [
    { id: 1, name: 'Usuario 1' },
    { id: 2, name: 'Usuario 2' }
  ];
}
