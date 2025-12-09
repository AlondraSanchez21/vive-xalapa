import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { Visor3dComponent } from '../../shared/components/visor-3d/visor-3d.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgFor, Visor3dComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  images = [
    'assets/descarga.jpg',
    'assets/Xaalapa.jpg',
    'assets/logo.png',
    'assets/xaalapa.jpg'
  ];

  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
}
