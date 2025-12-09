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
  origin = 'XAL';
  airports: any[] = [
    { code: 'XAL', name: 'Xalapa Airport', city: 'Xalapa' },
    { code: 'VER', name: 'Veracruz Airport', city: 'Veracruz' },
    { code: 'MEX', name: 'Ciudad de México - Benito Juárez', city: 'Ciudad de México' },
    { code: 'GDL', name: 'Guadalajara - Miguel Hidalgo', city: 'Guadalajara' },
    { code: 'MTY', name: 'Monterrey - Mariano Escobedo', city: 'Monterrey' },
    { code: 'CUN', name: 'Cancún International', city: 'Cancún' },
    { code: 'MXL', name: 'Mexicali Airport', city: 'Mexicali' },
    { code: 'HUX', name: 'Huatulco - Bahías de Huatulco', city: 'Huatulco' },
    { code: 'TAM', name: 'Tampico International', city: 'Tampico' },
    { code: 'BJX', name: 'León - Bajío International', city: 'León' }
  ];
  // Destinos disponibles: solo Veracruz y Xalapa
  destinationAirports: any[] = [
    { code: 'XAL', name: 'Xalapa Airport', city: 'Xalapa' },
    { code: 'VER', name: 'Veracruz Airport', city: 'Veracruz' }
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

  buscar() {
    // Validar selección
    if (!this.origin || !this.destinationCode) {
      alert('Por favor selecciona un origen y destino');
      return;
    }

    // Vuelos de ejemplo hardcoded
    const vuelosPorDefecto = [
      {
        id: 1,
        airline: "ViveAir",
        depTime: "07:30",
        arrTime: "09:10",
        from: { city: "Xalapa", code: "XAL" },
        to: { city: "Veracruz", code: "VER" },
        duration: "1h 40m",
        stops: 0,
        services: ["Equipaje 20kg", "Snack"],
        priceMXN: 1250,
        className: "Económica"
      },
      {
        id: 2,
        airline: "CostaVerde Airlines",
        depTime: "10:15",
        arrTime: "11:05",
        from: { city: "Veracruz", code: "VER" },
        to: { city: "Xalapa", code: "XAL" },
        duration: "0h 50m",
        stops: 0,
        services: ["Equipaje de mano"],
        priceMXN: 650,
        className: "Económica"
      },
      {
        id: 3,
        airline: "SkyMéxico",
        depTime: "06:00",
        arrTime: "08:20",
        from: { city: "Xalapa", code: "XAL" },
        to: { city: "Veracruz", code: "VER" },
        duration: "2h 20m",
        stops: 1,
        services: ["Equipaje 20kg", "Bebida"],
        priceMXN: 2200,
        className: "Premium"
      },
      {
        id: 4,
        airline: "ViveAir Express",
        depTime: "13:40",
        arrTime: "15:50",
        from: { city: "Veracruz", code: "VER" },
        to: { city: "Xalapa", code: "XAL" },
        duration: "2h 10m",
        stops: 0,
        services: ["Entretenimiento", "Equipaje 25kg"],
        priceMXN: 1400,
        className: "Económica"
      },
      {
        id: 5,
        airline: "Costa Golfo",
        depTime: "09:30",
        arrTime: "11:05",
        from: { city: "Xalapa", code: "XAL" },
        to: { city: "Veracruz", code: "VER" },
        duration: "1h 35m",
        stops: 0,
        services: ["Equipaje 20kg"],
        priceMXN: 1800,
        className: "Económica"
      },
      {
        id: 6,
        airline: "Golfo Voladores",
        depTime: "16:00",
        arrTime: "17:45",
        from: { city: "Veracruz", code: "VER" },
        to: { city: "Xalapa", code: "XAL" },
        duration: "2h 45m",
        stops: 1,
        services: ["Snack", "Asiento ventana"],
        priceMXN: 2100,
        className: "Económica"
      },
      {
        id: 7,
        airline: "ViveXalapa Air",
        depTime: "12:20",
        arrTime: "13:50",
        from: { city: "Xalapa", code: "XAL" },
        to: { city: "Veracruz", code: "VER" },
        duration: "1h 30m",
        stops: 0,
        services: ["Equipaje 15kg"],
        priceMXN: 1750,
        className: "Económica"
      },
      {
        id: 8,
        airline: "Veracruz Direct",
        depTime: "18:00",
        arrTime: "19:40",
        from: { city: "Veracruz", code: "VER" },
        to: { city: "Xalapa", code: "XAL" },
        duration: "1h 40m",
        stops: 0,
        services: ["Equipaje mano", "Bebida"],
        priceMXN: 900,
        className: "Económica"
      }
    ];

    // Filtrar por origen y destino
    this.results = vuelosPorDefecto.filter(v => {
      return v.from.code === this.origin && v.to.code === this.destinationCode;
    });

    console.log(`Búsqueda completada: ${this.results.length} vuelos encontrados`);
    if (this.results.length === 0) {
      alert('No hay vuelos disponibles para esta ruta');
    }
  }

  abrirModal(vuelo: any) {
    this.vueloSeleccionado = vuelo;
    this.mostrarModal = true;
    this.cantidadSeleccionada = 1;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.vueloSeleccionado = null;
  }

  agregarAlCarrito(vuelo: any) {
    if (!vuelo) return;
    const totalPrice = (vuelo.priceMXN || 0) * this.passengers;
    const item: CartItem = {
      flight: vuelo,
      passengers: this.passengers,
      cabin: this.cabin,
      totalPrice: totalPrice
    };
    this.cart.push(item);
    this.saveCart();
    alert(`✓ ${vuelo.airline} agregado al carrito`);
    this.cerrarModal();
  }

  quitarDelCarrito(index: number) {
    this.removeFromCart(index);
  }

  calcularTotalCarrito(): number {
    return this.getTotalCart();
  }

  vaciarCarrito() {
    this.cart = [];
    this.saveCart();
  }

  enviarOrden() {
    this.sendOrder();
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

