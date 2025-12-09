import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-lugar-detalle',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './lugar-detalle.component.html',
  styleUrls: ['./lugar-detalle.component.css']
})
export class LugarDetalleComponent implements OnInit {
  lugar: any;
  lugares: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Cargar JSON desde assets
    this.http.get<any[]>('assets/data/lugares.json').subscribe(data => {
      this.lugares = data;

      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.lugar = this.lugares.find(l => l.id === id);
    });
  }
}
