import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from '../../layout/admin-layout/admin-layout.component';
import { HotelesService } from '../../../services/hoteles.service';
import { ToursService } from '../../../services/tours.service';
import { ViajesService } from '../../../services/viajes.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: any[] = [];

  constructor(
    private hotelesService: HotelesService,
    private toursService: ToursService,
    private viajesService: ViajesService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.hotelesService.getHoteles().subscribe(data => {
      this.stats[0] = { label: 'Hoteles', value: data.length, icon: '🏨' };
    });

    this.toursService.getTours().subscribe(data => {
      this.stats[1] = { label: 'Tours', value: data.length, icon: '🎫' };
    });

    this.viajesService.getViajes().subscribe(data => {
      this.stats[2] = { label: 'Viajes', value: data.length, icon: '✈️' };
    });

    this.usuariosService.getUsuarios().subscribe(data => {
      this.stats[3] = { label: 'Usuarios', value: data.length, icon: '👥' };
    });
  }
}

