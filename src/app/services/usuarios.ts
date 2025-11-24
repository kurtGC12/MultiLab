
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

 private readonly apiUrl = `${environment.apiBaseUrlUser}/usuarios`;

  constructor(private http: HttpClient) {}

  // ----------------------- LOGIN --------------------------------
  login(email: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { email, password });
  }

  // ----------------------- REGISTRO ------------------------------
  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/registro`, usuario);
  }

  // ----------------------- RECUPERAR -----------------------------
  recuperarPorEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/recuperar/${email}`);
  }

  // ----------------------- PERFIL (GET) --------------------------
  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  // ----------------------- PERFIL (PUT) --------------------------
  actualizarPerfil(id: number, data: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}/perfil`, data);
  }

  // ----------------------- ADMIN: LISTAR TODOS -------------------
  obtenerTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}`);
  }
}