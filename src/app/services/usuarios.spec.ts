
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UsuariosService } from './usuarios';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiBaseUrlUser}/usuarios`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuariosService]
    });

    service = TestBed.inject(UsuariosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('login(): debería hacer POST /usuarios/login con body correcto', () => {
    const mockUsuario: Usuario = {
      id: 1,
      nombre: 'Admin',
      email: 'admin@mail.com',
      password: 'Password1!',
      rol: 'ADMIN'
    } as Usuario;

    service.login('admin@mail.com', 'Password1!').subscribe(usuario => {
      expect(usuario).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'admin@mail.com', password: 'Password1!' });

    req.flush(mockUsuario);
  });

  it('registrar(): debería hacer POST /usuarios/registro con body correcto', () => {
    const nuevoUsuario: Usuario = {
      id: 5,
      nombre: 'Nuevo',
      email: 'nuevo@mail.com',
      password: 'Password1!',
      rol: 'USUARIO'
    } as Usuario;

    service.registrar(nuevoUsuario).subscribe(resp => {
      expect(resp).toEqual(nuevoUsuario);
    });

    const req = httpMock.expectOne(`${apiUrl}/registro`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nuevoUsuario);

    req.flush(nuevoUsuario);
  });

  it('recuperarPorEmail(): debería hacer GET /usuarios/recuperar/:email', () => {
    const mockUsuario: Usuario = {
      id: 22,
      nombre: 'Test',
      email: 'test@mail.com',
      password: 'Password1!',
      rol: 'USUARIO'
    } as Usuario;

    service.recuperarPorEmail('test@mail.com').subscribe(resp => {
      expect(resp).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne(`${apiUrl}/recuperar/test@mail.com`);
    expect(req.request.method).toBe('GET');

    req.flush(mockUsuario);
  });

  it('obtenerPorId(): debería hacer GET /usuarios/:id', () => {
    const mockUsuario: Usuario = {
      id: 10,
      nombre: 'Usuario 10',
      email: 'u10@mail.com',
      password: 'Password1!',
      rol: 'USUARIO'
    } as Usuario;

    service.obtenerPorId(10).subscribe(resp => {
      expect(resp).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne(`${apiUrl}/10`);
    expect(req.request.method).toBe('GET');

    req.flush(mockUsuario);
  });

  it('actualizarPerfil(): debería hacer PUT /usuarios/:id/perfil con body correcto', () => {
    const cambios: Partial<Usuario> = {
      nombre: 'Nuevo Nombre'
    };

    const respuesta: Usuario = {
      id: 1,
      nombre: 'Nuevo Nombre',
      email: 'a@mail.com',
      password: 'Password1!',
      rol: 'USUARIO'
    } as Usuario;

    service.actualizarPerfil(1, cambios).subscribe(resp => {
      expect(resp).toEqual(respuesta);
    });

    const req = httpMock.expectOne(`${apiUrl}/1/perfil`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(cambios);

    req.flush(respuesta);
  });

  it('obtenerTodos(): debería hacer GET /usuarios', () => {
    const listaMock: Usuario[] = [
      { id: 1, nombre: 'Admin', email: 'a@mail.com', password: 'Password1!', rol: 'ADMIN' } as Usuario,
      { id: 2, nombre: 'User', email: 'b@mail.com', password: 'Password1!', rol: 'USUARIO' } as Usuario
    ];

    service.obtenerTodos().subscribe(resp => {
      expect(resp.length).toBe(2);
      expect(resp).toEqual(listaMock);
    });

    const req = httpMock.expectOne(`${apiUrl}`);
    expect(req.request.method).toBe('GET');

    req.flush(listaMock);
  });
});
