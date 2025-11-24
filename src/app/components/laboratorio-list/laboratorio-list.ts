import { Component, OnInit } from '@angular/core';
import { LaboratorioService } from '../../services/laboratorios';
import { Laboratorio } from '../../models/laboratorio';
import { AuthService } from '../../services/auth';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-laboratorio-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './laboratorio-list.html',
  styleUrls: ['./laboratorio-list.css'],
})
export class LaboratorioList implements OnInit {

  laboratorios: Laboratorio[] = [];
  loading = false;
  error = '';

  constructor(
    private laboratorioService: LaboratorioService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarLaboratorios();
  }

  cargarLaboratorios(): void {
    this.loading = true;

    this.laboratorioService.getAll().subscribe({
      next: (data) => {
        this.laboratorios = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los laboratorios.';
        this.loading = false;
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar este laboratorio?')) return;

    this.laboratorioService.delete(id).subscribe({
      next: () => {
        this.laboratorios = this.laboratorios.filter(l => l.id !== id);
      },
      error: () => {
        alert('No se pudo eliminar el laboratorio.');
      }
    });
  }
}