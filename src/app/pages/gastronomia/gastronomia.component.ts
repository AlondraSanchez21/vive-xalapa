import { Component } from '@angular/core';
import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-gastronomia',
  standalone: true,
  imports: [NgFor, NgIf, HttpClientModule, TitleCasePipe],
  templateUrl: './gastronomia.component.html',
  styleUrls: ['./gastronomia.component.css']
})
export class GastronomiaComponent {

  categorias = ['restaurantes', 'bares', 'cafeterias', 'tradicional'];
  gastronomia: any[] = [];
  filtrados: any[] = [];

  categoriaSeleccionada = 'restaurantes';

  constructor(private http: HttpClient) {
    this.cargarJSON();
  }

  cargarJSON() {
    this.http.get<any[]>('assets/data/gastronomia.json').subscribe({
      next: data => {
        this.gastronomia = data;
        this.filtrar(this.categoriaSeleccionada);
      },
      error: err => console.error('Error cargando JSON:', err)
    });
  }

  filtrar(tipo: string) {
    this.categoriaSeleccionada = tipo;
    this.filtrados = this.gastronomia.filter(item => item.tipo === tipo);
  }
}
