
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { UsuariosService } from '../../services/usuarios';
import { AuthService } from '../../services/auth';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.css',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class UsuarioList implements OnInit {

  usuarios: Usuario[] = [];
  error = '';

  constructor(
    private usuariosService: UsuariosService,
    private auth: AuthService
  ) {}
 
  ngOnInit(): void {
    // Verificar si el usuario es admin
    if (!this.auth.esAdmin()) {
      this.error = 'Acceso denegado. Solo los administradores pueden ver usuarios.';
      return;
    }
   
    this.cargarUsuarios();
  }
  // Cargar la lista de usuarios
  cargarUsuarios(): void {
    this.usuariosService.obtenerTodos().subscribe({
      next: (data) => this.usuarios = data,
      error: () => this.error = 'No se pudieron cargar los usuarios.'
    });
  }
}
