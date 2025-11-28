import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  menuOpen = false;
  dropdownDescubrir = false;
  dropdownReservar = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  openDescubrir() {
    this.dropdownDescubrir = true;
  }

  closeDescubrir() {
    this.dropdownDescubrir = false;
  }

  openReservar() {
    this.dropdownReservar = true;
  }

  closeReservar() {
    this.dropdownReservar = false;
  }
}
