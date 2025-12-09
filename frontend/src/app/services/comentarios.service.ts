import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario, Calificacion } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Obtener comentarios de un item
  obtenerComentarios(itemId: string, itemType: 'tour' | 'hotel'): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.apiUrl}/comentarios/${itemType}/${itemId}`);
  }

  // Crear comentario (solo usuarios logueados)
  crearComentario(comentario: Comentario): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.apiUrl}/comentarios`, comentario);
  }

  // Eliminar comentario
  eliminarComentario(comentarioId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comentarios/${comentarioId}`);
  }

  // Obtener calificaciones de un item
  obtenerCalificaciones(itemId: string, itemType: 'tour' | 'hotel'): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(`${this.apiUrl}/calificaciones/${itemType}/${itemId}`);
  }

  // Obtener promedio de calificaciones
  obtenerPromedioCalificacion(itemId: string, itemType: 'tour' | 'hotel'): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/calificaciones/${itemType}/${itemId}/promedio`);
  }

  // Crear/actualizar calificación
  guardarCalificacion(calificacion: Calificacion): Observable<Calificacion> {
    return this.http.post<Calificacion>(`${this.apiUrl}/calificaciones`, calificacion);
  }

  // Eliminar calificación
  eliminarCalificacion(calificacionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/calificaciones/${calificacionId}`);
  }
}
