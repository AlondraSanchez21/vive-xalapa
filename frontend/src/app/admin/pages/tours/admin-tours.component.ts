import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToursService, Tour } from '../../../services/tours.service';

@Component({
  selector: 'app-admin-tours',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Gestión de Tours</h2>
      
      <div class="form-section">
        <h3>{{ editingId ? 'Editar' : 'Agregar' }} Tour</h3>
        <form (ngSubmit)="save()">
          <input [(ngModel)]="form.nombre" name="nombre" placeholder="Nombre" required>
          <textarea [(ngModel)]="form.descripcion" name="descripcion" placeholder="Descripción"></textarea>
          <input [(ngModel)]="form.ubicacion" name="ubicacion" placeholder="Ubicación">
          <input type="number" [(ngModel)]="form.precioBase" name="precioBase" placeholder="Precio" step="0.01">
          <input type="number" [(ngModel)]="form.precioAntes" name="precioAntes" placeholder="Precio Anterior" step="0.01">
          <label>Imagen (subir archivo):</label>
          <input type="file" (change)="onFileChange($event)" accept="image/*">
          <div *ngIf="previewImage" style="margin-top:8px;"><img [src]="previewImage" style="max-height:80px;border-radius:6px"/></div>
          <input [(ngModel)]="form.duracion" name="duracion" placeholder="Duración (ej: 4 horas)">
          <input [(ngModel)]="formIdiomas" name="idiomas" placeholder="Idiomas (separados por coma)">
          
          <div class="button-group">
            <button type="submit" class="btn-save">{{ editingId ? 'Actualizar' : 'Agregar' }}</button>
            <button type="button" (click)="cancel()" class="btn-cancel">Cancelar</button>
          </div>
        </form>
      </div>

      <div class="table-section">
        <h3>Tours Registrados</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Precio</th>
              <th>Duración</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tour of tours">
              <td>{{ tour.id }}</td>
              <td>{{ tour.nombre }}</td>
              <td>{{ tour.ubicacion }}</td>
              <td>$ {{ tour.precioBase }}</td>
              <td>{{ tour.duracion }}</td>
              <td>
                <button (click)="edit(tour)" class="btn-edit">Editar</button>
                <button (click)="delete(tour.id)" class="btn-delete">Eliminar</button>
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
export class AdminToursComponent implements OnInit {
  tours: Tour[] = [];
  form: Partial<Tour> = {};
  formIdiomas: string = '';
  editingId: number | null = null;
  imageFile?: File | null = null;
  previewImage: string | null = null;

  constructor(private toursService: ToursService) {}

  ngOnInit() {
    this.loadTours();
  }

  loadTours() {
    this.toursService.getTours().subscribe({
      next: (data) => this.tours = data,
      error: (err) => console.error('Error cargando tours:', err)
    });
  }

  save() {
    if (!this.form.nombre) return alert('Completa los campos requeridos');
    // If file selected, use FormData
    if (this.imageFile) {
      const fd = new FormData();
      fd.append('nombre', this.form.nombre || '');
      fd.append('descripcion', this.form.descripcion || '');
      fd.append('ubicacion', this.form.ubicacion || '');
      fd.append('precioBase', String(this.form.precioBase || 0));
      fd.append('precioAntes', String(this.form.precioAntes || 0));
      fd.append('duracion', this.form.duracion || '');
      fd.append('idiomas', JSON.stringify(this.formIdiomas ? this.formIdiomas.split(',').map(i => i.trim()) : []));
      fd.append('incluye', JSON.stringify(this.form.incluye || []));
      fd.append('horarios', JSON.stringify(this.form.horarios || []));
      fd.append('calificacion', String(this.form.calificacion || 5));
      fd.append('imagen', this.imageFile);

      const obs = this.editingId ? this.toursService.updateTour(this.editingId, fd) : this.toursService.createTour(fd);
      obs.subscribe({ next: () => { this.loadTours(); this.cancel(); alert('Tour guardado'); }, error: (err) => console.error('Error:', err) });
      return;
    }

    const tour: Tour = {
      id: this.form.id,
      nombre: this.form.nombre || '',
      descripcion: this.form.descripcion || '',
      ubicacion: this.form.ubicacion || '',
      precioBase: this.form.precioBase || 0,
      precioAntes: this.form.precioAntes || 0,
      imagen: this.form.imagen || '',
      duracion: this.form.duracion || '',
      idiomas: this.formIdiomas ? this.formIdiomas.split(',').map(i => i.trim()) : [],
      incluye: this.form.incluye || [],
      horarios: this.form.horarios || [],
      calificacion: this.form.calificacion || 5
    };

    const obs = this.editingId ? this.toursService.updateTour(this.editingId, tour) : this.toursService.createTour(tour);
    obs.subscribe({ next: () => { this.loadTours(); this.cancel(); alert('Tour guardado'); }, error: (err) => console.error('Error:', err) });
  }

  edit(tour: Tour) {
    this.form = { ...tour };
    this.formIdiomas = tour.idiomas?.join(', ') || '';
    this.editingId = tour.id || null;
    this.previewImage = tour.imagen || null;
  }

  cancel() {
    this.form = {};
    this.formIdiomas = '';
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
    if (!id || !confirm('¿Eliminar este tour?')) return;
    this.toursService.deleteTour(id).subscribe({
      next: () => { this.loadTours(); alert('Tour eliminado'); },
      error: (err) => console.error('Error:', err)
    });
  }
}
