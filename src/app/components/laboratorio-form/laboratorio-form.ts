import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LaboratorioService } from '../../services/laboratorios';
import { Laboratorio } from '../../models/laboratorio';


@Component({
  selector: 'app-laboratorio-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './laboratorio-form.html',
  styleUrls: ['./laboratorio-form.css']
})
export class LaboratorioForm implements OnInit {

  form!: FormGroup;
  editMode = false;
  id!: number;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private laboratorioService: LaboratorioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });

    // Obtener id desde URL (si existe)
    const paramId = this.route.snapshot.paramMap.get('id');

    if (paramId) {
      this.editMode = true;
      this.id = Number(paramId);
      this.cargarLaboratorio();
    }
  }

  cargarLaboratorio(): void {
    this.loading = true;

    this.laboratorioService.getById(this.id).subscribe({
      next: (lab) => {
        this.form.patchValue(lab);
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el laboratorio.';
        this.loading = false;
      }
    });
  }

  hasError(control: string, error?: string) {
    const c = this.form.get(control);
    return error ? c?.hasError(error) && c.touched : c?.invalid && c.touched;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const laboratorio: Laboratorio = this.form.value;

    if (this.editMode) {
      this.actualizar(laboratorio);
    } else {
      this.crear(laboratorio);
    }
  }

  crear(lab: Laboratorio): void {
    this.laboratorioService.create(lab).subscribe({
      next: () => this.router.navigate(['/laboratorios']),
      error: () => this.error = 'Error al crear el laboratorio.'
    });
  }

  actualizar(lab: Laboratorio): void {
    this.laboratorioService.update(this.id, lab).subscribe({
      next: () => this.router.navigate(['/laboratorios']),
      error: () => this.error = 'Error al actualizar el laboratorio.'
    });
  }
}
