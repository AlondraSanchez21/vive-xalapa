import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-hoteles',
  standalone: true,
  imports: [NgFor],
  templateUrl: './hoteles.component.html',
  styleUrls: ['./hoteles.component.css']
})
export class HotelesComponent {}
