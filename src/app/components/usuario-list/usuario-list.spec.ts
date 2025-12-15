
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UsuarioList } from './usuario-list';

import { UsuariosService } from '../../services/usuarios';
import { AuthService } from '../../services/auth';
import { Usuario } from '../../models/usuario';

import { Observable, of, throwError } from 'rxjs';


class AuthServiceMock implements Partial<AuthService> {
  isAdmin = false;
  esAdmin(): boolean {
    return this.isAdmin;
  }
}

class UsuariosServiceMock implements Partial<UsuariosService> {
  obtenerTodos(): Observable<Usuario[]> {
    return of([] as Usuario[]);
  }
}

describe('UsuarioList ', () => {
  let component: UsuarioList;
  let fixture: ComponentFixture<UsuarioList>;

  let authMock: AuthServiceMock;
  let usuariosMock: UsuariosServiceMock;

  const crearComponente = async () => {
    await TestBed.configureTestingModule({
      imports: [
        UsuarioList,          
        RouterTestingModule  
      ],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: UsuariosService, useValue: usuariosMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuarioList);
    component = fixture.componentInstance;
  };

  beforeEach(() => {
    authMock = new AuthServiceMock();
    usuariosMock = new UsuariosServiceMock();
  });

  // ----------------------------------------------------------------------
  it('debería crearse el componente', async () => {
    authMock.isAdmin = true;
    await crearComponente();

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  // ----------------------------------------------------------------------
  it('debería bloquear acceso si NO es admin y NO llamar al servicio', async () => {
    authMock.isAdmin = false;

    // Espiamos el método del servicio para asegurar que NO se llame
    const spyObtener = spyOn(usuariosMock, 'obtenerTodos').and.callThrough();

    await crearComponente();
    fixture.detectChanges(); // dispara ngOnInit()

    expect(component.error)
      .toBe('Acceso denegado. Solo los administradores pueden ver usuarios.');
    expect(component.usuarios.length).toBe(0);
    expect(spyObtener).not.toHaveBeenCalled();
  });

  // ----------------------------------------------------------------------
  it('debería cargar usuarios si ES admin', async () => {
    authMock.isAdmin = true;

    const mockUsuarios: Usuario[] = [
      { id: 1, nombre: 'Admin', email: 'admin@mail.com', password: '', rol: 'ADMIN' } as Usuario,
      { id: 2, nombre: 'User',  email: 'user@mail.com',  password: '', rol: 'USUARIO' } as Usuario
    ];

    spyOn(usuariosMock, 'obtenerTodos').and.returnValue(of(mockUsuarios));

    await crearComponente();
    fixture.detectChanges(); // ngOnInit()

    expect(component.error).toBe('');
    expect(component.usuarios).toEqual(mockUsuarios);
  });

  // ----------------------------------------------------------------------
  it('debería manejar error cuando obtenerTodos() falla', async () => {
    authMock.isAdmin = true;

    spyOn(usuariosMock, 'obtenerTodos').and.returnValue(
      throwError(() => new Error('Fallo backend'))
    );

    await crearComponente();
    fixture.detectChanges();

    expect(component.usuarios.length).toBe(0);
    expect(component.error).toBe('No se pudieron cargar los usuarios.');
  });

  // ----------------------------------------------------------------------
  it('debería renderizar filas y badges en el HTML cuando hay usuarios', async () => {
    authMock.isAdmin = true;

    const mockUsuarios: Usuario[] = [
      { id: 1, nombre: 'Admin', email: 'admin@mail.com', password: '', rol: 'ADMIN' } as Usuario,
      { id: 2, nombre: 'User',  email: 'user@mail.com',  password: '', rol: 'USUARIO' } as Usuario
    ];

    spyOn(usuariosMock, 'obtenerTodos').and.returnValue(of(mockUsuarios));

    await crearComponente();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    const rows = compiled.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);

    // Texto visible
    expect(compiled.textContent).toContain('Admin');
    expect(compiled.textContent).toContain('User');

    // Badges según rol (HTML actual)
    expect(compiled.querySelectorAll('.badge-admin').length).toBe(1);
    expect(compiled.querySelectorAll('.badge-user').length).toBe(1);
  });

  // ----------------------------------------------------------------------
  it('debería mostrar template de error en el HTML cuando NO es admin', async () => {
    authMock.isAdmin = false;

    await crearComponente();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    // En errorTemplate hay .alert-error
    const alert = compiled.querySelector('.alert-error');
    expect(alert?.textContent)
      .toContain('Acceso denegado. Solo los administradores pueden ver usuarios.');

    // Tabla no debería mostrarse
    expect(compiled.querySelector('table.user-table')).toBeNull();
  });
});
