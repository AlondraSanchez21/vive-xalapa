import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-lugares',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, HttpClientModule],
  templateUrl: './lugares.component.html',
  styleUrls: ['./lugares.component.css']
})
export class LugaresComponent implements OnInit {
  lugares: any[] = [];
  lugaresFiltrados: any[] = [];
  categoriaActual: string = 'todos';

  // Para el modal
  mostrarModal: boolean = false;
  lugarSeleccionado: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('assets/data/lugares.json').subscribe(data => {
      this.lugares = data;
      this.lugaresFiltrados = data;
    });
  }

  filtrar(categoria: string) {
    this.categoriaActual = categoria;
    this.lugaresFiltrados = categoria === 'todos' ? this.lugares : this.lugares.filter(l => l.categoria === categoria);
  }

  abrirModal(lugar: any) {
    this.lugarSeleccionado = lugar;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.lugarSeleccionado = null;
  }
}
