import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Viaje {
  id?: number;
  nombre: string;
  descripcion: string;
  origen: string;
  destino: string;
  precioBase: number;
  precioAntes: number;
  imagen: string;
  fechaSalida: string;
  hora: string;
  duracion: string;
  tipoTransporte: 'avion' | 'autobus' | 'tren';
  asientos: number;
}

@Injectable({
  providedIn: 'root'
})
export class ViajesService {
  private apiUrl = 'http://localhost:3000/api/viajes';

  constructor(private http: HttpClient) {}

  getViajes(): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(this.apiUrl);
  }

  getViaje(id: number): Observable<Viaje> {
    return this.http.get<Viaje>(`${this.apiUrl}/${id}`);
  }

  createViaje(viaje: Viaje): Observable<Viaje> {
    return this.http.post<Viaje>(this.apiUrl, viaje);
  }

  updateViaje(id: number, viaje: Viaje): Observable<Viaje> {
    return this.http.put<Viaje>(`${this.apiUrl}/${id}`, viaje);
  }

  deleteViaje(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
