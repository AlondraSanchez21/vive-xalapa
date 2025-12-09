export interface Lugar {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  imagen: string;
  lat?: number;
  lng?: number;
  rating?: number;
  comentarios?: { usuario: string; texto: string }[];
}
