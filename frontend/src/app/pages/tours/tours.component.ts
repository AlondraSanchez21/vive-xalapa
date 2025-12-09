import { Component } from '@angular/core';
import { NgFor, NgIf, TitleCasePipe, DatePipe, NgClass } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { ResenasService, Resena } from '../../services/resenas.service';
import { FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'app-tours',
  standalone: true,
  imports: [NgFor, NgIf, HttpClientModule, TitleCasePipe, DatePipe, FormsModule, NgClass],
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

  // Reseñas
  resenas: Resena[] = [];
  showResenaForm: boolean = false;
  isLoggedIn: boolean = false;
  usuario: any = null;
  favoritosIds: string[] = [];
  resenaForm: Partial<Resena> = {
    tipo: 'tour',
    calificacion: 5,
    texto: '',
    titulo: ''
  };

  // Reserva modal state
  showDisponibilidad: boolean = false;
  cantidadSeleccionada: number = 1;
  fechaSeleccionada: string = '';
  clienteNombre: string = '';
  clienteApellido: string = '';
  clienteTelefono: string = '';
  clienteEmail: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private resenasService: ResenasService, private favoritosService: FavoritosService) {
    this.cargarTours();
    this.authService.isLoggedIn$.subscribe(v => this.isLoggedIn = !!v);
    this.authService.usuario$.subscribe(u => this.usuario = u);
    this.favoritosService.favoritos$.subscribe((favs: string[]) => {
      this.favoritosIds = favs;
    });
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
    this.loadResenasForTour(tour.id);
    document.body.style.overflow = 'hidden';
  }

  loadResenasForTour(tourId: any) {
    const tourIdNum = parseInt(tourId, 10) || 1;
    this.resenasService.getResenas('tour', tourIdNum).subscribe({
      next: (data) => this.resenas = data,
      error: (err) => console.log('Error cargando reseñas:', err)
    });
  }

  addResena() {
    if (!this.isLoggedIn || !this.usuario) {
      alert('Debes iniciar sesión para comentar');
      return;
    }
    if (!this.resenaForm.texto) {
      alert('El comentario no puede estar vacío');
      return;
    }
    const tourId = parseInt(this.tourSeleccionado.id, 10) || 1;
    const resena: Resena = {
      usuario_id: parseInt(this.usuario.id) || 0,
      tipo: 'tour',
      producto_id: tourId,
      calificacion: this.resenaForm.calificacion || 5,
      titulo: this.resenaForm.titulo || 'Sin título',
      texto: this.resenaForm.texto || ''
    };
    this.resenasService.createResena(resena).subscribe({
      next: () => {
        this.loadResenasForTour(tourId);
        this.resenaForm = { tipo: 'tour', calificacion: 5, texto: '', titulo: '' };
        this.showResenaForm = false;
        alert('Comentario agregado exitosamente');
      },
      error: (err) => console.error('Error al crear reseña:', err)
    });
  }

  reservar() {
    // Mostrar el panel de disponibilidad dentro del modal en lugar de navegar
    this.showDisponibilidad = true;
    this.cantidadSeleccionada = 1;
    this.fechaSeleccionada = '';
  }

  cancelarDisponibilidad() {
    this.showDisponibilidad = false;
  }

  confirmarReserva() {
    if (!this.fechaSeleccionada) {
      alert('Selecciona una fecha para continuar');
      return;
    }
    const reserva = {
      id_tour: this.tourSeleccionado.id,
      tour: this.tourSeleccionado.nombre,
      cantidad: this.cantidadSeleccionada,
      fecha: this.fechaSeleccionada,
      cliente: {
        nombre: this.clienteNombre,
        apellido: this.clienteApellido,
        telefono: this.clienteTelefono,
        email: this.clienteEmail
      },
      total: (this.tourSeleccionado.precio || 0) * this.cantidadSeleccionada
    };

    // Navegar a la pantalla de confirmación con el objeto reserva en el estado
    this.router.navigate(['/tours/confirmacion'], { state: { reserva } });
    this.cerrarModal();
  }

  abrirPaginaReserva() {
    // Abrir la página de reserva completa si el usuario así lo desea
    this.router.navigate(['/tours/reservar', this.tourSeleccionado.id], {
      state: { tour: this.tourSeleccionado, fecha: this.fechaSeleccionada || '', cantidad: this.cantidadSeleccionada }
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

  toggleFavorito(tourId: any) {
    if (!this.isLoggedIn) {
      alert('Debes iniciar sesión para agregar favoritos');
      return;
    }
    
    const tourIdStr = String(tourId);
    if (this.favoritosIds.includes(tourIdStr)) {
      this.favoritosService.eliminarFavorito(tourIdStr).subscribe(
        () => console.log('Eliminado de favoritos'),
        (err) => console.error('Error:', err)
      );
    } else {
      this.favoritosService.agregarFavorito(tourIdStr).subscribe(
        () => console.log('Agregado a favoritos'),
        (err) => console.error('Error:', err)
      );
    }
  }

  isFavorito(tourId: any): boolean {
    return this.favoritosIds.includes(String(tourId));
  }
}
