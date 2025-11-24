
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar.html',
  styleUrls: ['./recuperar.css']
})
export class Recuperar{

  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);

  mensajeError: string | null = null;
  mensajeOk: string | null = null;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    this.mensajeError = null;
    this.mensajeOk = null;

    if (this.form.invalid) {
      this.mensajeError = 'Ingrese un email válido.';
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.value.email!;
    this.usuariosService.recuperarPorEmail(email).subscribe({
      next: usuario => {
      
        this.mensajeOk =
          `Usuario encontrado: ${usuario.nombre} (rol ${usuario.rol}). ` +
          ` tu contraseña actual es: ${usuario.password}`;
      },
      error: err => {
        console.error('Error al recuperar contraseña', err);
        this.mensajeError = 'No se encontró un usuario con ese email.';
      }
    });
  }
}
