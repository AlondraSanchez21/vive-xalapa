import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GastronomiasService, Gastronomia } from '../../../services/gastronomias.service';

@Component({
  selector: 'app-admin-gastronomias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestión de Gastronomía</h2>
      
      <div class="form-section">
        <h3>{{ editingId ? 'Editar' : 'Agregar' }} Restaurante</h3>
        <form (ngSubmit)="save()">
          <input [(ngModel)]="form.nombre" name="nombre" placeholder="Nombre" required>
          <textarea [(ngModel)]="form.descripcion" name="descripcion" placeholder="Descripción"></textarea>
          <input [(ngModel)]="form.ubicacion" name="ubicacion" placeholder="Ubicación">
          <input [(ngModel)]="form.tipoComida" name="tipoComida" placeholder="Tipo de Comida">
          <input type="number" [(ngModel)]="form.precioPromedio" name="precioPromedio" placeholder="Precio Promedio" step="0.01">
          <label>Imagen (subir archivo):</label>
          <input type="file" (change)="onFileChange($event)" accept="image/*">
          <div *ngIf="previewImage" style="margin-top:8px;"><img [src]="previewImage" style="max-height:80px;border-radius:6px"/></div>
          <input [(ngModel)]="form.horarios" name="horarios" placeholder="Horarios (ej: 12:00-23:00)">
          <input [(ngModel)]="form.telefono" name="telefono" placeholder="Teléfono">
          
          <div class="button-group">
            <button type="submit" class="btn-save">{{ editingId ? 'Actualizar' : 'Agregar' }}</button>
            <button type="button" (click)="cancel()" class="btn-cancel">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="table-section">
        <h3>Restaurantes Registrados</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Ubicación</th>
              <th>Precio Promedio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let gastro of gastronomias">
              <td>{{ gastro.id }}</td>
              <td>{{ gastro.nombre }}</td>
              <td>{{ gastro.tipoComida }}</td>
              <td>{{ gastro.ubicacion }}</td>
              <td>$ {{ gastro.precioPromedio }}</td>
              <td>
                <button (click)="edit(gastro)" class="btn-edit">Editar</button>
                <button (click)="delete(gastro.id)" class="btn-delete">Eliminar</button>
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
export class AdminGastronomiasComponent implements OnInit {
  gastronomias: Gastronomia[] = [];
  form: Partial<Gastronomia> = {};
  editingId: number | null = null;
  imageFile?: File | null = null;
  previewImage: string | null = null;

  constructor(private gastronomiasService: GastronomiasService) {}

  ngOnInit() {
    this.loadGastronomias();
  }

  loadGastronomias() {
    this.gastronomiasService.getGastronomias().subscribe({
      next: (data) => this.gastronomias = data,
      error: (err) => console.error('Error cargando gastronomías:', err)
    });
  }

  save() {
    if (!this.form.nombre) return alert('Completa los campos requeridos');
    if (this.imageFile) {
      const fd = new FormData();
      fd.append('nombre', this.form.nombre || '');
      fd.append('descripcion', this.form.descripcion || '');
      fd.append('ubicacion', this.form.ubicacion || '');
      fd.append('precioPromedio', String(this.form.precioPromedio || 0));
      fd.append('tipoComida', this.form.tipoComida || '');
      fd.append('horarios', this.form.horarios || '');
      fd.append('telefono', this.form.telefono || '');
      fd.append('imagen', this.imageFile);

      const obs = this.editingId ? this.gastronomiasService.updateGastronomia(this.editingId, fd) : this.gastronomiasService.createGastronomia(fd);
      obs.subscribe({ next: () => { this.loadGastronomias(); this.cancel(); alert('Gastronomía guardada'); }, error: (err) => console.error('Error:', err) });
      return;
    }

    const gastronomia: Gastronomia = {
      id: this.form.id,
      nombre: this.form.nombre || '',
      descripcion: this.form.descripcion || '',
      ubicacion: this.form.ubicacion || '',
      precioPromedio: this.form.precioPromedio || 0,
      imagen: this.form.imagen || '',
      tipoComida: this.form.tipoComida || '',
      horarios: this.form.horarios || '',
      telefono: this.form.telefono || ''
    };

    const obs = this.editingId ? this.gastronomiasService.updateGastronomia(this.editingId, gastronomia) : this.gastronomiasService.createGastronomia(gastronomia);
    obs.subscribe({ next: () => { this.loadGastronomias(); this.cancel(); alert('Gastronomía guardada'); }, error: (err) => console.error('Error:', err) });
  }

  edit(gastronomia: Gastronomia) {
    this.form = { ...gastronomia };
    this.editingId = gastronomia.id || null;
    this.previewImage = gastronomia.imagen || null;
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
    if (!id || !confirm('¿Eliminar esta gastronomía?')) return;
    this.gastronomiasService.deleteGastronomia(id).subscribe({
      next: () => { this.loadGastronomias(); alert('Gastronomía eliminada'); },
      error: (err) => console.error('Error:', err)
    });
  }
}
