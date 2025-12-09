import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViajesService, Viaje } from '../../../services/viajes.service';

@Component({
  selector: 'app-admin-viajes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestión de Viajes</h2>
      
      <div class="form-section">
        <h3>{{ editingId ? 'Editar' : 'Agregar' }} Viaje</h3>
        <form (ngSubmit)="save()">
          <input [(ngModel)]="form.nombre" name="nombre" placeholder="Nombre" required>
          <textarea [(ngModel)]="form.descripcion" name="descripcion" placeholder="Descripción"></textarea>
          <input [(ngModel)]="form.origen" name="origen" placeholder="Origen">
          <input [(ngModel)]="form.destino" name="destino" placeholder="Destino">
          <input type="number" [(ngModel)]="form.precioBase" name="precioBase" placeholder="Precio" step="0.01">
          <input type="number" [(ngModel)]="form.precioAntes" name="precioAntes" placeholder="Precio Anterior" step="0.01">
          <input [(ngModel)]="form.imagen" name="imagen" placeholder="URL Imagen">
          <input type="date" [(ngModel)]="form.fechaSalida" name="fechaSalida">
          <input type="time" [(ngModel)]="form.hora" name="hora">
          <input [(ngModel)]="form.duracion" name="duracion" placeholder="Duración">
          <select [(ngModel)]="form.tipoTransporte" name="tipoTransporte">
            <option value="avion">Avión</option>
            <option value="autobus">Autobús</option>
            <option value="tren">Tren</option>
          </select>
          <input type="number" [(ngModel)]="form.asientos" name="asientos" placeholder="Asientos disponibles">
          
          <div class="button-group">
            <button type="submit" class="btn-save">{{ editingId ? 'Actualizar' : 'Agregar' }}</button>
            <button type="button" (click)="cancel()" class="btn-cancel">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="table-section">
        <h3>Viajes Registrados</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Precio</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let viaje of viajes">
              <td>{{ viaje.id }}</td>
              <td>{{ viaje.nombre }}</td>
              <td>{{ viaje.origen }}</td>
              <td>{{ viaje.destino }}</td>
              <td>$ {{ viaje.precioBase }}</td>
              <td>{{ viaje.tipoTransporte }}</td>
              <td>
                <button (click)="edit(viaje)" class="btn-edit">Editar</button>
                <button (click)="delete(viaje.id)" class="btn-delete">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .form-section { background: #f5f5f5; padding: 20px; margin-bottom: 30px; border-radius: 8px; }
    form { display: flex; flex-direction: column; gap: 10px; }
    input, textarea, select { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
    .button-group { display: flex; gap: 10px; }
    .btn-save { background: #2e7d32; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-cancel { background: #ccc; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-edit { background: #1976d2; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-delete { background: #d32f2f; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #2e7d32; color: white; }
  `]
})
export class AdminViajesComponent implements OnInit {
  viajes: Viaje[] = [];
  form: Partial<Viaje> = {};
  editingId: number | null = null;

  constructor(private viajesService: ViajesService) {}

  ngOnInit() {
    this.loadViajes();
  }

  loadViajes() {
    this.viajesService.getViajes().subscribe({
      next: (data) => this.viajes = data,
      error: (err) => console.error('Error cargando viajes:', err)
    });
  }

  save() {
    if (!this.form.nombre) return alert('Completa los campos requeridos');

    const viaje: Viaje = {
      id: this.form.id,
      nombre: this.form.nombre || '',
      descripcion: this.form.descripcion || '',
      origen: this.form.origen || '',
      destino: this.form.destino || '',
      precioBase: this.form.precioBase || 0,
      precioAntes: this.form.precioAntes || 0,
      imagen: this.form.imagen || '',
      fechaSalida: this.form.fechaSalida || '',
      hora: this.form.hora || '',
      duracion: this.form.duracion || '',
      tipoTransporte: this.form.tipoTransporte || 'avion',
      asientos: this.form.asientos || 0
    };

    if (this.editingId) {
      this.viajesService.updateViaje(this.editingId, viaje).subscribe({
        next: () => { this.loadViajes(); this.cancel(); alert('Viaje actualizado'); },
        error: (err) => console.error('Error:', err)
      });
    } else {
      this.viajesService.createViaje(viaje).subscribe({
        next: () => { this.loadViajes(); this.cancel(); alert('Viaje agregado'); },
        error: (err) => console.error('Error:', err)
      });
    }
  }

  edit(viaje: Viaje) {
    this.form = { ...viaje };
    this.editingId = viaje.id || null;
  }

  cancel() {
    this.form = {};
    this.editingId = null;
  }

  delete(id: number | undefined) {
    if (!id || !confirm('¿Eliminar este viaje?')) return;
    this.viajesService.deleteViaje(id).subscribe({
      next: () => { this.loadViajes(); alert('Viaje eliminado'); },
      error: (err) => console.error('Error:', err)
    });
  }
}
