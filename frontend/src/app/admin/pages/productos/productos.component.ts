import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from '../../layout/admin-layout/admin-layout.component';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent],
  templateUrl: './productos.component.html'
})
export class ProductosComponent {
  productos = [
    { id: 1, name: 'Producto A' },
    { id: 2, name: 'Producto B' }
  ];
}
