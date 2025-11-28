import { Component } from '@angular/core';    
import { NgFor } from '@angular/common';  
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [NgFor],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {}
