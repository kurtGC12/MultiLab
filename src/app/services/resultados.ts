

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Resultado } from '../models/resultado';

@Injectable({ providedIn: 'root' })
export class ResultadosService {
 private readonly baseUrl = `${environment.apiBaseUrlRult}/resultados`;

  constructor(private http: HttpClient) {}

  getAll(filtro?: { laboratorioId?: number; analistaId?: number }): Observable<Resultado[]> {
    let params = new HttpParams();
    if (filtro?.laboratorioId != null) params = params.set('laboratorioId', filtro.laboratorioId);
    if (filtro?.analistaId != null) params = params.set('analistaId', filtro.analistaId);

    return this.http.get<Resultado[]>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Resultado> {
    return this.http.get<Resultado>(`${this.baseUrl}/${id}`);
  }

  create(data: Resultado): Observable<Resultado> {
    return this.http.post<Resultado>(this.baseUrl, data);
  }

  createBatch(data: Resultado[]): Observable<Resultado[]> {
    return this.http.post<Resultado[]>(`${this.baseUrl}/batch`, data);
  }

  update(id: number, data: Resultado): Observable<Resultado> {
    return this.http.put<Resultado>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
