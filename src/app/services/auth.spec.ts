
import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { AuthService } from './auth';
import { Usuario } from '../models/usuario';

const STORAGE_KEY_USUARIO = 'usuarioActual';

let store: Record<string, string> = {};

const mockLocalStorage = {
  getItem: (key: string): string | null => (key in store ? store[key] : null),
  setItem: (key: string, value: string): void => {
    store[key] = value;
  },
  removeItem: (key: string): void => {
    delete store[key];
  },
  clear: (): void => {
    store = {};
  }
};

describe('AuthService ', () => {
  beforeEach(() => {
    store = {};

   
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
  });

 
  function createService(platformId: 'browser' | 'server'): AuthService {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: platformId }
      ]
    });
    return TestBed.inject(AuthService);
  }

  it('debería crearse correctamente', () => {
    const service = createService('browser');
    expect(service).toBeTruthy();
  });

  it('debería iniciar con usuario null si localStorage no tiene usuario', () => {
    const service = createService('browser');
    expect(service.usuarioActual).toBeNull();
    expect(service.estaAutenticado()).toBeFalse();
  });

  it('debería cargar usuario desde localStorage en constructor (modo browser)', () => {
    const usuario: Usuario = {
      id: 1,
      nombre: 'Test',
      email: 't@tgmail.com',
      password: 'Password1!',
      rol: 'ADMIN'
    } as Usuario;

   
    localStorage.setItem(STORAGE_KEY_USUARIO, JSON.stringify(usuario));

    const service = createService('browser');
    expect(service.usuarioActual).toEqual(usuario);
  });

  it('en modo server NO debería leer localStorage en el constructor', () => {
    localStorage.setItem(STORAGE_KEY_USUARIO, JSON.stringify({ id: 1 }));

    const service = createService('server');

    
    expect(localStorage.getItem).not.toHaveBeenCalled();
    expect(service.usuarioActual).toBeNull();
  });

  it('login() debería guardar usuario y actualizar usuarioActual', () => {
    const service = createService('browser');

    const usuario: Usuario = {
      id: 1,
      nombre: 'Juan',
      email: 'j@x.com',
      password: 'Password1!',
      rol: 'USUARIO'
    } as Usuario;

    service.login(usuario);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_USUARIO,
      JSON.stringify(usuario)
    );
    expect(service.usuarioActual).toEqual(usuario);
    expect(service.estaAutenticado()).toBeTrue();
  });

  it('loginLocal() debería actualizar usuario y persistir en localStorage', () => {
    const service = createService('browser');

    const usuarioInicial: Usuario = {
      id: 1,
      nombre: 'A',
      email: 'a@a.com',
      password: 'Password1!',
      rol: 'USUARIO'
    } as Usuario;

    const usuarioActualizado: Usuario = {
      ...usuarioInicial,
      nombre: 'Nuevo Nombre'
    } as Usuario;

    service.login(usuarioInicial);
    service.loginLocal(usuarioActualizado);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEY_USUARIO,
      JSON.stringify(usuarioActualizado)
    );
    expect(service.usuarioActual).toEqual(usuarioActualizado);
  });

  it('logout() debería eliminar usuario de localStorage y dejar usuarioActual null', () => {
    const service = createService('browser');

    const usuario: Usuario = {
      id: 1,
      nombre: 'A',
      email: 'a@a.com',
      password: 'Password1!',
      rol: 'ADMIN'
    } as Usuario;

    service.login(usuario);
    service.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY_USUARIO);
    expect(service.usuarioActual).toBeNull();
    expect(service.estaAutenticado()).toBeFalse();
  });

  it('esAdmin() y esAnalista() deberían funcionar según rol', () => {
    const service = createService('browser');

    service.login({ id: 1, nombre: 'X', email: 'x@x.com', password: 'Password1!', rol: 'ADMIN' } as Usuario);
    expect(service.esAdmin()).toBeTrue();
    expect(service.esAnalista()).toBeFalse();

    // En tu AuthService, "Analista" = rol 'USUARIO'
    service.login({ id: 2, nombre: 'Y', email: 'y@y.com', password: 'Password1!', rol: 'USUARIO' } as Usuario);
    expect(service.esAdmin()).toBeFalse();
    expect(service.esAnalista()).toBeTrue();
  });

  it('usuarioActual$ debería emitir cambios al hacer login/logout', (done) => {
    const service = createService('browser');

    const emisiones: Array<Usuario | null> = [];
    const sub = service.usuarioActual$.subscribe(v => emisiones.push(v));

    service.login({ id: 1, nombre: 'Fran', email: 'f@f.com', password: 'Password1!', rol: 'ADMIN' } as Usuario);
    service.logout();

    // Primer valor: el inicial (null), luego usuario, luego null
    expect(emisiones.length).toBe(3);
    expect(emisiones[0]).toBeNull();
    expect(emisiones[1]?.nombre).toBe('Fran');
    expect(emisiones[2]).toBeNull();

    sub.unsubscribe();
    done();
  });
});
