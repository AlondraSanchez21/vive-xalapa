import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmacion-reserva',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="confirm-wrap">\n' +
           '  <h2>Reserva enviada</h2>\n' +
           '  <p class="lead">Tu reserva se registró correctamente. Revisa tu correo para más detalles.</p>\n' +
           '  <div *ngIf="reserva">\n' +
           '    <strong>{{reserva.tour}}</strong>\n' +
           '    <p>Fecha: {{reserva.fecha}}</p>\n' +
           '    <p>Cantidad: {{reserva.cantidad}}</p>\n' +
           '    <p>Total: $ {{reserva?.total}} MXN</p>\n' +
           '  </div>\n' +
           '  <button (click)="volver()">Volver a Tours</button>\n' +
           '</div>',
  styles: [
    `.confirm-wrap{max-width:720px;margin:40px auto;padding:24px;background:#fff;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,0.06);text-align:center}
     .confirm-wrap h2{color:#145a3b}
     .confirm-wrap .lead{color:#444}
     .confirm-wrap button{margin-top:18px;padding:10px 14px;background:#145a3b;color:#fff;border:none;border-radius:8px}`
  ]
})
export class ConfirmacionReservaComponent {
  reserva: any = null;
  constructor(private router: Router){
    const state = this.router.getCurrentNavigation()?.extras.state as any;
    if(state && state.reserva) this.reserva = state.reserva;
    else {
      // intentar cargar del localStorage
      try{ const raw = localStorage.getItem('ultima_reserva'); if(raw) this.reserva = JSON.parse(raw);}catch{}
    }
  }

  volver(){ this.router.navigate(['/tours']); }
}
