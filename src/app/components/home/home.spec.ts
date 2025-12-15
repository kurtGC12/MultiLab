import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Home } from './home';
import { AuthService } from '../../services/auth';

class AuthServiceMock {
  usuarioActual: any = null;

  estaAutenticado(): boolean {
    return !!this.usuarioActual;
  }
}
describe('Home ', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let authService: AuthServiceMock;
  let router: Router;

  beforeEach(async () => {
    authService = new AuthServiceMock();

    await TestBed.configureTestingModule({
      imports: [
        Home, // standalone
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería indicar NO autenticado cuando no hay usuario', () => {
    authService.usuarioActual = null;
    expect(component.estaAutenticado).toBeFalse();
  });

  it('debería indicar autenticado cuando hay usuario', () => {
    authService.usuarioActual = { nombre:'Kurt', rol: 'ADMIN' };
    expect(component.estaAutenticado).toBeTrue();
  });

  it('debería devolver nombre del usuario', () => {
    authService.usuarioActual = { nombre: 'Camila', rol: 'ANALISTA' };
    expect(component.nombreUsuario).toBe('Camila');
  });

  it('debería devolver rol del usuario', () => {
    authService.usuarioActual = { nombre: 'X', rol: 'ADMIN' };
    expect(component.rolUsuario).toBe('ADMIN');
  });

  it('irALogin debería navegar a /login', () => {
    const spy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.irALogin();
    expect(spy).toHaveBeenCalledWith(['/login']);
  });

  it('irARegistro debería navegar a /registro', () => {
    const spy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.irARegistro();
    expect(spy).toHaveBeenCalledWith(['/registro']);
  });

  it('irALaboratorios debería navegar a /laboratorios', () => {
    const spy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.irALaboratorios();
    expect(spy).toHaveBeenCalledWith(['/laboratorios']);
  });
});
