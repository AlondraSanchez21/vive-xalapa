import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { ResenasService } from '../../services/resenas.service';
import { FavoritosService } from '../../services/favoritos.service';

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
  imports: [CommonModule, FormsModule, DatePipe],
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

  // Reseñas
  resenas: any[] = [];
  showResenaForm: boolean = false;
  isLoggedIn: boolean = false;
  usuario: any = null;
  favoritosIds: string[] = [];
  resenaForm = { tipo: 'gastronomia', calificacion: 5, titulo: '', texto: '' };

  constructor(
    private authService: AuthService,
    private resenasService: ResenasService,
    private favoritosService: FavoritosService
  ) {
    this.authService.isLoggedIn$.subscribe(logged => this.isLoggedIn = logged);
    this.authService.usuario$.subscribe(user => this.usuario = user);
    this.favoritosService.favoritos$.subscribe((favs: string[]) => {
      this.favoritosIds = favs;
    });
  }

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
    this.loadResenasForRestaurante(restaurante.id);
    this.showResenaForm = false;
    this.resenaForm = { tipo: 'gastronomia', calificacion: 5, titulo: '', texto: '' };
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.restauranteSeleccionado = null;
    this.resenas = [];
  }

  loadResenasForRestaurante(restauranteId: number) {
    this.resenasService.getResenas('gastronomia', restauranteId).subscribe({
      next: (data: any) => this.resenas = data,
      error: () => this.resenas = []
    });
  }

  addResena() {
    if (!this.resenaForm.titulo.trim() || !this.resenaForm.texto.trim()) {
      alert('Por favor completa todos los campos');
      return;
    }
    const resena: any = {
      usuario_id: this.usuario?.id,
      tipo: 'gastronomia' as const,
      producto_id: this.restauranteSeleccionado?.id || 0,
      calificacion: this.resenaForm.calificacion,
      titulo: this.resenaForm.titulo,
      texto: this.resenaForm.texto
    };
    this.resenasService.createResena(resena).subscribe({
      next: () => {
        this.loadResenasForRestaurante(this.restauranteSeleccionado?.id || 0);
        this.showResenaForm = false;
        this.resenaForm = { tipo: 'gastronomia', calificacion: 5, titulo: '', texto: '' };
      },
      error: () => alert('Error al guardar el comentario')
    });
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

  toggleFavorito(restauranteId: any) {
    if (!this.isLoggedIn) {
      alert('Debes iniciar sesión para agregar favoritos');
      return;
    }
    
    const restauranteIdStr = String(restauranteId);
    if (this.favoritosIds.includes(restauranteIdStr)) {
      this.favoritosService.eliminarFavorito(restauranteIdStr).subscribe(
        () => console.log('Eliminado de favoritos'),
        (err) => console.error('Error:', err)
      );
    } else {
      this.favoritosService.agregarFavorito(restauranteIdStr).subscribe(
        () => console.log('Agregado a favoritos'),
        (err) => console.error('Error:', err)
      );
    }
  }

  isFavorito(restauranteId: any): boolean {
    return this.favoritosIds.includes(String(restauranteId));
  }
}
