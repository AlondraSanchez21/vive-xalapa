import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private apiUrl = 'http://localhost:3000/api/favoritos';
  
  private favoritosSubject = new BehaviorSubject<string[]>(this.getFavoritosLocal());
  public favoritos$ = this.favoritosSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Obtener favoritos del usuario
  obtenerFavoritos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/mis-favoritos`).pipe(
      tap(favoritos => {
        this.favoritosSubject.next(favoritos);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
      })
    );
  }

  // Agregar a favoritos
  agregarFavorito(itemId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregar`, { itemId }).pipe(
      tap(() => {
        const favoritos = this.favoritosSubject.value;
        if (!favoritos.includes(itemId)) {
          favoritos.push(itemId);
          this.favoritosSubject.next([...favoritos]);
          localStorage.setItem('favoritos', JSON.stringify(favoritos));
        }
      })
    );
  }

  // Eliminar de favoritos
  eliminarFavorito(itemId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/eliminar`, { itemId }).pipe(
      tap(() => {
        const favoritos = this.favoritosSubject.value.filter(id => id !== itemId);
        this.favoritosSubject.next(favoritos);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
      })
    );
  }

  // Verificar si está en favoritos
  esFavorito(itemId: string): boolean {
    return this.favoritosSubject.value.includes(itemId);
  }

  // Obtener favoritos locales
  private getFavoritosLocal(): string[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      const favoritos = localStorage.getItem('favoritos');
      return favoritos ? JSON.parse(favoritos) : [];
    }
    return [];
  }
}
