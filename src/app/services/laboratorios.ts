import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';            // Cliente HTTP nativo de Angular
import { Observable } from 'rxjs';                            // Mecanismo reactivo para respuestas asíncronas
import { environment } from '../../environments/environment'; // Donde está la URL base del backend
import { Laboratorio } from '../models/laboratorio';      // Modelo de datos de Laboratorio


@Injectable({
  providedIn: 'root',
})
export class LaboratorioService {
  private readonly apiUrl = `${environment.apiBaseUrlabs}/laboratorios`;

  constructor(private http: HttpClient) {}
  
  // Obtener todos los laboratorios
  getAll(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.apiUrl);
  }
  // Obtener laboratorio por ID
  getById(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.apiUrl}/${id}`);
  }
  // Crear laboratorio  
   create(data: Omit<Laboratorio, 'id'>): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(this.apiUrl, data);
  }
  // Actualizar laboratorio
  update(id: number, data: Partial<Laboratorio>): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(`${this.apiUrl}/${id}`, data);
  }
  // Eliminar laboratorio
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


}
