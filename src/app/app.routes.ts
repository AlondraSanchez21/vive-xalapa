import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'hoteles', loadComponent: () => import('./pages/hoteles/hoteles.component').then(m => m.HotelesComponent) },
  { path: 'tours', loadComponent: () => import('./pages/tours/tours.component').then(m => m.ToursComponent) },
  { path: 'gastronomia', loadComponent: () => import('./pages/gastronomia/gastronomia.component').then(m => m.GastronomiaComponent) },
  { path: 'lugares', loadComponent: () => import('./pages/lugares/lugares.component').then(m => m.LugaresComponent) },
  { path: 'mapa', loadComponent: () => import('./pages/mapa/mapa.component').then(m => m.mapaComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegistroComponent) },
];
