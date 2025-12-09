import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reservar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reservar.component.html',
  styleUrls: ['./reservar.component.css']
})
export class ReservarComponent {

  tour: any;
  cantidad = 1;
  fecha = '';

  nombre = '';
  apellidos = '';
  telefono = '';
  correo = '';
  comentarios = '';

  constructor(
    private router: Router,
    private http: HttpClient   // <-- IMPORTANTE PARA ENVIAR DATOS
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state;

    if (state) {
      this.tour = state['tour'];
      this.cantidad = state['cantidad'];
      this.fecha = state['fecha'];   // fecha que viene desde el tour
    }
  }

  calcularTotal() {
    if (!this.tour) return 0;
    return this.tour.precio * this.cantidad;
  }

  enviar() {

    // Validación simple
    if (!this.nombre || !this.apellidos || !this.telefono || !this.correo || !this.fecha) {
      alert("Por favor llena todos los campos obligatorios.");
      return;
    }

    const reserva = {
      id_tour: this.tour.id,
      tour: this.tour.nombre,
      fecha: this.fecha,
      cantidad: this.cantidad,
      total: this.calcularTotal(),
      nombre: this.nombre,
      apellidos: this.apellidos,
      telefono: this.telefono,
      correo: this.correo,
      comentarios: this.comentarios,
      fechaCreacion: new Date().toISOString()
    };

    // Intentar enviar al backend; si falla, guardar localmente y redirigir a página de confirmación
    this.http.post('http://localhost:3000/api/reservas', reserva).subscribe({
      next: (res: any) => {
        console.log("Respuesta del servidor:", res);
        try{ localStorage.setItem('ultima_reserva', JSON.stringify(reserva)); }catch{}
        this.router.navigate(['/tours/confirmacion'], { state: { reserva } });
      },
      error: (err) => {
        console.warn("No fue posible enviar al servidor, guardando localmente.", err);
        try{ localStorage.setItem('reservas_offline', JSON.stringify([...(JSON.parse(localStorage.getItem('reservas_offline')||'[]')), reserva])); localStorage.setItem('ultima_reserva', JSON.stringify(reserva)); }catch{}
        this.router.navigate(['/tours/confirmacion'], { state: { reserva } });
      }
    });
  }
}
