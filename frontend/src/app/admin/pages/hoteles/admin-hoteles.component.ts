import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelesService, Hotel } from '../../../services/hoteles.service';

@Component({
  selector: 'app-admin-hoteles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestión de Hoteles</h2>
      
      <div class="form-section">
        <h3>{{ editingId ? 'Editar' : 'Agregar' }} Hotel</h3>
        <form (ngSubmit)="save()">
          <input [(ngModel)]="form.nombre" name="nombre" placeholder="Nombre" required>
          <textarea [(ngModel)]="form.descripcion" name="descripcion" placeholder="Descripción"></textarea>
          <input [(ngModel)]="form.ubicacion" name="ubicacion" placeholder="Ubicación">
          <input type="number" [(ngModel)]="form.precioBase" name="precioBase" placeholder="Precio" step="0.01">
          <input type="number" [(ngModel)]="form.precioAntes" name="precioAntes" placeholder="Precio Anterior" step="0.01">
            <label>Imagen (subir archivo):</label>
            <input type="file" (change)="onFileChange($event)" accept="image/*">
            <div *ngIf="previewImage" style="margin-top:8px;"><img [src]="previewImage" style="max-height:80px;border-radius:6px"/></div>
          <input type="number" [(ngModel)]="form.habitaciones" name="habitaciones" placeholder="Habitaciones">
          
          <div class="button-group">
            <button type="submit" class="btn-save">{{ editingId ? 'Actualizar' : 'Agregar' }}</button>
            <button type="button" (click)="cancel()" class="btn-cancel">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="table-section">
        <h3>Hoteles Registrados</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Precio</th>
              <th>Habitaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let hotel of hoteles">
              <td>{{ hotel.id }}</td>
              <td>{{ hotel.nombre }}</td>
              <td>{{ hotel.ubicacion }}</td>
              <td>$ {{ hotel.precioBase }}</td>
              <td>{{ hotel.habitaciones }}</td>
              <td>
                <button (click)="edit(hotel)" class="btn-edit">Editar</button>
                <button (click)="delete(hotel.id)" class="btn-delete">Eliminar</button>
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
    input, textarea { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
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
export class AdminHotelesComponent implements OnInit {
  hoteles: Hotel[] = [];
  form: Partial<Hotel> = {};
  editingId: number | null = null;
  imageFile?: File | null = null;
  previewImage: string | null = null;

  constructor(private hotelesService: HotelesService) {}

  ngOnInit() {
    this.loadHoteles();
  }

  loadHoteles() {
    this.hotelesService.getHoteles().subscribe({
      next: (data) => this.hoteles = data,
      error: (err) => console.error('Error cargando hoteles:', err)
    });
  }

  save() {
    if (!this.form.nombre) return alert('Completa los campos requeridos');
    // If an image file is selected, use FormData
    if (this.imageFile) {
      const fd = new FormData();
      fd.append('nombre', this.form.nombre || '');
      fd.append('descripcion', this.form.descripcion || '');
      fd.append('ubicacion', this.form.ubicacion || '');
      fd.append('precioBase', String(this.form.precioBase || 0));
      fd.append('precioAntes', String(this.form.precioAntes || 0));
      fd.append('calificacion', String(this.form.calificacion || 5));
      fd.append('habitaciones', String(this.form.habitaciones || 0));
      fd.append('amenidades', JSON.stringify(this.form.amenidades || []));
      fd.append('imagen', this.imageFile);

      const obs = this.editingId ? this.hotelesService.updateHotel(this.editingId, fd) : this.hotelesService.createHotel(fd);
      obs.subscribe({ next: () => { this.loadHoteles(); this.cancel(); alert('Hotel guardado'); }, error: (err) => console.error('Error:', err) });
      return;
    }

    const hotel: Hotel = {
      id: this.form.id,
      nombre: this.form.nombre || '',
      descripcion: this.form.descripcion || '',
      ubicacion: this.form.ubicacion || '',
      precioBase: this.form.precioBase || 0,
      precioAntes: this.form.precioAntes || 0,
      imagen: this.form.imagen || '',
      calificacion: this.form.calificacion || 5,
      habitaciones: this.form.habitaciones || 0,
      amenidades: this.form.amenidades || []
    };

    const obs = this.editingId ? this.hotelesService.updateHotel(this.editingId, hotel) : this.hotelesService.createHotel(hotel);
    obs.subscribe({ next: () => { this.loadHoteles(); this.cancel(); alert('Hotel guardado'); }, error: (err) => console.error('Error:', err) });
  }

  edit(hotel: Hotel) {
    this.form = { ...hotel };
    this.editingId = hotel.id || null;
    this.previewImage = hotel.imagen || null;
  }

  cancel() {
    this.form = {};
    this.editingId = null;
    this.imageFile = null;
    this.previewImage = null;
  }

  onFileChange(event: any) {
    const file = event?.target?.files?.[0];
    if (file) {
      this.imageFile = file;
      try { this.previewImage = URL.createObjectURL(file); } catch { this.previewImage = null; }
    } else {
      this.imageFile = null;
      this.previewImage = null;
    }
  }

  delete(id: number | undefined) {
    if (!id || !confirm('¿Eliminar este hotel?')) return;
    this.hotelesService.deleteHotel(id).subscribe({
      next: () => { this.loadHoteles(); alert('Hotel eliminado'); },
      error: (err) => console.error('Error:', err)
    });
  }
}
