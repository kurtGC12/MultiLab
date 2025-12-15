
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { UsuariosService } from '../../../services/usuarios';

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ,RouterModule],
  templateUrl: './login.html'
})
export class Login {

  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);
  private authService = inject(AuthService);
  private router = inject(Router);

  mensajeError: string | null = null;
  cargando = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  // -----------------------------------------------------------
  // Enviar formulario
  // -----------------------------------------------------------
  onSubmit(): void {
    this.mensajeError = null;

    if (this.form.invalid) {
      this.mensajeError = 'Por favor complete el formulario correctamente.';
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.value;
    if (!email || !password) {
      this.mensajeError = 'Email y contraseña son obligatorios.';
      return;
    }

    this.cargando = true;

    this.usuariosService.login(email, password).subscribe({
      next: usuario => {
        this.cargando = false;
        // Guardamos usuario en AuthService (y LocalStorage)
        this.authService.login(usuario);
        // Redirigimos a la lista de laboratorios
        this.router.navigate(['/laboratorios']);
      },
      error: err => {
        this.cargando = false;
        console.error('Error en login', err);
        this.mensajeError = 'Credenciales inválidas o error en el servidor.';
      }
    });
  }
}
