import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hotel {
  id?: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  precioBase: number;
  precioAntes: number;
  imagen: string;
  calificacion: number;
  habitaciones: number;
  amenidades: string[];
}

@Injectable({
  providedIn: 'root'
})
export class HotelesService {
  private apiUrl = 'http://localhost:3000/api/hoteles';

  constructor(private http: HttpClient) {}

  getHoteles(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }

  getHotel(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/${id}`);
  }

  createHotel(hotel: any): Observable<any> {
    // hotel can be an object or FormData
    return this.http.post<any>(this.apiUrl, hotel);
  }

  updateHotel(id: number, hotel: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, hotel);
  }

  deleteHotel(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
