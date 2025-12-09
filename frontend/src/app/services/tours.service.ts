import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tour {
  id?: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  precioBase: number;
  precioAntes: number;
  imagen: string;
  duracion: string;
  idiomas: string[];
  incluye: string[];
  horarios: string[];
  calificacion: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToursService {
  private apiUrl = 'http://localhost:3000/api/tours';

  constructor(private http: HttpClient) {}

  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(this.apiUrl);
  }

  getTour(id: number): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/${id}`);
  }

  createTour(tour: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tour);
  }

  updateTour(id: number, tour: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tour);
  }

  deleteTour(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
