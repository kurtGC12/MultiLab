

import { Component, OnInit } from '@angular/core';
import { ResultadosService } from '../../services/resultados';
import { Resultado } from '../../models/resultado';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resultados.html'
})
export class ResultadosComponent implements OnInit {
  resultados: Resultado[] = [];
  loading = false;

  filtro = {
    laboratorioId: undefined as number | undefined,
    analistaId: undefined as number | undefined
  };

  constructor(private resultadosService: ResultadosService) {}

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.loading = true;
    this.resultadosService.getAll(this.filtro).subscribe({
      next: (data) => { this.resultados = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  eliminar(id: number): void {
    this.resultadosService.delete(id).subscribe({
      next: () => this.buscar()
    });
  }
}

export { ResultadosService };
