import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { UsuariosService } from '../../../services/usuarios';

@Component({
  selector: 'registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {

  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);
  private router = inject(Router);

  mensajeError: string | null = null;
  mensajeOk: string | null = null;
  cargando = false;

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    this.mensajeError = null;
    this.mensajeOk = null;

    if (this.form.invalid) {
      this.mensajeError = 'Por favor complete todos los campos correctamente.';
      this.form.markAllAsTouched();
      return;
    }

    const { nombre, email, password } = this.form.value;
    if (!nombre || !email || !password) {
      this.mensajeError = 'Nombre, email y contraseña son obligatorios.';
      return;
    }

    this.cargando = true;

    this.usuariosService.registrar({
      nombre,
      email,
      password,
      rol: 'USUARIO'
    }).subscribe({
      next: usuario => {
        this.cargando = false;
        this.mensajeOk = `Usuario ${usuario.nombre} registrado correctamente. Ahora puedes iniciar sesión.`;
        // Opcional: redirigir automáticamente después de unos segundos
        // this.router.navigate(['/login']);
      },
      error: err => {
        this.cargando = false;
        console.error('Error en registro', err);
        this.mensajeError = 'No fue posible registrar el usuario. Verifique el email (no repetido).';
      }
    });
  }
}