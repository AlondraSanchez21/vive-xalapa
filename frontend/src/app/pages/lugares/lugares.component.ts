import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf, DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { ResenasService } from '../../services/resenas.service';
import { FavoritosService } from '../../services/favoritos.service';

@Component({
  selector: 'app-lugares',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, HttpClientModule, FormsModule, DatePipe],
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

  // Reseñas
  resenas: any[] = [];
  showResenaForm: boolean = false;
  isLoggedIn: boolean = false;
  usuario: any = null;
  favoritosIds: string[] = [];
  resenaForm = { tipo: 'lugar', calificacion: 5, titulo: '', texto: '' };

  constructor(
    private http: HttpClient,
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
    this.loadResenasForLugar(lugar.id);
    this.showResenaForm = false;
    this.resenaForm = { tipo: 'lugar', calificacion: 5, titulo: '', texto: '' };
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.lugarSeleccionado = null;
    this.resenas = [];
  }

  loadResenasForLugar(lugarId: number) {
    this.resenasService.getResenas('lugar', lugarId).subscribe({
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
      tipo: 'lugar' as const,
      producto_id: this.lugarSeleccionado?.id,
      calificacion: this.resenaForm.calificacion,
      titulo: this.resenaForm.titulo,
      texto: this.resenaForm.texto
    };
    this.resenasService.createResena(resena).subscribe({
      next: () => {
        this.loadResenasForLugar(this.lugarSeleccionado?.id);
        this.showResenaForm = false;
        this.resenaForm = { tipo: 'lugar', calificacion: 5, titulo: '', texto: '' };
      },
      error: () => alert('Error al guardar el comentario')
    });
  }

  toggleFavorito(lugarId: any) {
    if (!this.isLoggedIn) {
      alert('Debes iniciar sesión para agregar favoritos');
      return;
    }
    
    const lugarIdStr = String(lugarId);
    if (this.favoritosIds.includes(lugarIdStr)) {
      this.favoritosService.eliminarFavorito(lugarIdStr).subscribe(
        () => console.log('Eliminado de favoritos'),
        (err) => console.error('Error:', err)
      );
    } else {
      this.favoritosService.agregarFavorito(lugarIdStr).subscribe(
        () => console.log('Agregado a favoritos'),
        (err) => console.error('Error:', err)
      );
    }
  }

  isFavorito(lugarId: any): boolean {
    return this.favoritosIds.includes(String(lugarId));
  }
}
