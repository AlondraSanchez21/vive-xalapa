import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViajesService, Viaje } from '../../services/viajes.service';
import { AuthService } from '../../services/auth/auth';
import { HttpClient } from '@angular/common/http';

interface CartItem {
  // support both viaje-based and flight-based items
  viaje?: Viaje;
  flight?: any;
  passengers?: number;
  cabin?: string;
  cantidad?: number;
  totalPrice: number;
}

@Component({
  selector: 'app-viaje',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './viaje.component.html',
  styleUrls: ['./viaje.component.css'],
})
export class ViajeComponent implements OnInit {
  viajes: Viaje[] = [];
  loading = true;
  filteredViajes: Viaje[] = [];

  // Filtros
  filtroOrigen = '';
  filtroDestino = '';
  isLoggedIn = false;

  // Modal
  mostrarModal = false;
  // For template compatibility (flights)
  vueloSeleccionado: any = null;

  // Carrito (template expects items with 'flight')
  cart: CartItem[] = [];
  cantidadSeleccionada = 1;
  // Search / form fields expected by template
  origin = 'Xalapa';
  airports: any[] = [
    { code: 'XAL', name: 'Xalapa Airport', city: 'Xalapa' },
    { code: 'VER', name: 'Veracruz Airport', city: 'Veracruz' },
    { code: 'MXL', name: 'Mexicali Airport', city: 'Mexicali' }
  ];
  destinationCode = '';
  dateFrom: string = '';
  dateTo: string = '';
  passengers: number = 1;
  cabin: string = 'Económica';
  results: any[] = [];

  constructor(
    private viajesService: ViajesService,
    public authService: AuthService,
    private http: HttpClient
  ) {
    this.loadCart();
  }

  ngOnInit() {
    this.loadViajes();
    this.authService.isLoggedIn$.subscribe(v => this.isLoggedIn = !!v);
    this.loadCart();
  }

  loadViajes() {
    this.loading = true;
    this.viajesService.getViajes().subscribe({
      next: (data) => {
        this.viajes = data;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando viajes:', err);
        this.loading = false;
      }
    });
  }

  aplicarFiltros() {
    this.filteredViajes = this.viajes.filter(v => {
      const origenMatch = !this.filtroOrigen || v.origen.toLowerCase().includes(this.filtroOrigen.toLowerCase());
      const destinoMatch = !this.filtroDestino || v.destino.toLowerCase().includes(this.filtroDestino.toLowerCase());
      return origenMatch && destinoMatch;
    });
  }

  limpiarFiltros() {
    this.filtroOrigen = '';
    this.filtroDestino = '';
    this.aplicarFiltros();
  }

  openDetail(viaje: Viaje) {
    // Map viaje to vuelo shape for the existing template
    this.vueloSeleccionado = {
      ...viaje,
      priceMXN: viaje.precioBase,
      depTime: viaje.hora || '08:00',
      arrTime: viaje.hora || '10:00',
      from: { city: viaje.origen, code: viaje.origen.slice(0,3).toUpperCase() },
      to: { city: viaje.destino, code: viaje.destino.slice(0,3).toUpperCase() },
      duration: viaje.duracion || viaje.duracion || '2h 00m',
      stops: 0,
      services: []
    };
    this.mostrarModal = true;
    this.cantidadSeleccionada = 1;
  }

  closeDetail() {
    this.mostrarModal = false;
    this.vueloSeleccionado = null;
  }

  addToCart() {
    if (!this.vueloSeleccionado) return;

    const totalPrice = (this.vueloSeleccionado.priceMXN || 0) * this.passengers;
    const item: CartItem = {
      flight: this.vueloSeleccionado,
      passengers: this.passengers,
      cabin: this.cabin,
      totalPrice: totalPrice
    };

    this.cart.push(item);
    this.saveCart();
    alert(`✓ ${this.vueloSeleccionado.airline || this.vueloSeleccionado.nombre} agregado al carrito`);
    this.closeDetail();
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.saveCart();
  }

  getTotalCart(): number {
    return this.cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  }

  sendOrder() {
    if (this.cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const order = {
      tipo: 'vuelos',
      vuelos: this.cart.map(i => ({
        flight: i.flight,
        passengers: i.passengers,
        cabin: i.cabin,
        precio: i.totalPrice
      })),
      totalMXN: this.getTotalCart(),
      fecha: new Date().toISOString()
    };

    this.http.post('http://localhost:3000/api/reservas', order).subscribe({
      next: (res:any) => {
        console.log('Orden enviada:', res);
        alert(`✓ Orden creada por $${this.getTotalCart()} MXN. Se enviarán los detalles al servidor.`);
        this.cart = [];
        this.saveCart();
      },
      error: (err) => {
        console.warn('No fue posible enviar la orden, guardando offline.', err);
        try { localStorage.setItem('vuelos_ordenes_offline', JSON.stringify([order])); } catch {}
        alert('Orden guardada en local; se enviará cuando el servidor esté disponible.');
        this.cart = [];
        this.saveCart();
      }
    });
  }

  saveCart(): void {
    try {
      localStorage.setItem('vuelos_cart', JSON.stringify(this.cart));
    } catch (e) {
      console.warn('No se pudo guardar carrito', e);
    }
  }

  loadCart(): void {
    try {
      const raw = localStorage.getItem('vuelos_cart');
      if (raw) this.cart = JSON.parse(raw);
    } catch {
      this.cart = [];
    }
  }

  getPriceWithDiscount(precio: number): number {
    if (this.isLoggedIn) {
      return Math.round(precio * 0.85); // 15% descuento
    }
    return precio;
  }
}

