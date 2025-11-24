
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { isPlatformBrowser } from '@angular/common';

// Clave usada en LocalStorage
const STORAGE_KEY_USUARIO = 'usuarioActual';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioActualSubject: BehaviorSubject<Usuario | null>;
  public usuarioActual$: Observable<Usuario | null>;
  private isBrowser: boolean = false;


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {

    // Detectar si estamos en el navegador (SSR-safe)
    this.isBrowser = isPlatformBrowser(this.platformId);

    let usuarioInicial: Usuario | null = null;

    // Solo acceder a localStorage si estamos en el navegador
    if (this.isBrowser) {
      const usuarioGuardado = localStorage.getItem(STORAGE_KEY_USUARIO);
      usuarioInicial = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    }

    // Inicializar BehaviorSubject
    this.usuarioActualSubject = new BehaviorSubject<Usuario | null>(usuarioInicial);
    this.usuarioActual$ = this.usuarioActualSubject.asObservable();
  }
 // Getter para obtener el usuario actual de forma sincrónica
  get usuarioActual(): Usuario | null {
    return this.usuarioActualSubject.value;
  }
// Método para iniciar sesión y guardar el usuario en localStorage
  login(usuario: Usuario): void {
    localStorage.setItem(STORAGE_KEY_USUARIO, JSON.stringify(usuario));
    this.usuarioActualSubject.next(usuario);
  }
// Método para actualizar el usuario actual en localStorage
  loginLocal(usuarioActualizado: Usuario): void {
    localStorage.setItem(STORAGE_KEY_USUARIO, JSON.stringify(usuarioActualizado));
    this.usuarioActualSubject.next(usuarioActualizado);
  }
//  Método para cerrar sesión y eliminar el usuario de localStorage
  logout(): void {
    localStorage.removeItem(STORAGE_KEY_USUARIO);
    this.usuarioActualSubject.next(null);
  }
// Método para verificar si hay un usuario autenticado
  estaAutenticado(): boolean {
    return !!this.usuarioActualSubject.value;
  }
// Método para verificar si el usuario actual es ADMIN
  esAdmin(): boolean {
    return this.usuarioActualSubject.value?.rol === 'ADMIN';
  }
// Método para verificar si el usuario actual
  esAnalista(): boolean {
    return this.usuarioActualSubject.value?.rol === 'USUARIO';
  }
}
