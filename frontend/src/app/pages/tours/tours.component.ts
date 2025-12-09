import { Component } from '@angular/core';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';   // ✅ FALATABA ESTO

@Component({
  selector: 'app-tours',
  standalone: true,
  imports: [NgFor, NgIf, HttpClientModule, TitleCasePipe],
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.css']
})
export class ToursComponent {

  tipos = ['cultural', 'aventura', 'natural', 'familiar'];

  tours: any[] = [];
  filtrados: any[] = [];

  tourSeleccionado: any = null;
  tipoActual = 'cultural';

  imagenActual: string | null = null;

  constructor(private http: HttpClient, private router: Router) {   // ✅ AQUÍ TAMBIÉN
    this.cargarTours();
  }

  cargarTours() {
    this.http.get<any[]>('/data/tours.json').subscribe({
      next: data => {
        this.tours = data;
        this.filtrar(this.tipoActual);
      },
      error: err => console.error("Error cargando tours", err)
    });
  }

  filtrar(tipo: string) {
    this.tipoActual = tipo;
    this.filtrados = this.tours.filter(t => t.tipo === tipo);
  }

  verDetalles(tour: any) {
    this.tourSeleccionado = tour;
    this.imagenActual = tour.galeria[0];
    document.body.style.overflow = 'hidden';
  }

  reservar() {
    this.router.navigate(['/tours/reservar', this.tourSeleccionado.id], {
      state: {
        tour: this.tourSeleccionado,
        cantidad: 1,
        fecha: ''
      }
    });
  }

  cambiarImagen(img: string) {
    this.imagenActual = img;
  }

  cerrarModal() {
    this.tourSeleccionado = null;
    this.imagenActual = null;
    document.body.style.overflow = 'auto';
  }
}
