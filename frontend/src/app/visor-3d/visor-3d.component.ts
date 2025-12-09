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
      pixelRatio: window.devicePixelRatio
    });

    const panorama = new PANOLENS.ImagePanorama(this.imagenUrl);
    viewer.add(panorama);
  }
}
