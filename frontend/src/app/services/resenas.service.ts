import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Resena {
  id?: number;
  usuario_id: number;
  tipo: 'hotel' | 'tour' | 'viaje' | 'gastronomia' | 'lugar';
  producto_id: number;
  calificacion: number;
  titulo?: string;
  texto: string;
  usuario_nombre?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResenasService {
  private apiUrl = 'http://localhost:3000/api/resenas';

  constructor(private http: HttpClient) {}

  getResenas(tipo: string, producto_id: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.apiUrl}?tipo=${tipo}&producto_id=${producto_id}`);
  }

  createResena(resena: Resena): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.apiUrl, resena);
  }

  updateResena(id: number, resena: Resena): Observable<{ ok: boolean }> {
    return this.http.put<{ ok: boolean }>(`${this.apiUrl}/${id}`, resena);
  }

  deleteResena(id: number): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(`${this.apiUrl}/${id}`);
  }
}
