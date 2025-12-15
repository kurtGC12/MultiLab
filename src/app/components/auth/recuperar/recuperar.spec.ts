
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { Recuperar } from './recuperar';
import { UsuariosService } from '../../../services/usuarios';

class UsuariosServiceMock {
  recuperarPorEmail(email: string) {
    return of({
      nombre: 'Usuario Test',
      rol: 'ADMIN',
      password: 'Password1!'
    });
  }
}

describe('Recuperar contraseña', () => {
  let component: Recuperar;
  let fixture: ComponentFixture<Recuperar>;
  let usuariosService: UsuariosServiceMock;

  beforeEach(async () => {
    usuariosService = new UsuariosServiceMock();

    await TestBed.configureTestingModule({
      imports: [Recuperar], 
      providers: [{ provide: UsuariosService, useValue: usuariosService }]
    }).compileComponents();

    fixture = TestBed.createComponent(Recuperar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
   
  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  //  Email vacío → mensajeError
  it('debería mostrar error si el formulario es inválido (email vacío)', () => {
    component.form.setValue({ email: '' });

    component.onSubmit();

    expect(component.mensajeError).toBe('Ingrese un email válido.');
    expect(component.mensajeOk).toBeNull();

    const emailCtrl = component.form.get('email')!;
    expect(emailCtrl.touched).toBeTrue();
  });

  //  Email no válido → mensajeError
  it('debería mostrar error si el email no tiene formato válido', () => {
    component.form.setValue({ email: 'no-es-email' });

    component.onSubmit();

    expect(component.mensajeError).toBe('Ingrese un email válido.');
    expect(component.mensajeOk).toBeNull();
  });

  //  Email válido → llamar a recuperarPorEmail
  it('debería llamar a recuperarPorEmail si el formulario es válido', () => {
    const spyRecuperar = spyOn(usuariosService, 'recuperarPorEmail').and.callThrough();

    component.form.setValue({ email: 'test@mail.com' });

    component.onSubmit();

    expect(spyRecuperar).toHaveBeenCalledOnceWith('test@mail.com');
    expect(component.mensajeError).toBeNull();
    expect(component.mensajeOk).toContain('Usuario encontrado: Usuario Test');
    expect(component.mensajeOk).toContain('(rol ADMIN)');
  });

  // 5) Error del servicio → mensajeError
  it('debería manejar error si recuperarPorEmail falla', () => {
    spyOn(usuariosService, 'recuperarPorEmail').and.returnValue(
      throwError(() => new Error('No existe'))
    );

    component.form.setValue({ email: 'fail@mail.com' });

    component.onSubmit();

    expect(component.mensajeOk).toBeNull();
    expect(component.mensajeError).toBe('No se encontró un usuario con ese email.');
  });

  //  Marcar touched si inválido
  it('debería marcar touched si el formulario es inválido', () => {
    const emailCtrl = component.form.get('email')!;
    expect(emailCtrl.touched).toBeFalse();

    component.onSubmit();

    expect(emailCtrl.touched).toBeTrue();
  });
});
