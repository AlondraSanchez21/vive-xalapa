 import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { ResenasService, Resena } from '../../services/resenas.service';
import { FavoritosService } from '../../services/favoritos.service';
import { Usuario } from '../../models/usuario.model';

interface Hotel {
  id: string;
  name: string;
  location: string;
  priceMXN: number;
  description?: string;
  coords?: { lat: number; lng: number }; // para centrar mapa si quieres
  images?: string[]; // rutas de muestra
  rooms?: { id: string; name: string; priceMXN: number; beds: string }[];
}

interface Reservation {
  id: string;
  hotelId: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  roomType: string;
  name: string;
  email: string;
  phone: string;
  requests?: string;
  createdAt: string;
}

@Component({
  selector: 'app-hoteles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hoteles.component.html',
  styleUrls: ['./hoteles.component.css'],
})
export class HotelesComponent implements OnInit {
  // Expose Math for template
  Math = Math;
  
  // Lista de hoteles (mock) con imágenes, descripción, habitaciones y coords de ejemplo
  hotels: Hotel[] = [
    {
      id: 'h1',
      name: 'Colombe Hotel Boutique',
      location: 'Centro, Xalapa',
      priceMXN: 1200,
      description: 'Hotel boutique con jardín y piscina, cerca del centro histórico.',
      coords: { lat: 19.5429, lng: -96.9133 },
      images: ['/assets/h1-1.jpg', '/assets/h1-2.jpg'],
      rooms: [
        { id: 'r1', name: 'Habitación Estándar', priceMXN: 1200, beds: '1 Queen' },
        { id: 'r2', name: 'Suite', priceMXN: 2000, beds: '1 King' }
      ]
    },
    {
      id: 'h2',
      name: 'Holiday Inn Express Xalapa',
      location: 'Zona Universitaria',
      priceMXN: 1500,
      description: 'Confort moderno y desayuno incluido.',
      coords: { lat: 19.5333, lng: -96.9080 },
      images: ['/assets/h2-1.jpg', '/assets/h2-2.jpg'],
      rooms: [
        { id: 'r1', name: 'Estándar', priceMXN: 1500, beds: '2 Singles' },
        { id: 'r2', name: 'Familiar', priceMXN: 2400, beds: '2 Queens' }
      ]
    },
    {
      id: 'h3',
      name: 'Hotel Boutique Arenal',
      location: 'Arenal, Xalapa',
      priceMXN: 900,
      description: 'Pequeño hotel con ambiente acogedor.',
      coords: { lat: 19.5380, lng: -96.9200 },
      images: ['/assets/h3-1.jpg'],
      rooms: [
        { id: 'r1', name: 'Estándar', priceMXN: 900, beds: '1 Queen' }
      ]
    }
  ];

  // Municipios / zonas populares (modal)
  municipiosXalapa = [
    'Centro',
    'Arenal',
    'Zona Universitaria',
    'Revolución',
    'El Olmo',
    'Coatepec (cercano)',
    'Banderilla (cercano)',
    'Xico (cercano)'
  ];

  // Buscador
  destinationInput: string = 'Xalapa, Veracruz, México'; // valor por defecto mostrado
  selectedMunicipio: string = '';

  // Modal controls
  showMunicipiosModal: boolean = false;
  showHotelModal: boolean = false;       // detalle del hotel
  showReservaModal: boolean = false;     // formulario de reserva

  // Datos del hotel seleccionado para el modal
  activeHotel?: Hotel;
  activeImageIndex = 0;

  // Formulario de reservación (igual que antes)
  selectedHotelId: string = this.hotels[0].id;
  checkIn: string = '';
  checkOut: string = '';
  guests: number = 1;
  rooms: number = 1;
  roomType: string = 'Estándar';
  clientName: string = '';
  clientEmail: string = '';
  clientPhone: string = '';
  requests: string = '';

  // Reservas guardadas
  reservations: Reservation[] = [];

  // Reseñas (comentarios y calificaciones)
  resenas: Resena[] = [];
  showResenaForm: boolean = false;
  resenaForm: Partial<Resena> = {
    tipo: 'hotel',
    calificacion: 5,
    texto: '',
    titulo: ''
  };

  // Estado auth
  isLoggedIn: boolean = false;
  usuario: Usuario | null = null;

  // Promociones dinámicas (puede venir del backend más adelante)
  promos = [
    { key: 'none', label: 'Sin promoción', percent: 0 },
    { key: 'dia', label: 'Promoción del día', percent: 15 },
    { key: 'agua', label: 'Promo Agua (ejemplo)', percent: 20 },
    { key: 'socios', label: 'Descuento socios', percent: 20 }
  ];

  currentPromo = this.promos[0];

  // Favoritos
  favoritosIds: string[] = [];

  // Constructor
  constructor(private authService: AuthService, private resenasService: ResenasService, private favoritosService: FavoritosService) {
    this.loadReservations();

    // suscribir estado de auth para descuentos y UI
    this.authService.isLoggedIn$.subscribe(v => this.isLoggedIn = !!v);
    this.authService.usuario$.subscribe(u => this.usuario = u);
    
    // Load favoritos
    this.favoritosService.favoritos$.subscribe((favs: string[]) => {
      this.favoritosIds = favs;
    });
  }

  ngOnInit() {
    // cerrar modales locales cuando se abra el modal de auth (evita stacking/z-index issues)
    try {
      window.addEventListener('app:auth-open', () => {
        this.showHotelModal = false;
        this.showReservaModal = false;
        this.showMunicipiosModal = false;
      });
    } catch {}
  }

  loadResenasForHotel(hotelId: string) {
    const hotelIdNum = parseInt(hotelId.replace('h', ''), 10) || 1;
    this.resenasService.getResenas('hotel', hotelIdNum).subscribe({
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
    const hotelId = parseInt(this.selectedHotelId.replace('h', ''), 10) || 1;
    const resena: Resena = {
      usuario_id: parseInt(this.usuario.id as string) || 0,
      tipo: 'hotel',
      producto_id: hotelId,
      calificacion: this.resenaForm.calificacion || 5,
      titulo: this.resenaForm.titulo || 'Sin título',
      texto: this.resenaForm.texto || ''
    };
    this.resenasService.createResena(resena).subscribe({
      next: () => {
        this.loadResenasForHotel(this.selectedHotelId);
        this.resenaForm = { tipo: 'hotel', calificacion: 5, texto: '', titulo: '' };
        this.showResenaForm = false;
        alert('Comentario agregado exitosamente');
      },
      error: (err) => console.error('Error al crear reseña:', err)
    });
  }

  setPromo(key: string) {
    const p = this.promos.find(x => x.key === key);
    if (p) this.currentPromo = p;
  }

  /* ***********************
     Métodos de UI / modales
     *************************/

  openMunicipiosIfXalapa() {
    if (this.destinationInput && this.destinationInput.toLowerCase().includes('xalapa')) {
      this.showMunicipiosModal = true;
    }
  }

  selectMunicipio(m: string) {
    this.selectedMunicipio = m;
    this.destinationInput = `Xalapa, ${m}, México`;
    this.showMunicipiosModal = false;
  }
  closeMunicipiosModal() { this.showMunicipiosModal = false; }

  // Abrir modal de detalle de hotel (desde la tarjeta / imagen)
  openHotelModal(hotelId: string) {
    const h = this.hotels.find(x => x.id === hotelId);
    if (!h) return;
    this.activeHotel = h;
    this.activeImageIndex = 0;
    this.showHotelModal = true;
    this.loadResenasForHotel(hotelId);
  }

  closeHotelModal() {
    this.showHotelModal = false;
    this.activeHotel = undefined;
  }

  // Avanza/retrocede imágenes
  prevImage() {
    if (!this.activeHotel || !this.activeHotel.images) return;
    this.activeImageIndex = (this.activeImageIndex - 1 + this.activeHotel.images.length) % this.activeHotel.images.length;
  }
  nextImage() {
    if (!this.activeHotel || !this.activeHotel.images) return;
    this.activeImageIndex = (this.activeImageIndex + 1) % this.activeHotel.images.length;
  }

  // Desde el modal de hotel abrir el formulario de reserva, y precargar el hotel
  openReservaFromHotel() {
    if (!this.activeHotel) return;
    this.selectedHotelId = this.activeHotel.id;
    // opcional: prellenar location con la ubicación activa
    this.destinationInput = `${this.activeHotel.location}`;
    this.showReservaModal = true;
  }

  closeReservaModal() {
    this.showReservaModal = false;
  }

  /* ***********************
     Funciones de reserva (igual que antes)
     *************************/

  reservar() {
    // validaciones básicas
    if (!this.checkIn || !this.checkOut || !this.clientName || !this.clientEmail) {
      window.alert('Por favor completa los campos requeridos (fechas y datos de contacto).');
      return;
    }

    const hotel = this.hotels.find(h => h.id === this.selectedHotelId)!;
    const res: Reservation = {
      id: 'r_' + Date.now(),
      hotelId: hotel.id,
      hotelName: hotel.name,
      location: this.destinationInput,
      checkIn: this.checkIn,
      checkOut: this.checkOut,
      guests: this.guests,
      rooms: this.rooms,
      roomType: this.roomType,
      name: this.clientName,
      email: this.clientEmail,
      phone: this.clientPhone,
      requests: this.requests,
      createdAt: new Date().toISOString()
    };

    this.reservations.push(res);
    this.saveReservations();
    this.resetForm();
    this.showReservaModal = false;
    this.closeHotelModal();
    window.alert(`Reserva creada:\n${hotel.name}\n${res.checkIn} → ${res.checkOut}`);
  }

  /** Devuelve precio y descuento aplicado según usuario */
  getPriceWithDiscount(h: Hotel) {
    const original = h.priceMXN;
    // promocion global (por ejemplo 'Promoción del día' o 'Promo Agua')
    // la promoción global sólo aplica si el usuario está logueado
    const promoPercent = this.isLoggedIn ? (this.currentPromo?.percent || 0) : 0;
    // descuento adicional por usuario (si tiene uno explícito)
    const descuentoUsuario = (this.usuario as any)?.descuentoAplicado as number | undefined;
    const userPercent = typeof descuentoUsuario === 'number' ? descuentoUsuario : (this.isLoggedIn ? 10 : 0);

    // Regla: aplicamos la promoción global y sumamos descuento de usuario, con tope 50%
    let discountPercent = promoPercent + userPercent;
    if (discountPercent > 50) discountPercent = 50;

    const finalPrice = Math.round(original * (1 - discountPercent / 100));
    return { original, discountPercent, finalPrice, promoPercent, userPercent };
  }

  // Save / load
  saveReservations(): void {
    try {
      localStorage.setItem('hoteles_reservas', JSON.stringify(this.reservations));
    } catch (e) {
      console.warn('No se pudo guardar reservaciones', e);
    }
  }

  loadReservations(): void {
    try {
      const raw = localStorage.getItem('hoteles_reservas');
      if (raw) this.reservations = JSON.parse(raw);
    } catch {
      this.reservations = [];
    }
  }

  resetForm(): void {
    this.checkIn = '';
    this.checkOut = '';
    this.guests = 1;
    this.rooms = 1;
    this.roomType = 'Estándar';
    this.clientName = '';
    this.clientEmail = '';
    this.clientPhone = '';
    this.requests = '';
    // conservar destinationInput
  }

  removeReservation(idx: number) {
    this.reservations.splice(idx, 1);
    this.saveReservations();
  }

  toggleFavorito(hotelId: string) {
    if (!this.isLoggedIn) {
      alert('Debes iniciar sesión para agregar favoritos');
      return;
    }
    
    if (this.favoritosIds.includes(hotelId)) {
      this.favoritosService.eliminarFavorito(hotelId).subscribe(
        () => console.log('Eliminado de favoritos'),
        (err) => console.error('Error:', err)
      );
    } else {
      this.favoritosService.agregarFavorito(hotelId).subscribe(
        () => console.log('Agregado a favoritos'),
        (err) => console.error('Error:', err)
      );
    }
  }

  isFavorito(hotelId: string): boolean {
    return this.favoritosIds.includes(hotelId);
  }
}
