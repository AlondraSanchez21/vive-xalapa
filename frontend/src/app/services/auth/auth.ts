import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Usuario, LoginRequest, LoginResponse } from '../../models/usuario.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth'; // Ajusta según tu backend
  
  private usuarioSubject = new BehaviorSubject<Usuario | null>(this.getUsuarioLocal());
  public usuario$ = this.usuarioSubject.asObservable();
  
  private tokenSubject = new BehaviorSubject<string | null>(this.getTokenLocal());
  public token$ = this.tokenSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.getTokenLocal());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Login
  login(email: string, password: string): Observable<LoginResponse> {
    const request: LoginRequest = { email, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => {
        console.error('Error en login:', error);
        throw error;
      })
    );
  }

  // Registro
  register(usuario: Usuario, password: string): Observable<LoginResponse> {
    const data = { ...usuario, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => {
        console.error('Error en registro:', error);
        throw error;
      })
    );
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.tokenSubject.next(null);
    this.usuarioSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  // Obtener usuario actual
  getUsuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  // Obtener token
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  // Verificar si está logueado
  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  // Actualizar perfil
  actualizarPerfil(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/perfil`, usuario).pipe(
      tap(usuarioActualizado => {
        this.usuarioSubject.next(usuarioActualizado);
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      }),
      catchError(error => {
        console.error('Error actualizando perfil:', error);
        throw error;
      })
    );
  }

  // Privados
  private handleAuthSuccess(response: LoginResponse): void {
    const { token, usuario } = response;
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.tokenSubject.next(token);
    this.usuarioSubject.next(usuario);
    this.isLoggedInSubject.next(true);
  }

  private getTokenLocal(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  private getUsuarioLocal(): Usuario | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const usuario = localStorage.getItem('usuario');
      return usuario ? JSON.parse(usuario) : null;
    }
    return null;
  }
}
