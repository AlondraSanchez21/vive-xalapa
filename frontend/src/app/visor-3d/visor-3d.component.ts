import { Component, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';

declare var PANOLENS: any;

@Component({
  selector: 'app-visor-3d',
  templateUrl: './visor-3d.component.html',
  styleUrls: ['./visor-3d.component.scss']
})
export class Visor3DComponent implements AfterViewInit {

  @ViewChild('viewerContainer', { static: false }) viewerContainer!: ElementRef;

  @Input() imagenUrl: string = '';

  ngAfterViewInit(): void {

    const viewer = new PANOLENS.Viewer({
      container: this.viewerContainer.nativeElement,
      controlBar: true,
      autoRotate: false,
      autoRotateSpeed: 0.3,
      output: 'console',
      cameraFov: 70,
      pixelRatio: 2   // fuerza más calidad
    });

    const panorama = new PANOLENS.ImagePanorama(this.imagenUrl);

    panorama.addEventListener('progress', (e: any) => {
      console.log("Cargando imagen panorámica...");
    });

    viewer.add(panorama);
  }
}
