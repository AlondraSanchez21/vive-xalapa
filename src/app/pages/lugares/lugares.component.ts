import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-lugares',
  standalone: true,
  imports: [NgFor, HttpClientModule],
  templateUrl: './lugares.component.html',
  styleUrls: ['./lugares.component.css']
})
export class LugaresComponent {

  lugares: any[] = [];
  lugaresFiltrados: any[] = [];

  constructor(private http: HttpClient) {
    this.cargarLugares();
  }

  cargarLugares() {
    this.http.get<any[]>('assets/data/lugares.json').subscribe(data => {
      this.lugares = data;
      this.lugaresFiltrados = data;
    });
  }

  filtrar(categoria: string) {
    if (categoria === 'todos') {
      this.lugaresFiltrados = this.lugares;
    } else {
      this.lugaresFiltrados = this.lugares.filter(l => l.categoria === categoria);
    }
  }
}
