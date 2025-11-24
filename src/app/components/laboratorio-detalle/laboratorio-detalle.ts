import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LaboratorioService } from '../../services/laboratorios';
import { Laboratorio } from '../../models/laboratorio';

@Component({
  selector: 'app-laboratorio-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './laboratorio-detalle.html',
  styleUrls: ['./laboratorio-detalle.css']
})
export class LaboratorioDetalle implements OnInit {

  laboratorio!: Laboratorio;
  loading = false;
  error = '';

  constructor(
    private service: LaboratorioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error = 'ID inválido.';
      return;
    }

    this.cargarLaboratorio(id);
  }

  cargarLaboratorio(id: number): void {
    this.loading = true;

    this.service.getById(id).subscribe({
      next: (lab) => {
        this.laboratorio = lab;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el laboratorio.';
        this.loading = false;
      }
    });
  }
}
