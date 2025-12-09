import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'hoteles', loadComponent: () => import('./pages/hoteles/hoteles.component').then(m => m.HotelesComponent) },
  { path: 'lugares', loadComponent: () => import('./pages/lugares/lugares.component').then(m => m.LugaresComponent) },
  { path: 'gastronomia', loadComponent: () => import('./pages/gastronomia/gastronomia.component').then(m => m.GastronomiaComponent) },
  { path: 'viajes', loadComponent: () => import('./pages/viajes/viaje.component').then(m => m.ViajeComponent) },
  { path: 'tours', loadComponent: () => import('./pages/tours/tours.component').then(m => m.ToursComponent) },
  {
    path: 'tours/reservar/:id',
    loadComponent: () => import('./pages/tours/reservas/reservar.component').then(m => m.ReservarComponent)
  },
  {
    path: 'tours/confirmacion',
    loadComponent: () => import('./pages/tours/reservas/confirmacion.component').then(m => m.ConfirmacionReservaComponent)
  },
  {
    path: 'lugar/:id',
    loadComponent: () => import('./pages/lugares/lugar-detalle/lugar-detalle.component')
      .then(m => m.LugarDetalleComponent)
  },
  // Admin routes
  { path: 'admin/login', loadComponent: () => import('./admin/pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', loadComponent: () => import('./admin/pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'admin/hoteles', loadComponent: () => import('./admin/pages/hoteles/admin-hoteles.component').then(m => m.AdminHotelesComponent) },
  { path: 'admin/tours', loadComponent: () => import('./admin/pages/tours/admin-tours.component').then(m => m.AdminToursComponent) },
  { path: 'admin/viajes', loadComponent: () => import('./admin/pages/viajes/admin-viajes.component').then(m => m.AdminViajesComponent) },
  { path: 'admin/gastronomias', loadComponent: () => import('./admin/pages/gastronomias/admin-gastronomias.component').then(m => m.AdminGastronomiasComponent) },
  { path: 'admin/usuarios', loadComponent: () => import('./admin/pages/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
  { path: '**', redirectTo: '' }
];
