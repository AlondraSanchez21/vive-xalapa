import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth';
import { Usuario, Reserva } from '../../models/usuario.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit, OnDestroy {
  usuario: Usuario | null = null;
  editMode = false;
  cargando = true;
  mensajeExito = '';
  mostrarMensaje = false;
  
  // Mock de reservas (conectar con servicio real después)
  reservas: Reserva[] = [
    {
      id: 1,
      usuarioId: 1,
      itemId: '1',
      itemType: 'tour',
      nombreItem: 'Tour Xalapa Premium',
      fecha: new Date('2024-12-20'),
      estado: 'confirmada',
      precio: 899,
      descuentoAplicado: 0,
      precioFinal: 899
    },
    {
      id: 2,
      usuarioId: 1,
      itemId: '2',
      itemType: 'hotel',
      nombreItem: 'Hotel Boutique Centro',
      fecha: new Date('2024-12-25'),
      estado: 'confirmada',
      precio: 1200,
      descuentoAplicado: 0,
      precioFinal: 1200
    }
  ];

  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.usuario$
      .pipe(takeUntil(this.destroy$))
      .subscribe(usuario => {
        this.usuario = usuario;
        this.cargando = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  guardarCambios(): void {
    if (!this.usuario) return;
    
    this.authService.actualizarPerfil(this.usuario).subscribe({
      next: () => {
        this.mostrarExito('✓ Cambios guardados exitosamente');
        this.editMode = false;
      },
      error: (err) => {
        console.error('Error guardando perfil:', err);
        this.mostrarExito('✗ Error al guardar cambios', true);
      }
    });
  }

  cancelarEdicion(): void {
    this.editMode = false;
  }

  eliminarReserva(id: number): void {
    this.reservas = this.reservas.filter(r => r.id !== id);
    this.mostrarExito('✓ Reserva cancelada');
  }

  private mostrarExito(mensaje: string, esError: boolean = false): void {
    this.mensajeExito = mensaje;
    this.mostrarMensaje = true;
    setTimeout(() => {
      this.mostrarMensaje = false;
    }, 3000);
  }

  getEstadoClass(estado: string): string {
    return `estado-${estado}`;
  }

  getEstadoTexto(estado: string): string {
    const map: { [key: string]: string } = {
      confirmada: 'Confirmada',
      pendiente: 'Pendiente',
      cancelada: 'Cancelada'
    };
    return map[estado] || estado;
  }

  getTipoTexto(tipo: string): string {
    const map: { [key: string]: string } = {
      tour: 'Tour',
      hotel: 'Hotel',
      vuelo: 'Vuelo'
    };
    return map[tipo] || tipo;
  }
}
