import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { ResultadoForm } from './resultado-form';
import { ResultadosService } from '../../services/resultados';

describe('ResultadoForm', () => {

  function makeRoute(id?: string) {
    return {
      snapshot: {
        paramMap: convertToParamMap(id ? { id } : {})
      }
    };
  }

  function build({ id }: { id?: string } = {}) {
    const serviceSpy = jasmine.createSpyObj<ResultadosService>('ResultadosService', [
      'create', 'update', 'getById'
    ]);

    TestBed.configureTestingModule({
      imports: [ResultadoForm, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ResultadosService, useValue: serviceSpy },
        { provide: ActivatedRoute, useValue: makeRoute(id) }
      ]
    });

    const fixture = TestBed.createComponent(ResultadoForm);
    const component = fixture.componentInstance;

    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);

    return { fixture, component, serviceSpy, router };
  }

  it('debe crear el componente y form definido', () => {
    const { fixture, component, serviceSpy } = build();
    serviceSpy.getById.and.returnValue(of({} as any)); // por si acaso
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.form).toBeDefined();
  });

  it('onSubmit debe delegar a guardar (cubre onSubmit)', () => {
    const { fixture, component } = build();
    fixture.detectChanges();
    const spy = spyOn(component, 'guardar');
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('si el formulario es inválido debe marcar touched y NO llamar service', () => {
    const { fixture, component, serviceSpy } = build();
    fixture.detectChanges();

    component.form.patchValue({
      laboratorioId: null,
      analistaId: null,
      fechaResultado: null,
      estado: null
    });

    const markSpy = spyOn(component.form, 'markAllAsTouched');
    component.guardar();

    expect(markSpy).toHaveBeenCalled();
    expect(serviceSpy.create).not.toHaveBeenCalled();
    expect(serviceSpy.update).not.toHaveBeenCalled();
  });

  it('modo create: success debe llamar create y navegar', () => {
    const { fixture, component, serviceSpy, router } = build();
    serviceSpy.create.and.returnValue(of({ id: 1 } as any));

    fixture.detectChanges();

    component.form.patchValue({
      laboratorioId: 1,
      analistaId: 2,
      fechaResultado: '2025-12-21',
      observacion: '', // cubre "|| undefined"
      estado: 'REGISTRADO'
    });

    component.guardar();

    expect(serviceSpy.create).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/resultados']);
    expect(component.saving).toBeFalse();
  });

  it('modo create: error debe setear errorMsg desde err.error.message', () => {
    const { fixture, component, serviceSpy } = build();
    serviceSpy.create.and.returnValue(
      throwError(() => ({ error: { message: 'boom-create' } }))
    );

    fixture.detectChanges();

    component.form.patchValue({
      laboratorioId: 1,
      analistaId: 2,
      fechaResultado: '2025-12-21',
      estado: 'REGISTRADO'
    });

    component.guardar();

    expect(component.errorMsg).toContain('boom-create');
    expect(component.saving).toBeFalse();
  });

  it('modo edit: ngOnInit con id debe llamar cargar y patchValue (success)', () => {
    const { fixture, component, serviceSpy } = build({ id: '5' });

    serviceSpy.getById.and.returnValue(of({
      id: 5,
      laboratorioId: 7,
      analistaId: 9,
      fechaMuestra: null,
      fechaResultado: '2025-12-20',
      observacion: null,
      estado: 'VALIDADO'
    } as any));

    fixture.detectChanges(); // ejecuta ngOnInit -> cargar()

    expect(component.isEdit).toBeTrue();
    expect(component.id).toBe(5);
    expect(serviceSpy.getById).toHaveBeenCalledWith(5);
    expect(component.form.value.laboratorioId).toBe(7);
    expect(component.loading).toBeFalse();
  });

  it('cargar: error debe setear errorMsg con fallback si no hay message', () => {
    const { fixture, component, serviceSpy } = build({ id: '1' });

    serviceSpy.getById.and.returnValue(
      throwError(() => ({ message: '' })) // sin message real
    );

    fixture.detectChanges();

    expect(component.errorMsg).toBe('No se pudo cargar el resultado.');
    expect(component.loading).toBeFalse();
  });

  it('modo edit: update success debe llamar update y navegar', () => {
    const { fixture, component, serviceSpy, router } = build({ id: '1' });

    serviceSpy.getById.and.returnValue(of({
      id: 1,
      laboratorioId: 1,
      analistaId: 2,
      fechaResultado: '2025-12-21',
      estado: 'REGISTRADO'
    } as any));

    serviceSpy.update.and.returnValue(of({} as any));

    fixture.detectChanges();

    component.form.patchValue({
      laboratorioId: 10,
      analistaId: 20,
      fechaResultado: '2025-12-21',
      estado: 'VALIDADO'
    });

    component.guardar();

    expect(serviceSpy.update).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/resultados']);
    expect(component.saving).toBeFalse();
  });

  it('modo edit: update error debe setear errorMsg desde err.message', () => {
    const { fixture, component, serviceSpy } = build({ id: '1' });

    serviceSpy.getById.and.returnValue(of({
      id: 1,
      laboratorioId: 1,
      analistaId: 2,
      fechaResultado: '2025-12-21',
      estado: 'REGISTRADO'
    } as any));

    serviceSpy.update.and.returnValue(
      throwError(() => ({ message: 'update-fail' }))
    );

    fixture.detectChanges();

    component.form.patchValue({
      laboratorioId: 10,
      analistaId: 20,
      fechaResultado: '2025-12-21',
      estado: 'VALIDADO'
    });

    component.guardar();

    expect(component.errorMsg).toContain('update-fail');
    expect(component.saving).toBeFalse();
  });

  it('cancelar debe navegar a /resultados', () => {
    const { fixture, component, router } = build();
    fixture.detectChanges();
    component.cancelar();
    expect(router.navigate).toHaveBeenCalledWith(['/resultados']);
  });

  it('hasError debe retornar true si control touched + required', () => {
    const { fixture, component } = build();
    fixture.detectChanges();

    const c = component.form.get('laboratorioId')!;
    c.setValue(null);
    c.markAsTouched();

    expect(component.hasError('laboratorioId', 'required')).toBeTrue();
  });
});
