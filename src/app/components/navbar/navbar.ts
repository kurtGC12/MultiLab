import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {

  esAdmin = false;
  esAnalista = false;

  private authService = inject(AuthService);
   private router = inject(Router);

   get estaAutenticado(): boolean {
    return this.authService.estaAutenticado();
  }

  // Nombre del usuario actual
  get nombreUsuario(): string {
    return this.authService.usuarioActual?.nombre ?? '';
  }

  // Rol del usuario actual
  get rolUsuario(): string {
    return this.authService.usuarioActual?.rol ?? '';
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
