

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ResultadosService } from '../../services/resultados';
import { EstadoResultado, Resultado } from '../../models/resultado';

@Component({
  selector: 'app-resultado-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './resultado-form.html'
})
export class ResultadoForm implements OnInit {
 onSubmit(): void {
  this.guardar();
}  
  form!: FormGroup;

  loading = false;
  saving = false;
  errorMsg = '';

  isEdit = false;
  id?: number;

  estados: EstadoResultado[] = ['REGISTRADO', 'VALIDADO', 'RECHAZADO'];

  constructor(
    private fb: FormBuilder,
    private resultadosService: ResultadosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      laboratorioId: [null, [Validators.required, Validators.min(1)]],
      analistaId: [null, [Validators.required, Validators.min(1)]],
      fechaMuestra: [null], // opcional
      fechaResultado: [this.hoyISO(), [Validators.required]], // requerido en tu entidad
      observacion: [null, [Validators.maxLength(500)]],
      estado: ['REGISTRADO', [Validators.required]]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.id = Number(idParam);
      this.cargar(this.id);
    }
  }

  cargar(id: number): void {
    this.loading = true;
    this.errorMsg = '';

    this.resultadosService.getById(id).subscribe({
      next: (r) => {
        this.form.patchValue({
          laboratorioId: r.laboratorioId,
          analistaId: r.analistaId,
          fechaMuestra: r.fechaMuestra ?? null,
          fechaResultado: r.fechaResultado ?? this.hoyISO(),
          observacion: r.observacion ?? null,
          estado: r.estado
        });
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = this.getErrorMessage(err, 'No se pudo cargar el resultado.');
      }
    });
  }

  guardar(): void {
    this.errorMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Resultado = {
      laboratorioId: Number(this.form.value.laboratorioId),
      analistaId: Number(this.form.value.analistaId),
      fechaMuestra: this.form.value.fechaMuestra || undefined,
      fechaResultado: this.form.value.fechaResultado || undefined,
      observacion: this.form.value.observacion || undefined,
      estado: this.form.value.estado as EstadoResultado
    };

    this.saving = true;

    if (this.isEdit && this.id) {
      this.resultadosService.update(this.id, payload).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/resultados']);
        },
        error: (err) => {
          this.saving = false;
          this.errorMsg = this.getErrorMessage(err, 'No se pudo actualizar el resultado.');
        }
      });
    } else {
      this.resultadosService.create(payload).subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/resultados']);
        },
        error: (err) => {
          this.saving = false;
          this.errorMsg = this.getErrorMessage(err, 'No se pudo crear el resultado.');
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/resultados']);
  }

  // Helpers UI
  hasError(controlName: string, errorCode: string): boolean {
    const c = this.form.get(controlName);
    return !!(c && c.touched && c.hasError(errorCode));
  }

  private hoyISO(): string {
    // YYYY-MM-DD
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private getErrorMessage(err: any, fallback: string): string {
    // intenta mostrar info útil si backend devuelve body con message
    const msg = err?.error?.message || err?.error?.error || err?.message;
    return msg ? String(msg) : fallback;
  }
}

