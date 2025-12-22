import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of, throwError, Subject } from 'rxjs';

import { Registro } from './registro';
import { UsuariosService } from '../../../services/usuarios';

class UsuariosServiceMock {
  registrar(usuario: any) {
    return of({ id: 1, ...usuario });
  }
}

describe('Registro', () => {
  let component: Registro;
  let fixture: ComponentFixture<Registro>;
  let usuariosService: UsuariosServiceMock;

  beforeEach(async () => {
    usuariosService = new UsuariosServiceMock();

    await TestBed.configureTestingModule({
      imports: [
        Registro, // standalone component
        RouterTestingModule.withRoutes([]), 
        HttpClientTestingModule
      ],
      providers: [{ provide: UsuariosService, useValue: usuariosService }]
    }).compileComponents();

    fixture = TestBed.createComponent(Registro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 
  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar con formulario inválido', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('debería mostrar mensaje de error si el formulario es inválido', () => {
    component.form.setValue({
      nombre: '',
      email: '',
      password: ''
    });

    component.onSubmit();

    expect(component.mensajeError).toBe('Por favor complete todos los campos correctamente.');
    expect(component.mensajeOk).toBeNull();

    expect(component.form.get('nombre')!.touched).toBeTrue();
    expect(component.form.get('email')!.touched).toBeTrue();
    expect(component.form.get('password')!.touched).toBeTrue();
  });


  it('debería llamar a registrar() cuando el formulario es válido', () => {
    const registrarSpy = spyOn(usuariosService, 'registrar').and.callThrough();

    component.form.setValue({
      nombre: 'Kurt',
      email: 'kurtgc@gmail.com',
      password: 'Password1!'
    });

    component.onSubmit();

    expect(registrarSpy).toHaveBeenCalledOnceWith({
      nombre: 'Kurt',
      email: 'kurtgc@gmail.com',
      password: 'Password1!',
      rol: 'USUARIO'
    });

    expect(component.mensajeError).toBeNull();
    expect(component.mensajeOk).toBe(
      'Usuario Kurt registrado correctamente. Ahora puedes iniciar sesión.'
    );
    expect(component.cargando).toBeFalse();
  });

  
  it('debería manejar error si registrar falla', () => {
    spyOn(usuariosService, 'registrar').and.returnValue(
      throwError(() => new Error('Email repetido'))
    );

    component.form.setValue({
      nombre: 'Kurt',
      email: 'kurtgc@gmail.com',
      password: 'Password1!'
    });

    component.onSubmit();

    expect(component.mensajeOk).toBeNull();
    expect(component.mensajeError).toBe(
      'No fue posible registrar el usuario. Verifique el email (no repetido).'
    );
    expect(component.cargando).toBeFalse();
  });

  
  it('debería activar cargando al enviar formulario válido y desactivarlo al finalizar', () => {
    const subject = new Subject<any>();
    spyOn(usuariosService, 'registrar').and.returnValue(subject.asObservable());

    component.form.setValue({
      nombre: 'Francesco',
      email: 'ftossi@mail.com',
      password: 'Password1!'
    });

    component.onSubmit();
    expect(component.cargando).toBeTrue();

    subject.next({ id: 1, nombre: 'Francesco', email: 'ftossi@mail.com' });
    subject.complete();

    expect(component.cargando).toBeFalse();
  });
});
