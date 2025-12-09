import { Component, ViewChild, ElementRef, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visor-3d',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visor-3d.component.html',
  styleUrls: ['./visor-3d.component.css']
})
export class Visor3dComponent implements AfterViewInit, OnDestroy {
  @ViewChild('panorama', { static: false }) panoramaRef!: ElementRef<HTMLDivElement>;
  @Input() imagenUrl: string = 'assets/xaalapa.jpg';

  private viewer: any;

  ngAfterViewInit() {
    this.initPannellum();
  }

  ngOnDestroy() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  }

  private initPannellum() {
    // Cargamos Pannellum desde CDN
    const pannellumScript = document.createElement('script');
    pannellumScript.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    pannellumScript.onload = () => {
      this.createViewer();
    };
    document.head.appendChild(pannellumScript);

    // CSS de Pannellum
    const pannellumCSS = document.createElement('link');
    pannellumCSS.rel = 'stylesheet';
    pannellumCSS.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
    document.head.appendChild(pannellumCSS);
  }

  private createViewer() {
    const pannellum = (window as any)['pannellum'];
    if (!pannellum) {
      console.error('Pannellum no se cargó correctamente');
      return;
    }

    this.viewer = pannellum.viewer(this.panoramaRef.nativeElement, {
      type: 'equirectangular',
      panorama: this.imagenUrl,
      autoLoad: true,
      showControls: true,
      mouseZoom: true,
      doubleClickZoom: true,
      autoRotate: -2,
      autoRotateInactivityDelay: 3000,
      fullscreenButton: true,
      controlsHover: true,
      touchPan: true,
      keyboardZoom: true
    });

    // Estilos adicionales
    const container = this.panoramaRef.nativeElement;
    container.style.width = '100%';
    container.style.height = '100%';
  }
}
