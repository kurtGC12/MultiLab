import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Perfil } from './perfil';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '../../services/auth';
import { UsuariosService } from '../../services/usuarios';

import { of, throwError } from 'rxjs';


class AuthServiceMock {
  usuarioActual: any = null;

  loginLocal(usuario: any) {
    this.usuarioActual = usuario;
  }
}

class UsuariosServiceMock {
  actualizarPerfil(id: number, data: any) {
    return of(data);
  }
}

describe('Perfil ', () => {
  let component: Perfil;
  let fixture: ComponentFixture<Perfil>;
  let authMock: AuthServiceMock;
  let usuariosMock: UsuariosServiceMock;
  let router: Router;

  beforeEach(async () => {
    authMock = new AuthServiceMock();
    usuariosMock = new UsuariosServiceMock();

    await TestBed.configureTestingModule({
      imports: [
        Perfil, // standalone
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: UsuariosService, useValue: usuariosMock }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  function crearComponente(): void {
    fixture = TestBed.createComponent(Perfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  // ======================================================================
  it('debería crearse el componente', () => {
    authMock.usuarioActual = {
      id: 1, nombre: 'User', email: 'u@u.com', password: 'X', rol: 'USUARIO'
    };
    crearComponente();
    expect(component).toBeTruthy();
  });

  // ======================================================================
  it('debería mostrar error si NO hay sesión activa', () => {
    authMock.usuarioActual = null;

    crearComponente();

    expect(component.error).toBe('No hay sesión activa.');
  });

  // ======================================================================
  it('debería mostrar error si es ADMIN', () => {
    authMock.usuarioActual = {
      id: 1,
      nombre: 'Admin',
      email: 'admin@test.com',
      password: 'X',
      rol: 'ADMIN'
    };

    crearComponente();

    expect(component.error).toBe('Un ADMIN no puede modificar perfil aquí.');
  });

  // ======================================================================
  it('debería cargar datos si el usuario NO es ADMIN (ej: USUARIO)', () => {
    authMock.usuarioActual = {
      id: 5,
      nombre: 'Ana',
      email: 'ana@test.com',
      password: 'abc',
      rol: 'USUARIO'
    };

    crearComponente();

    expect(component.error).toBe('');
    expect(component.usuario.id).toBe(5);
    expect(component.usuario.nombre).toBe('Ana');
    expect(component.usuario.email).toBe('ana@test.com');
    expect(component.usuario.password).toBe('abc');
    expect(component.usuario.rol).toBe('USUARIO');
  });

  // ======================================================================
  it('debería actualizar perfil, actualizar sesión y navegar a /home (con delay)', fakeAsync(() => {
    authMock.usuarioActual = {
      id: 10,
      nombre: 'Pepe',
      email: 'pepe@test.com',
      password: 'old',
      rol: 'USUARIO'
    };

    crearComponente();

    const usuarioActualizado = {
      id: 10,
      nombre: 'Nuevo',
      email: 'pepe@test.com',
      password: 'new',
      rol: 'USUARIO'
    };

    const srvSpy = spyOn(usuariosMock, 'actualizarPerfil').and.returnValue(of(usuarioActualizado));
    const loginLocalSpy = spyOn(authMock, 'loginLocal').and.callThrough();
    const routerSpy = spyOn(router, 'navigate');

    
    component.usuario.nombre = 'Nuevo';
    component.usuario.password = 'new';

    component.guardarCambios();

    expect(srvSpy).toHaveBeenCalledWith(10, component.usuario);
    expect(component.mensaje).toBe('Perfil actualizado correctamente.');
    expect(loginLocalSpy).toHaveBeenCalledWith(usuarioActualizado);

    // navegación ocurre después de 1000ms
    tick(1000);
    expect(routerSpy).toHaveBeenCalledWith(['/home']);
  }));

  // ======================================================================
  it('debería manejar error al actualizar perfil', () => {
    authMock.usuarioActual = {
      id: 10,
      nombre: 'Pepe',
      email: 'pepe@test.com',
      password: 'old',
      rol: 'USUARIO'
    };

    crearComponente();

    spyOn(usuariosMock, 'actualizarPerfil')
      .and.returnValue(throwError(() => new Error('Error servidor')));

    component.guardarCambios();

    expect(component.error).toBe('No se pudieron guardar los cambios.');
  });
});
