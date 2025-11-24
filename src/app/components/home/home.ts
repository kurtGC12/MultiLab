import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {


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
  // Navegación
 irALogin(): void {
    this.router.navigate(['/login']);
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }

  irALaboratorios(): void {
    this.router.navigate(['/laboratorios']);
  }

}
