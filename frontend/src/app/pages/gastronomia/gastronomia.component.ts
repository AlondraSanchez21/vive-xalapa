import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Restaurante {
  id: number;
  nombre: string;
  categoria: string;
  tipo: string;
  precio: string;
  imagen: string;
  rating: number;
  colonia: string;
  descripcion: string;
  telefono: string;
  horario: string;
  servicios: string[];
  tiposComida: string[];
  horariosDisponibles: string[];
  ubicacion?: {
    lat: number;
    lng: number;
  };
}

@Component({
  selector: 'app-gastronomia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gastronomia.component.html',
  styleUrls: ['./gastronomia.component.css']
})
export class GastronomiaComponent implements OnInit {
  
  restaurantes: Restaurante[] = [];
  filtrados: Restaurante[] = [];
  categorias: string[] = [];

  // Filtros
  filtroCategoria: string = '';
  filtroPrecio: string = '';
  buscador: string = '';

  // Modal
  mostrarModal = false;
  restauranteSeleccionado: Restaurante | null = null;

  loading = true;

  constructor() {}

  ngOnInit() {
    this.cargarRestaurantes();
  }

  // ===============================
  // CARGAR RESTAURANTES (JSON)
  // ===============================
  cargarRestaurantes() {
    this.loading = true;

    fetch('/data/restaurantes.json')
      .then(res => res.json())
      .then((data: Restaurante[]) => {
        this.restaurantes = data;

        // Sacar categorías únicas
        this.categorias = [...new Set(data.map(r => r.categoria))];

        this.filtrar();
        this.loading = false;
      })
      .catch(err => {
        console.error('Error cargando restaurantes:', err);
        this.loading = false;
      });
  }

  // ===============================
  // FILTROS
  // ===============================
  filtrar() {
    let result = [...this.restaurantes];

    // Filtrar por categoría
    if (this.filtroCategoria) {
      result = result.filter(r => r.categoria === this.filtroCategoria);
    }

    // Filtrar por precio
    if (this.filtroPrecio) {
      result = result.filter(r => r.precio === this.filtroPrecio);
    }

    // Buscador (nombre / descripción / colonia)
    const texto = this.buscador.trim().toLowerCase();

    if (texto.length > 0) {
      result = result.filter(r =>
        r.nombre.toLowerCase().includes(texto) ||
        r.descripcion.toLowerCase().includes(texto) ||
        r.colonia.toLowerCase().includes(texto)
      );
    }

    this.filtrados = result;
  }

  limpiarFiltros() {
    this.filtroCategoria = '';
    this.filtroPrecio = '';
    this.buscador = '';
    this.filtrar();
  }

  // ===============================
  // MODAL
  // ===============================
  abrirModal(restaurante: Restaurante) {
    this.restauranteSeleccionado = restaurante;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.restauranteSeleccionado = null;
  }

  abrirEnMaps() {
    if (!this.restauranteSeleccionado?.ubicacion) return;

    const { lat, lng } = this.restauranteSeleccionado.ubicacion;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      '_blank'
    );
  }

  agregarAlCarrito() {
    alert('Restaurante agregado al carrito');
  }
}
