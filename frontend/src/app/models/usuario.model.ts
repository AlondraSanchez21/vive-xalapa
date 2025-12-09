export interface Usuario {
  id?: string | number;
  nombre: string;
  email: string;
  telefono?: string;
  pais?: string;
  ciudad?: string;
  fotoPerfil?: string;
  fechaRegistro?: Date;
  contrasena?: string;
  rol?: 'admin' | 'usuario' | string;
}

export interface PerfilUsuario extends Usuario {
  favoritos: string[]; // IDs de tours/hoteles favoritos
  calificaciones: Calificacion[];
  comentarios: Comentario[];
  reservas: Reserva[];
  descuentoAplicado?: number;
}

export interface Calificacion {
  id?: number;
  usuarioId: number;
  itemId: string; // ID del tour/hotel
  itemType: 'tour' | 'hotel';
  puntuacion: number; // 1-5 estrellas
  comentario?: string;
  fecha?: Date;
}

export interface Comentario {
  id?: number;
  usuarioId: number;
  itemId: string;
  itemType: 'tour' | 'hotel';
  texto: string;
  fechaCreacion?: Date;
  autorNombre?: string;
  autorFoto?: string;
}

export interface Reserva {
  id?: number;
  usuarioId: number;
  itemId: string;
  itemType: 'tour' | 'hotel' | 'vuelo';
  nombreItem: string;
  fecha: Date;
  estado: 'confirmada' | 'pendiente' | 'cancelada';
  precio: number;
  descuentoAplicado?: number;
  precioFinal?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}
