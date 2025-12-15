import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of, Subject, throwError } from 'rxjs';
import { AuthService } from '../../../services/auth';
import { UsuariosService } from '../../../services/usuarios';
import { Router } from '@angular/router';

import { Login } from './login';

class UsuariosServiceMock {
  login(email: string, password: string) {
    return of({ id: 1, email, nombre: 'Usuario Test' });
  }
}
class AuthServiceMock {
  login(usuario: any) {}
}
describe('Login (Semana 7)', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let usuariosService: UsuariosServiceMock;
  let authService: AuthServiceMock;
  let router: Router;

  beforeEach(async () => {
    usuariosService = new UsuariosServiceMock();
    authService = new AuthServiceMock();

    await TestBed.configureTestingModule({
      imports: [
        Login, // componente standalone
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule
      ],
      providers: [
        { provide: UsuariosService, useValue: usuariosService },
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });
 it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener formulario inválido al inicio', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('debería mostrar mensaje de error si el formulario es inválido', () => {
    component.onSubmit();
    expect(component.mensajeError).toBe('Por favor complete el formulario correctamente.');
  });

  it('debería hacer login correctamente y navegar a laboratorios', () => {
    const loginSpy = spyOn(usuariosService, 'login').and.callThrough();
    const authSpy = spyOn(authService, 'login').and.callThrough();
    const routerSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.form.setValue({
      email: 'test@mail.com',
      password: 'Password1!'
    });

    component.onSubmit();

    expect(component.cargando).toBeFalse();
    expect(component.mensajeError).toBeNull();
    expect(loginSpy).toHaveBeenCalledOnceWith('test@mail.com', 'Password1!');
    expect(authSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/laboratorios']);
  });

  it('debería manejar error en login y mostrar mensajeError', () => {
    const loginSpy = spyOn(usuariosService, 'login').and.returnValue(
      throwError(() => new Error('Credenciales inválidas'))
    );
    const authSpy = spyOn(authService, 'login').and.callThrough();
    const routerSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.form.setValue({
      email: 'fail@mail.com',
      password: 'Password2!'
    });

    component.onSubmit();

    expect(component.cargando).toBeFalse();
    expect(loginSpy).toHaveBeenCalled();
    expect(authSpy).not.toHaveBeenCalled();
    expect(routerSpy).not.toHaveBeenCalled();
    expect(component.mensajeError).toBe('Credenciales inválidas o error en el servidor.');
  });

  it('debería activar cargando al enviar formulario válido (antes de resolver el Observable)', () => {
    const subject = new Subject<any>();
    spyOn(usuariosService, 'login').and.returnValue(subject.asObservable());
    spyOn(authService, 'login').and.callThrough();
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.form.setValue({
      email: 'test@mail.com',
      password: 'Password1!'
    });

    component.onSubmit();
    expect(component.cargando).toBeTrue();

    subject.next({ id: 1, email: 'test@mail.com', nombre: 'Usuario Test' });
    subject.complete();

    expect(component.cargando).toBeFalse();
  });
});

