import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Gastronomia {
  id?: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  precioPromedio: number;
  imagen: string;
  tipoComida: string;
  horarios: string;
  telefono: string;
}

@Injectable({
  providedIn: 'root'
})
export class GastronomiasService {
  private apiUrl = 'http://localhost:3000/api/gastronomias';

  constructor(private http: HttpClient) {}

  getGastronomias(): Observable<Gastronomia[]> {
    return this.http.get<Gastronomia[]>(this.apiUrl);
  }

  getGastronomia(id: number): Observable<Gastronomia> {
    return this.http.get<Gastronomia>(`${this.apiUrl}/${id}`);
  }

  createGastronomia(gastronomia: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, gastronomia);
  }

  updateGastronomia(id: number, gastronomia: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, gastronomia);
  }

  deleteGastronomia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
