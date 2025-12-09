import { Component } from '@angular/core';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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

  constructor(private http: HttpClient) {
    this.cargarTours();
  }

  cargarTours() {
    this.http.get<any[]>('assets/data/tours.json').subscribe({
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
  }

  cerrarModal() {
    this.tourSeleccionado = null;
  }
}
