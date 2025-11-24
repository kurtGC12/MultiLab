

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { UsuariosService } from '../../services/usuarios';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil {

  private auth = inject(AuthService);
  private usuariosSrv = inject(UsuariosService);
  private router = inject(Router);

  mensaje = '';
  error = '';

  
  usuario: Usuario = {
    id: 0,
    nombre: '',
    email: '',
    password: '',
    rol: 'USUARIO'
  };

  constructor() {

    const sesion = this.auth.usuarioActual;

    if (!sesion) {
      this.error = 'No hay sesión activa.';
      return;
    }

    if (sesion.rol === 'ADMIN') {
      this.error = 'Un ADMIN no puede modificar perfil aquí.';
      return;
    }

    this.usuario = {
      id: sesion.id!,
      nombre: sesion.nombre,
      email: sesion.email,       
      password: sesion.password ?? '',
      rol: sesion.rol              
    };
  }

  // ======================================================================
  // PUT → /api/usuarios/{id}/perfil
  // ======================================================================
  guardarCambios(): void {
    this.mensaje = '';
    this.error = '';

    this.usuariosSrv.actualizarPerfil(this.usuario.id!, this.usuario).subscribe({
      next: (data) => {
        this.mensaje = 'Perfil actualizado correctamente.';

        // Actualizar usuario en sesión
        this.auth.loginLocal(data);

        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      },
      error: () => {
        this.error = 'No se pudieron guardar los cambios.';
      }
    });
  }
}