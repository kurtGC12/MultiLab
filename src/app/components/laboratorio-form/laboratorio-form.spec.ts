import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { of, throwError, Subject } from 'rxjs';

import { LaboratorioForm } from './laboratorio-form';
import { LaboratorioService } from '../../services/laboratorios';
import { Laboratorio } from '../../models/laboratorio';


class LaboratorioServiceMock {
  getById(id: number) {
    return of({
      id,
      nombre: 'Lab Editado',
      direccion: 'Calle 123',
      telefono: '912345678'
    } as unknown as Laboratorio);
  }

  create(payload: Laboratorio) {
    return of({ ...payload, id: 999 } as any);
  }

  update(id: number, payload: Laboratorio) {
    return of({ ...payload, id } as any);
  }
}

describe('LaboratorioForm ', () => {
  let component: LaboratorioForm;
  let fixture: ComponentFixture<LaboratorioForm>;

  let serviceMock: LaboratorioServiceMock;
  let router: Router;
  let routeId: string | null = null;

  beforeEach(async () => {
    serviceMock = new LaboratorioServiceMock();

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => (key === 'id' ? routeId : null)
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        LaboratorioForm, // standalone
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: LaboratorioService, useValue: serviceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    // default: modo creación
    routeId = null;
    fixture = TestBed.createComponent(LaboratorioForm);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges(); // dispara ngOnInit
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería construir el formulario con validaciones', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.get('nombre')).toBeTruthy();
    expect(component.form.get('direccion')).toBeTruthy();
    expect(component.form.get('telefono')).toBeTruthy();

    // al inicio está inválido (campos requeridos)
    expect(component.form.valid).toBeFalse();
  });

  it('si el formulario es inválido, debería marcar touched y no enviar', () => {
    spyOn(serviceMock, 'create');

    component.form.setValue({ nombre: '', direccion: '', telefono: '' });
    component.onSubmit();

    expect(component.form.get('nombre')!.touched).toBeTrue();
    expect(component.form.get('direccion')!.touched).toBeTrue();
    expect(component.form.get('telefono')!.touched).toBeTrue();
    expect(serviceMock.create).not.toHaveBeenCalled();
  });

  it('debería hacer CREATE cuando el formulario es válido y NO hay id', () => {
    const createSpy = spyOn(serviceMock, 'create').and.callThrough();
    const routerSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.form.setValue({
      nombre: 'Nuevo Lab',
      direccion: 'Av. Principal 12345',
      telefono: '912345678'
    });

    component.onSubmit();

    expect(createSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/laboratorios']);
  });

  it('debería manejar error si CREATE falla', () => {
    spyOn(serviceMock, 'create').and.returnValue(
      throwError(() => new Error('Error create'))
    );

    component.form.setValue({
      nombre: 'Nuevo Lab',
      direccion: 'Av. Principal 12345',
      telefono: '912345678'
    });

    component.onSubmit();

    expect(component.error).toBe('Error al crear el laboratorio.');
  });

  it('debería entrar en modo edición y cargar datos si viene un ID', () => {
    routeId = '10';

    const fx = TestBed.createComponent(LaboratorioForm);
    const cmp = fx.componentInstance;

    const mockLab: Laboratorio = {
      id: 10,
      nombre: 'Lab Test',
      direccion: 'Calle 999',
      telefono: '987654321'
    } as unknown as Laboratorio;

    spyOn(serviceMock, 'getById').and.returnValue(of(mockLab));

    fx.detectChanges(); 

    expect(cmp.editMode).toBeTrue();
    expect(cmp.id).toBe(10);
    expect(serviceMock.getById).toHaveBeenCalledWith(10);
    expect(cmp.form.value.nombre).toBe('Lab Test');
    expect(cmp.loading).toBeFalse();
  });

  it('debería manejar error si getById falla en edición', () => {
    routeId = '5';

    spyOn(serviceMock, 'getById').and.returnValue(
      throwError(() => new Error('Error getById'))
    );

    const fx = TestBed.createComponent(LaboratorioForm);
    const cmp = fx.componentInstance;

    fx.detectChanges(); // ngOnInit

    expect(cmp.error).toBe('No se pudo cargar el laboratorio.');
    expect(cmp.loading).toBeFalse();
  });

  it('debería hacer UPDATE cuando editMode es true', () => {
    const updateSpy = spyOn(serviceMock, 'update').and.callThrough();
    const routerSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    component.editMode = true;
    component.id = 77;

    component.form.setValue({
      nombre: 'Lab Actualizado',
      direccion: 'Nueva Direccion 12345',
      telefono: '999888777'
    });

    component.onSubmit();

    expect(updateSpy).toHaveBeenCalledWith(77, component.form.value);
    expect(routerSpy).toHaveBeenCalledWith(['/laboratorios']);
  });

  it('debería manejar error si UPDATE falla', () => {
    spyOn(serviceMock, 'update').and.returnValue(
      throwError(() => new Error('Error update'))
    );

    component.editMode = true;
    component.id = 77;

    component.form.setValue({
      nombre: 'Lab Actualizado',
      direccion: 'Nueva Direccion 12345',
      telefono: '999888777'
    });

    component.onSubmit();

    expect(component.error).toBe('Error al actualizar el laboratorio.');
  });

  it('debería activar loading mientras carga el laboratorio (edición)', () => {
    routeId = '12';

    const subject = new Subject<Laboratorio>();
    spyOn(serviceMock, 'getById').and.returnValue(subject.asObservable());

    const fx = TestBed.createComponent(LaboratorioForm);
    const cmp = fx.componentInstance;

    fx.detectChanges(); // ngOnInit -> cargarLaboratorio()

    expect(cmp.loading).toBeTrue();

    subject.next({
      id: 12,
      nombre: 'Lab 12',
      direccion: 'Dir 12',
      telefono: '111222333'
    } as unknown as Laboratorio);
    subject.complete();

    expect(cmp.loading).toBeFalse();
  });
});
