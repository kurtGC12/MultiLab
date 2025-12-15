import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Navbar } from './navbar';
import { AuthService } from '../../services/auth';


class AuthServiceMock {
  usuarioActual: any = null;

  estaAutenticado(): boolean {
    return !!this.usuarioActual;
  }

  logout(): void {
    this.usuarioActual = null;
  }
}

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let authMock: AuthServiceMock;
  let router: Router;

  beforeEach(async () => {
    authMock = new AuthServiceMock();

    await TestBed.configureTestingModule({
      imports: [Navbar, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  // --------------------------------------------------------------
  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  // --------------------------------------------------------------
  it('estaAutenticado debe delegar en AuthService.estaAutenticado()', () => {
    const spy = spyOn(authMock, 'estaAutenticado').and.callThrough();

    authMock.usuarioActual = null;
    expect(component.estaAutenticado).toBeFalse();

    authMock.usuarioActual = { nombre: 'X', rol: 'USUARIO' };
    expect(component.estaAutenticado).toBeTrue();

    expect(spy).toHaveBeenCalled();
  });

  // --------------------------------------------------------------
  it('nombreUsuario y rolUsuario deben venir de AuthService.usuarioActual', () => {
    authMock.usuarioActual = { nombre: 'Sofía', rol: 'ADMIN' };

    expect(component.nombreUsuario).toBe('Sofía');
    expect(component.rolUsuario).toBe('ADMIN');
  });

  // --------------------------------------------------------------
  it('cerrarSesion() debe hacer logout y navegar a /login', () => {
    authMock.usuarioActual = { nombre: 'Sofía', rol: 'ADMIN' };

    const logoutSpy = spyOn(authMock, 'logout').and.callThrough();
    const navSpy = spyOn(router, 'navigate');

    component.cerrarSesion();

    expect(logoutSpy).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/login']); // según tu Navbar.ts
    expect(authMock.usuarioActual).toBeNull();
  });

  // --------------------------------------------------------------
  it('HTML: si NO hay sesión, debe mostrar "No hay usuario autenticado"', () => {
    authMock.usuarioActual = null;

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('No hay usuario autenticado');
  });

  // --------------------------------------------------------------
  it('HTML: si hay sesión, debe renderizar nombre y rol', () => {
    authMock.usuarioActual = { nombre: 'Kurt', rol: 'USUARIO' };

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Kurt');
    expect(compiled.textContent).toContain('USUARIO');
    expect(compiled.textContent).toContain('Cerrar sesión');
  });

  // --------------------------------------------------------------
  it('HTML: click en "Cerrar sesión" debe llamar cerrarSesion()', () => {
    authMock.usuarioActual = { nombre: 'Kurt', rol: 'USUARIO' };

    const spy = spyOn(component, 'cerrarSesion').and.callThrough();

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const btn = compiled.querySelector('button.nav-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();

    btn.click();
    expect(spy).toHaveBeenCalled();
  });

  // --------------------------------------------------------------
  it('esAdmin y esAnalista inician en false (según implementación actual)', () => {
    expect(component.esAdmin).toBeFalse();
    expect(component.esAnalista).toBeFalse();
  });
});
